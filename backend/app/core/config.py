from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "GotaAGota Bank"
    DEBUG: bool = True
    DATABASE_URL: str = "postgresql://postgres:postgres@db:5432/gotagota"
    SECRET_KEY: str = "super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 horas

    class Config:
        env_file = ".env"


settings = Settings()
