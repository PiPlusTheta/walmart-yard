from typing import Union
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from dotenv import load_dotenv
from os import getenv
from starlette.middleware.cors import CORSMiddleware
import uvicorn
from basemodels import trailers, items, orders, queues
from firebase_admin import credentials, auth, initialize_app, firestore

from collections import deque

load_dotenv()

cred = credentials.Certificate("serviceAccountKey.json")
app = initialize_app(cred)
db = firestore.client()


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_headers=["*"],
    allow_methods=["*"],
    allow_origins=["*"],
)


@app.get("/")
async def read_root():
    return {"Hello": "World"}


"""
    Trailers section
"""


@app.get("/trailers/{trailer_id}", response_model=trailers)
async def read_trailer(trailer_id: str):
    doc_ref = db.collection("trailers").document(trailer_id)
    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Trailer not found")
    return doc.to_dict()


@app.delete("/trailers/{trailer_id}", response_model=dict)
async def delete_trailer(trailer_id: str):
    doc_ref = db.collection("trailers").document(trailer_id)
    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Trailer not found")
    doc_ref.delete()
    return {"detail": "Trailer deleted"}


"""
    Items section
"""


@app.post("/items/", response_model=items)
async def create_item(item: items):
    doc_ref = db.collection("items")
    doc_ref.add(item.model_dump())
    return item


@app.get("/items/{item_id}", response_model=items)
async def read_item(item_id: str):
    doc_ref = db.collection("items").document(item_id)
    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Item not found")
    return doc.to_dict()


@app.put("/items/{item_id}", response_model=items)
async def update_item(item_id: str, item: items):
    doc_ref = db.collection("items").document(item_id)
    doc_ref.update(item.model_dump())
    return item


@app.delete("/items/{item_id}", response_model=dict)
async def delete_item(item_id: str):
    doc_ref = db.collection("trailers").document(item_id)
    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Item not found")
    doc_ref.delete()
    return {"detail": "Item deleted"}


"""
    Orders section
"""


@app.post("/orders/", response_model=orders)
async def create_order(order: orders):
    doc_ref = db.collection("orders")
    doc_ref.add(order.model_dump())
    return order


@app.get("/orders/{order_id}", response_model=orders)
async def read_order(order_id: str):
    doc_ref = db.collection("orders").document(order_id)
    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Order not found")
    return doc.to_dict()


@app.delete("/orders/{order_id}", response_model=dict)
async def delete_order(order_id: str):
    doc_ref = db.collection("orders").document(order_id)
    doc = doc_ref.get()
    print(doc.to_dict())
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Order not found")
    doc_ref.delete()
    return {"detail": "Order deleted"}


"""
    Queue section
"""


@app.get("/queues/{queue}", response_model=queues)
async def read_order(queue: str):
    doc_ref = db.collection("queues").document(queue)
    docs = await doc_ref.get()
    if not docs.exists:
        raise HTTPException(status_code=404, detail="Order not found")
    return docs.to_dict()


@app.put("/queues/trailersQueue")
async def enqueue_trailer(trailer: trailers):

    if not trailer.trailer_id:
        trailersDoc = db.collection("trailers")
        _, ref = trailersDoc.add(trailer.model_dump())
        trailer.trailer_id = ref.id

    # Pushing current trailer to
    trailersQueueDoc = db.collection("queues").document("trailersQueue")
    trailersQueueDoc.update({"queue": firestore.ArrayUnion([trailer.trailer_id])})
    trailersQueue = deque(trailersQueueDoc.get().to_dict()["queue"])
    trailersDoc = db.collection("trailers")
    # Gets the earliest Trailer
    trailerID = trailersQueue.popleft()
    trailer = trailersDoc.document(trailerID).get().to_dict()

    ordersQueueDoc = db.collection("queues").document("ordersQueue")
    ordersQueue = deque(ordersQueueDoc.get().to_dict()["queue"])
    ordersDoc = db.collection("orders")
    orders = {}
    for order_doc in ordersDoc.stream():
        orders[order_doc.id] = order_doc.to_dict()
    if ordersQueue:
        for orderID in ordersQueue:
            order = orders[orderID]
            # if the capacity of order can be fit inside the trailer
            print(order)
            if order["quantity"] <= trailer["capacity"]:
                trailer["status"] = "Move"
                trailer["order_id"] = orderID
                trailersDoc.document(trailerID).update(trailer)
                # update_trailer(trailerID, trailer)
                order["trailer_id"] = trailerID
                # update_order(orderID, order)
                ordersDoc.document(orderID).update(order)
                trailersQueueDoc.update({"queue": firestore.ArrayRemove([trailerID])})
                ordersQueueDoc.update({"queue": firestore.ArrayRemove([orderID])})
                break

    return {"detail": "Success"}


# Fix required


@app.put("/queues/ordersQueue")
async def enqueue_order(order: orders):
    if not order.order_id:
        ordersDoc = db.collection("orders")
        _, ref = ordersDoc.add(order.model_dump())
        order.order_id = ref.id

    ordersQueueDoc = db.collection("queues").document("ordersQueue")
    ordersQueueDoc.update({"queue": firestore.ArrayUnion([order.order_id])})
    ordersQueue = deque(ordersQueueDoc.get().to_dict()["queue"])
    ordersDoc = db.collection("orders")

    orderID = ordersQueue.popleft()
    order = ordersDoc.document(orderID).get().to_dict()

    trailersQueueDoc = db.collection("queues").document("trailersQueue")
    trailersQueue = deque(trailersQueueDoc.get().to_dict()["queue"])
    trailersDoc = db.collection("trailers")
    trailers = {}

    for trailer_doc in trailersDoc.stream():
        trailers[trailer_doc.id] = trailer_doc.to_dict()

    if trailersQueue:

        for trailerID in trailersQueue:
            trailer = trailers[trailerID]

            print(trailer)

            if order["quantity"] <= trailer["capacity"]:
                order["status"] = "Move"
                order["trailer_id"] = trailerID
                ordersDoc.document(orderID).update(order)

                trailer["order_id"] = orderID
                # update_trailer(trailerID, trailer)
                trailersDoc.document(trailerID).update(trailer)
                ordersQueueDoc.update({"queue": firestore.ArrayRemove([orderID])})
                trailersQueueDoc.update({"queue": firestore.ArrayRemove([trailerID])})
                break

    return {"detail": "Success"}
