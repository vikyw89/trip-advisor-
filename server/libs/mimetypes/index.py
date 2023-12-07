import magic
from mimetypes import guess_extension

def deduct_file_extension(file: bytes):
    """
    Deducts the file extension based on the provided file bytes.

    Parameters:
        file (bytes): The file bytes.

    Returns:
        str: The deduced file extension.
    """
    mime_type = magic.from_buffer(buffer=file, mime=True)
    if not mime_type:
        return ""
    file_extension = guess_extension(type=mime_type)
    if not file_extension:
        return ""
    return file_extension

