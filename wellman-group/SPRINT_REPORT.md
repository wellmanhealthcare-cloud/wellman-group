Sprint: 8 — Cloudinary Upload Service
Status: COMPLETE

## Files Created:

- app/services/cloudinary_service.py
- app/routers/upload.py

## Files Modified:

- app/main.py
  Added: `from app.routers import upload` and
  `app.include_router(upload.router, prefix=settings.API_V1_PREFIX)`

## Database Changes:

None.

## API Routes Added:

  POST   /v1/admin/upload/image   — Protected. Upload image to Cloudinary.
  POST   /v1/admin/upload/pdf     — Protected. Upload PDF to Cloudinary.
  DELETE /v1/admin/upload         — Protected. Delete asset from Cloudinary by public_id.

## Models Added:

None.

## Schemas Added:

  Inline in app/routers/upload.py (upload-specific, not shared across the app):
    ImageUploadResponse  { url, public_id, width, height, format, size }
    PdfUploadResponse    { url, public_id, size }
    DeleteRequest        { public_id: str, resource_type: Literal["image","raw"] }

## Services Added:

  app/services/cloudinary_service.py

    upload_image(file_bytes: bytes) -> dict
      Uploads to folder wellman-group/images/ with resource_type="image".
      Applies quality="auto" and fetch_format="auto" for CDN optimization.
      Returns: url, public_id, width, height, format, size.

    upload_pdf(file_bytes: bytes) -> dict
      Uploads to folder wellman-group/pdfs/ with resource_type="raw".
      Raw type preserves the PDF binary exactly, no transcoding.
      Returns: url, public_id, size.

    delete_asset(public_id: str, resource_type: str = "image") -> bool
      Calls cloudinary.uploader.destroy().
      Returns True if Cloudinary confirms deletion, False if not found.
      Raises on API errors (network, auth, etc.).

## Route Details:

  POST /v1/admin/upload/image
    Input:   multipart/form-data, field "file"
    Output:  ImageUploadResponse (201 Created)
    Validation:
      content_type ∈ {image/jpeg, image/png, image/webp, image/gif} → 422
      file size > 10 MB → 413
    Cloudinary error → 502 Bad Gateway
    Auth: Bearer token required

  POST /v1/admin/upload/pdf
    Input:   multipart/form-data, field "file"
    Output:  PdfUploadResponse (201 Created)
    Validation:
      content_type != application/pdf → 422
      file size > 20 MB → 413
    Cloudinary error → 502 Bad Gateway
    Auth: Bearer token required

  DELETE /v1/admin/upload
    Input:   JSON body { "public_id": "...", "resource_type": "image"|"raw" }
    Output:  { "message": "Asset deleted successfully." } (200)
    Pydantic validates resource_type via Literal — invalid values → 422
    Asset not found → 404
    Cloudinary error → 502
    Auth: Bearer token required

## Known Issues:

  1. Content-type spoofing.
     Validation is based on the Content-Type header sent by the client, not
     actual file magic bytes. A client could send a non-image file with
     Content-Type: image/jpeg and it would pass validation. Fix: use the
     `python-magic` library to inspect the first bytes of the file.

  2. Blocking SDK inside async context.
     cloudinary.uploader.upload/destroy are synchronous and block the OS thread.
     Both upload routes wrap these calls in asyncio.to_thread() so the event
     loop is not blocked. The delete route is a sync `def` — FastAPI runs it
     in a thread pool automatically.

  3. File already in memory before size check.
     `await file.read()` buffers the entire file before the size check runs.
     For truly large uploads this wastes memory. A streaming size-check
     middleware would be needed to reject oversized files before fully reading
     them. Acceptable for the current scale (< 100 concurrent admins).

  4. No deduplication.
     Uploading the same file twice creates two Cloudinary assets. Not a
     functional issue but increases storage usage. Cloudinary supports
     unique_filename and overwrite options if deduplication is needed later.

  5. Cloudinary credentials not validated at startup.
     If CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET are empty strings (the
     defaults in config.py), uploads will fail at runtime with a 502. There
     is no startup check. This is intentional — the upload service is optional
     until Cloudinary credentials are configured.

## Scope Violations:

  None.
  app/main.py was modified only to register the upload router (same pattern
  as Sprint 7). No completed sprint files were modified.

Ready For Next Sprint: Yes
Next Sprint: Sprint 9 — CRUD Routers
             (hero_slides, services, projects, team, clients,
              testimonials, jobs, certificates, inquiries, settings, dashboard)
