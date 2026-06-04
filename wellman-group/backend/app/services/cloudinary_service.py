import cloudinary
import cloudinary.uploader

from app.core.config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True,
)

_IMAGE_FOLDER = "wellman-group/images"
_PDF_FOLDER = "wellman-group/pdfs"


def upload_image(file_bytes: bytes) -> dict:
    """
    Upload an image to Cloudinary.
    Returns secure_url, public_id, width, height, format, and byte size.
    Raises on any Cloudinary error.
    """
    result = cloudinary.uploader.upload(
        file_bytes,
        folder=_IMAGE_FOLDER,
        resource_type="image",
        quality="auto",
        fetch_format="auto",
    )
    return {
        "url": result["secure_url"],
        "public_id": result["public_id"],
        "width": result.get("width"),
        "height": result.get("height"),
        "format": result.get("format"),
        "size": result.get("bytes"),
    }


def upload_pdf(file_bytes: bytes) -> dict:
    """
    Upload a PDF to Cloudinary as a raw asset.
    Returns secure_url, public_id, and byte size.
    Raises on any Cloudinary error.
    """
    result = cloudinary.uploader.upload(
        file_bytes,
        folder=_PDF_FOLDER,
        resource_type="raw",
    )
    return {
        "url": result["secure_url"],
        "public_id": result["public_id"],
        "size": result.get("bytes"),
    }


def delete_asset(public_id: str, resource_type: str = "image") -> bool:
    """
    Delete an asset from Cloudinary by its public_id.
    Returns True if deleted, False if not found.
    Raises on any Cloudinary API error.
    """
    result = cloudinary.uploader.destroy(public_id, resource_type=resource_type)
    return result.get("result") == "ok"
