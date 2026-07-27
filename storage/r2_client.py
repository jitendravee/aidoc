# apps/api/storage/r2_client.py
import os
import boto3
from botocore.config import Config

def get_r2_client():
    return boto3.client(
        "s3",
        endpoint_url=f"https://{os.environ['R2_ACCOUNT_ID']}.r2.cloudflarestorage.com",
        aws_access_key_id=os.environ["R2_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["R2_SECRET_ACCESS_KEY"],
        config=Config(signature_version="s3v4"),
    )

BUCKET = os.environ["R2_BUCKET_NAME"] if "R2_BUCKET_NAME" in os.environ else None


def upload_file(local_path: str, key: str) -> None:
    client = get_r2_client()
    client.upload_file(local_path, os.environ["R2_BUCKET_NAME"], key)


def get_presigned_download_url(key: str, expires_in_seconds: int = 3600) -> str:
    """expires_in_seconds controls how long the LINK works, separate
    from when the OBJECT itself gets deleted — see cleanup job below."""
    client = get_r2_client()
    return client.generate_presigned_url(
        "get_object",
        Params={"Bucket": os.environ["R2_BUCKET_NAME"], "Key": key},
        ExpiresIn=expires_in_seconds,
    )


def delete_file(key: str) -> None:
    client = get_r2_client()
    client.delete_object(Bucket=os.environ["R2_BUCKET_NAME"], Key=key)