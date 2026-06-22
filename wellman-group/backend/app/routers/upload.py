import asyncio
import io
import logging
from typing import Literal

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from PIL import Image, UnidentifiedImageError
from pydantic import BaseModel, Field

from app.dependencies import get_current_admin
from app.models.admin_user import AdminUser
from app.services.cloudinary_service import delete_asset, upload_image, upload_pdf

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/admin/upload", tags=["Upload"])

_ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
_ALLOWED_IMAGE_FORMATS = {"JPEG", "PNG", "WEBP", "GIF"}
_MAX_IMAGE_BYTES = 10 * 1024 * 1024   # 10 MB
_MAX_PDF_BYTES = 20 * 1024 * 1024     # 20 MB
_PDF_MAGIC = b"%PDF-"


def _looks_like_valid_image(data: bytes) -> bool:
    """Verify the bytes actually decode as one of the allowed image formats —
    the Content-Type header alone is client-supplied and easily spoofed."""
    try:
        with Image.open(io.BytesIO(data)) as img:
            img.verify()
            return img.format in _ALLOWED_IMAGE_FORMATS
    except (UnidentifiedImageError, OSError, ValueError):
        return False


# ── Response / Request schemas (upload-specific, not shared) ──────────────────

class ImageUploadResponse(BaseModel):
    url: str
    public_id: str
    width: int | None = None
    height: int | None = None
    format: str | None = None
    size: int | None = None


class PdfUploadResponse(BaseModel):
    url: str
    public_id: str
    size: int | None = None


class DeleteRequest(BaseModel):
    public_id: str = Field(min_length=1)
    resource_type: Literal["image", "raw"] = "image"


# ── Routes ────────────────────────────────────────────────────────────────────

@router.post(
    "/image",
    response_model=ImageUploadResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_image_route(
    file: UploadFile = File(...),
    _: AdminUser = Depends(get_current_admin),
):
    if file.content_type not in _ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=(
                f"Unsupported content type '{file.content_type}'. "
                "Accepted: image/jpeg, image/png, image/webp, image/gif."
            ),
        )

    data = await file.read()

    if len(data) > _MAX_IMAGE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Image file exceeds the 10 MB limit.",
        )

    if not await asyncio.to_thread(_looks_like_valid_image, data):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="File content does not match a valid image (JPEG, PNG, WEBP, or GIF).",
        )

    try:
        result = await asyncio.to_thread(upload_image, data)
    except Exception:
        logger.exception("Cloudinary image upload failed")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Image upload failed. Please try again.",
        )

    return result


@router.post(
    "/pdf",
    response_model=PdfUploadResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_pdf_route(
    file: UploadFile = File(...),
    _: AdminUser = Depends(get_current_admin),
):
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Only PDF files are accepted (application/pdf).",
        )

    data = await file.read()

    if len(data) > _MAX_PDF_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="PDF file exceeds the 20 MB limit.",
        )

    if not data.startswith(_PDF_MAGIC):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="File content does not match a valid PDF.",
        )

    try:
        result = await asyncio.to_thread(upload_pdf, data)
    except Exception:
        logger.exception("Cloudinary PDF upload failed")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="PDF upload failed. Please try again.",
        )

    return result


@router.delete("", status_code=status.HTTP_200_OK)
def delete_asset_route(
    body: DeleteRequest,
    _: AdminUser = Depends(get_current_admin),
):
    try:
        deleted = delete_asset(body.public_id, body.resource_type)
    except Exception:
        logger.exception("Cloudinary delete failed")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Delete failed. Please try again.",
        )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset not found or already deleted.",
        )

    return {"message": "Asset deleted successfully."}
