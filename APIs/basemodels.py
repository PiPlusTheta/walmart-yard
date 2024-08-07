from pydantic import BaseModel


class users(BaseModel):
    # role: str
    email: str
    email_verified: bool
    phone_number: str
    password: str
    display_name: str
    disabled: bool


class trailers(BaseModel):
    capacity: str
    status: str
    item_id: str


class items(BaseModel):
    quantity: str
    name: str
    rackpos: str


class orders(BaseModel):
    tid: str
    status: str
    quantity: str


class queues(BaseModel):
    queue: list
