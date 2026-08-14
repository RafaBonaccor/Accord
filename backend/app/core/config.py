import os

from pydantic_settings import BaseSettings, SettingsConfigDict


default_frontend_url = f"https://{os.environ['VERCEL_URL']}" if "VERCEL_URL" in os.environ else "http://localhost:3000"
default_shipping_countries = "IT,SM,VA,FR,DE,ES,PT,NL,BE,AT,IE,LU,GB,US,CH"


class Settings(BaseSettings):
    database_url: str = "sqlite:///./accordi_jewelry.db"
    stripe_secret_key: str = "sk_test_your_key"
    stripe_webhook_secret: str = ""
    stripe_price_currency: str = "eur"
    stripe_shipping_countries: str = default_shipping_countries
    frontend_url: str = default_frontend_url
    admin_api_token: str = "change-me-admin-token"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
