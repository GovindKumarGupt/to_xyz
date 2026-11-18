# create_engine: creates the connection to the database
# sessionmaker: factory that creates database sessions (conversations with the DB)
# declarative_base: base class that all our ORM models (tables) will inherit from
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Database location. "sqlite:///./todos.db" means a SQLite database stored in
# a file called todos.db in the current working directory.
SQLALCHEMY_DATABASE_URL = "sqlite:///./todos.db"

# The engine is the core object that manages the actual connection to the DB.
# check_same_thread=False is needed for SQLite because FastAPI may handle a
# request in a different thread than the one that created the connection.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# SessionLocal is a session factory bound to our engine.
# autocommit=False: changes are only saved when we explicitly call db.commit()
# autoflush=False: pending changes aren't sent to the DB automatically before queries
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for
# our models. Every model class (e.g. Todo) inherits from it,
# so SQLAlchemy knows which classes map to database tables.
Base = declarative_base()


# FastAPI dependency: gives each request its own database session
# and guarantees it is closed afterwards.
def get_db():
    # Open a new session for this request
    db = SessionLocal()
    try:
        # Hand the session to the route function that asked for it
        yield db
    finally:
        # Runs after the request finishes (even on errors): release the connection
        db.close()
