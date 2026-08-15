from __future__ import annotations

import random
import re
import time
from pathlib import Path

import requests
from fastapi import UploadFile

from app.core.config import settings


class StorageConfigurationError(Exception):
    pass


class StorageUploadError(Exception):
    pass


def _require_storage_config() -> tuple[str, str, str]:
    if not settings.supabase_url or not settings.supabase_service_role_key:
        raise StorageConfigurationError(
            "Supabase Storage non e configurato. Inserisci SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY."
        )
    return (
        settings.supabase_url.rstrip("/"),
        settings.supabase_service_role_key,
        settings.supabase_storage_bucket,
    )


def _slugify_filename(filename: str) -> str:
    stem = Path(filename).stem.lower()
    slug = re.sub(r"[^a-z0-9]+", "-", stem).strip("-")
    return slug[:80] or "product-image"


def _build_storage_path(filename: str) -> str:
    extension = Path(filename).suffix.lower() or ".jpg"
    stamp = f"{int(time.time() * 1000)}-{random.randint(1000, 9999)}"
    return f"admin/{_slugify_filename(filename)}-{stamp}{extension}"


async def upload_product_image(file: UploadFile) -> tuple[str, str]:
    supabase_url, service_role_key, bucket = _require_storage_config()
    if not file.filename:
        raise StorageUploadError("Nome file immagine mancante")

    path = _build_storage_path(file.filename)
    payload = await file.read()
    content_type = file.content_type or "application/octet-stream"

    response = requests.post(
        f"{supabase_url}/storage/v1/object/{bucket}/{path}",
        headers={
            "Authorization": f"Bearer {service_role_key}",
            "apikey": service_role_key,
            "Content-Type": content_type,
            "x-upsert": "true",
        },
        data=payload,
        timeout=30,
    )

    if not response.ok:
        detail = "Supabase Storage upload failed"
        try:
            data = response.json()
            detail = data.get("message") or data.get("error") or detail
        except Exception:
            if response.text:
                detail = response.text
        raise StorageUploadError(detail)

    public_url = f"{supabase_url}/storage/v1/object/public/{bucket}/{path}"
    return public_url, path
