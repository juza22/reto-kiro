from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "GotaAGota Bank"
    DEBUG: bool = True
    # SQLite por defecto para desarrollo/demo local (sin instalar Postgres).
    # En Docker/producción se sobreescribe con DATABASE_URL (Postgres).
    DATABASE_URL: str = "sqlite:///./gotagota.db"
    SECRET_KEY: str = "super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 horas

    class Config:
        env_file = ".env"


settings = Settings()
