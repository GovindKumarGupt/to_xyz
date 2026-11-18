from pydantic import BaseModel, ConfigDict


class TodoCreate(BaseModel):
    """What the client sends to create a todo."""

    title: str


class TodoUpdate(BaseModel):
    """What the client sends to update a todo (all fields optional)."""

    title: str | None = None
    completed: bool | None = None


class TodoOut(BaseModel):
    """What the API returns."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    completed: bool
