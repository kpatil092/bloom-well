# from motor.motor_asyncio import AsyncIOMotorClient
# from beanie import init_beanie
# from ..config import settings
# from ..models.user import User

# _mongo_client: AsyncIOMotorClient | None = None

# async def init_db():
#     """
#     Call this during FastAPI startup to initialize Motor + Beanie.
#     """
#     global _mongo_client
#     _mongo_client = AsyncIOMotorClient(settings.MONGODB_URI)
#     db = _mongo_client[settings.MONGODB_DB]
#     # Initialize Beanie with our document models
#     await init_beanie(database=db, document_models=[User])
#     print("✅ MongoDB + Beanie initialized")

# def get_motor_client() -> AsyncIOMotorClient:
#     if _mongo_client is None:
#         raise RuntimeError("Mongo client not initialized. Call init_db() first.")
#     return _mongo_client
