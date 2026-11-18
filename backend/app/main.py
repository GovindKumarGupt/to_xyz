from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models
from .database import engine
from .routers import todos

# Create tables on startup (fine for learning; use Alembic migrations later)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Todo API")

# Allow the plain HTML frontend (any origin, incl. file://) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(todos.router)


@app.get("/")
def root():
    return {"message": "Todo API is running. See /docs"}
