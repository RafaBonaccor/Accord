from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "sqlite:///./accordi_jewelry.db"
    stripe_secret_key: str = "sk_test_your_key"
    stripe_price_currency: str = "eur"
    frontend_url: str = "http://localhost:3000"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
