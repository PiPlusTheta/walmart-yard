from pydantic import BaseModel
from typing import Union, Optional


class trailers(BaseModel):
    capacity: str
    status: str
    order_id: Optional[str]
    trailer_id: None | str


class items(BaseModel):
    item_id: Optional[str]
    quantity: str
    name: str
    rackpos: str


class orders(BaseModel):
    order_id: Optional[str]
    trailer_id: Optional[str]
    item_id: Optional[str]
    quantity: str


class queues(BaseModel):
    queue: list
