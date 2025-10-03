from pydantic import BaseSettings

class Settings(BaseSettings):
    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGODB_DB: str = "wellness"
    # add more env vars later: SECRET_KEY, JWT_EXP, etc.

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
