# Todo App

A simple todo app: FastAPI + SQLite backend, plain HTML/CSS/JS frontend.

## Run the backend

```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API runs at http://localhost:8000 — interactive docs at http://localhost:8000/docs

## Run the frontend

Just open `frontend/index.html` in your browser (with the backend running).

## Backend files, in reading order

| File | Purpose |
|------|---------|
| `database.py` | DB connection + `get_db` session dependency |
| `models.py` | SQLAlchemy table definitions |
| `schemas.py` | Pydantic models for request/response validation |
| `crud.py` | Functions that read/write the DB |
| `routers/todos.py` | The `/todos` endpoints |
| `main.py` | Creates the app, CORS, includes routers |
