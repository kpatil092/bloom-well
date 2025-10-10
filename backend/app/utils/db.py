from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

client = AsyncIOMotorClient(settings.MONGO_URI)
db = client[settings.DB_NAME]

async def init_db():
    await db.users.create_index("email", unique=True)
    await db.users.create_index("username", unique=True)

    await db.refresh_tokens.create_index("token_hash", unique=True)
    await db.refresh_tokens.create_index("expires_at", expireAfterSeconds=0)
