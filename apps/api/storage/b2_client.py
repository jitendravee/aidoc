# apps/api/storage/b2_client.py
import os
import boto3
from botocore.config import Config

def get_b2_client():
    return boto3.client(
        "s3",
        endpoint_url=os.environ["B2_ENDPOINT"],
        aws_access_key_id=os.environ["B2_KEY_ID"],
        aws_secret_access_key=os.environ["B2_APPLICATION_KEY"],
        config=Config(signature_version="s3v4"),
    )
# apps/api/storage/b2_client.py — add this function
def download_file(key: str, local_path: str) -> None:
    client = get_b2_client()
    client.download_file(os.environ["B2_BUCKET_NAME"], key, local_path)
def upload_file(local_path: str, key: str) -> None:
    client = get_b2_client()
    client.upload_file(local_path, os.environ["B2_BUCKET_NAME"], key)



def delete_file(key: str) -> None:
    client = get_b2_client()
    client.delete_object(Bucket=os.environ["B2_BUCKET_NAME"], Key=key)# apps/api/storage/b2_client.py
def get_presigned_download_url(
    key: str,
    mime_type: str = "application/pdf",
    inline: bool = True,
    expires_in_seconds: int = 3600,
) -> str:
    client = get_b2_client()
    params = {"Bucket": os.environ["B2_BUCKET_NAME"], "Key": key}
    if inline:
        params["ResponseContentDisposition"] = "inline"
        params["ResponseContentType"] = mime_type
    else:
        params["ResponseContentDisposition"] = "attachment"
    return client.generate_presigned_url("get_object", Params=params, ExpiresIn=expires_in_seconds)