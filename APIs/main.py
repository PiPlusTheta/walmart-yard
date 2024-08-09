from typing import Union
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from dotenv import load_dotenv
from os import getenv
from basemodels import users, trailers, items, orders, queues
from firebase_admin import credentials, firestore, auth, initialize_app
from collections import deque

cred = credentials.Certificate("serviceAccountKey.json")
app = initialize_app(cred)
db = firestore.client()

load_dotenv()

app = FastAPI()


@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.post("/users/")
async def create_user(user: users, request: Request):
    # print(request.json())
    # doc_ref = db.collection("users")
    # doc_ref.add(user.model_dump())
    # return user

    created_user = auth.create_user(**user.model_dump())
    return "Sucessfully created new user: {0}".format(created_user.uid)


@app.get("/users/{uid}")
async def read_user(uid: str):
    user = auth.get_user(uid)
    print("Successfully fetched user data: ", user)

    return user


@app.put("/users/{uid}", response_model=users)
async def update_user(user: users):
    doc_ref = db.collection("users").document(user.uid)
    doc_ref.update(user.model_dump())
    return user


@app.delete("/users/{uid}")
async def delete_users(uid: str):
    doc_ref = db.collection("users").document(uid)
    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="User not found")
    doc_ref.delete()
    return {"detail": "User deleted"}


@app.post("/trailers/", response_model=trailers)
async def create_trailer(trailer: trailers):
    doc_ref = db.collection("trailers").document(trailer.tid)
    doc_ref.set(trailer.model_dump())
    return trailer


@app.get("/trailers/{tid}", response_model=trailers)
async def read_trailer(tid: str):
    doc_ref = db.collection("trailers").document(tid)
    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Trailer not found")
    return doc.to_dict()


@app.put("/trailers/{tid}", response_model=trailers)
async def update_trailer(tid: str, trailer: trailers):
    doc_ref = db.collection("trailers").document(tid)
    doc_ref.update(trailer.model_dump())
    return trailer


@app.delete("/trailers/{tid}", response_model=dict)
async def delete_trailer(tid: str):
    doc_ref = db.collection("trailers").document(tid)
    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Trailer not found")
    doc_ref.delete()
    return {"detail": "Trailer deleted"}


# Items CRUD operations
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


# orders CRUD operations
@app.post("/orders/", response_model=orders)
async def create_order(order: orders):
    doc_ref = db.collection("orders")
    doc_ref.add(order.model_dump())
    return order


@app.get("/orders/{oid}", response_model=orders)
async def read_order(oid: str):
    doc_ref = db.collection("orders").document(oid)
    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Order not found")
    return doc.to_dict()


@app.put("/orders/{oid}", response_model=orders)
async def update_order(oid: str, order: orders):
    doc_ref = db.collection("orders").document(oid)
    doc_ref.update(order.model_dump())
    return order


@app.delete("/orders/{oid}", response_model=dict)
async def delete_order(oid: str):
    doc_ref = db.collection("orders").document(oid)
    doc = doc_ref.get()
    print(doc.to_dict())
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Order not found")
    doc_ref.delete()
    return {"detail": "Order deleted"}


@app.get("/queues/{queue}", response_model=queues)
async def read_order(queue: str):
    doc_ref = db.collection("queues").document(queue)
    docs = doc_ref.get()
    if not docs.exists:
        raise HTTPException(status_code=404, detail="Order not found")
    return docs.to_dict()


@app.put("/queues/trailersQueue")
async def update_order():
    trailersDoc = db.collection("queues").document("trailersQueue")
    trailersDoc.update({"queue": firestore.ArrayUnion(["28"])})
    trailers = deque(trailersDoc.get().to_dict()["queue"])
    trailerID = trailers.popleft()
    ordersDoc = db.collection("queues").document("ordersQueue")
    orders = deque(ordersDoc.get().to_dict()["queue"])
    if orders:
        ordersID = orders.popleft()
        order = db.collection("orders").document("ordersID")
    return "Success!"


@app.put("/queues/ordersQueue")
async def update_order(queue: str):
    doc_ref = db.collection("queues").document(queue)
    doc_ref.update({"queue": firestore.ArrayUnion(["28"])})
    return "Success!"
