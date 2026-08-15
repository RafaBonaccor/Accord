from __future__ import annotations

import logging
import mimetypes
import random
import re
import time
from pathlib import Path

import requests
from fastapi import UploadFile

from app.core.config import settings


logger = logging.getLogger(__name__)


class StorageConfigurationError(Exception):
    pass


class StorageUploadError(Exception):
    pass


ALLOWED_IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif",
    ".bmp",
    ".tif",
    ".tiff",
    ".svg",
    ".avif",
    ".heic",
    ".heif",
    ".jfif",
}


def _require_storage_config() -> tuple[str, str, str]:
    if not settings.supabase_url or not settings.supabase_service_role_key:
        logger.error(
            "storage config missing: has_supabase_url=%s has_service_role_key=%s bucket=%s",
            bool(settings.supabase_url),
            bool(settings.supabase_service_role_key),
            settings.supabase_storage_bucket,
        )
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


def _resolve_image_content_type(file: UploadFile) -> str:
    extension = Path(file.filename or "").suffix.lower()
    guessed_type, _ = mimetypes.guess_type(file.filename or "")
    declared_type = (file.content_type or "").strip().lower()

    if declared_type.startswith("image/"):
        return declared_type
    if extension in ALLOWED_IMAGE_EXTENSIONS and guessed_type:
        return guessed_type
    if extension in ALLOWED_IMAGE_EXTENSIONS:
        if extension in {".jpg", ".jpeg", ".jfif"}:
            return "image/jpeg"
        if extension == ".svg":
            return "image/svg+xml"
        if extension == ".heic":
            return "image/heic"
        if extension == ".heif":
            return "image/heif"
        return f"image/{extension.lstrip('.')}"
    if guessed_type and guessed_type.startswith("image/"):
        return guessed_type
    logger.warning(
        "storage rejected image format: filename=%s declared_type=%s guessed_type=%s extension=%s",
        file.filename,
        declared_type,
        guessed_type,
        extension,
    )
    raise StorageUploadError(
        "Unsupported image format. Use jpg, jpeg, png, webp, gif, bmp, tif, tiff, svg, avif, heic or heif."
    )


async def upload_product_image(file: UploadFile) -> tuple[str, str]:
    supabase_url, service_role_key, bucket = _require_storage_config()
    if not file.filename:
        logger.warning("storage upload rejected: missing filename")
        raise StorageUploadError("Nome file immagine mancante")

    path = _build_storage_path(file.filename)
    payload = await file.read()
    if not payload:
        logger.warning("storage upload rejected: empty file payload filename=%s path=%s", file.filename, path)
        raise StorageUploadError("Image file is empty")
    content_type = _resolve_image_content_type(file)
    logger.warning(
        "storage upload starting: filename=%s path=%s bucket=%s bytes=%s declared_type=%s resolved_type=%s",
        file.filename,
        path,
        bucket,
        len(payload),
        file.content_type,
        content_type,
    )

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
        logger.error(
            "storage upload failed: status=%s bucket=%s path=%s detail=%s",
            response.status_code,
            bucket,
            path,
            detail,
        )
        raise StorageUploadError(detail)

    public_url = f"{supabase_url}/storage/v1/object/public/{bucket}/{path}"
    logger.warning(
        "storage upload succeeded: filename=%s bucket=%s path=%s public_url=%s",
        file.filename,
        bucket,
        path,
        public_url,
    )
    return public_url, path
