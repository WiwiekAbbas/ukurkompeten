from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    
    # Redis
    UPSTASH_REDIS_REST_URL: str
    UPSTASH_REDIS_REST_TOKEN: str
    
    # JWT
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Frontend
    FRONTEND_URL: str = "http://localhost:3000"
    
    # Payment
    MIDTRANS_SERVER_KEY: str
    MIDTRANS_CLIENT_KEY: str
    MIDTRANS_IS_PRODUCTION: bool = False
    
    # Email
    RESEND_API_KEY: str
    EMAIL_FROM: str = "noreply@ukurkompeten.id"
    
    class Config:
        env_file = ".env"


settings = Settings()
