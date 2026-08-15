import json
import os
import boto3
from botocore.exceptions import BotoCoreError, ClientError


def get_report_bucket_name() -> str | None:
    return os.getenv("SCAN_REPORT_BUCKET")


def save_scan_results(report: dict) -> dict:
    """
    Persists scan results to AWS S3 bucket specified by SCAN_REPORT_BUCKET environment variable.
    If SCAN_REPORT_BUCKET is not set, returns non-stored status metadata.
    Raises RuntimeError if AWS S3 persistence fails when configured.
    """
    bucket_name = get_report_bucket_name()
    if not bucket_name:
        return {
            "stored": False,
            "reason": "SCAN_REPORT_BUCKET environment variable not configured."
        }

    s3 = boto3.client("s3")
    key = "latest_scan.json"

    try:
        s3.put_object(
            Bucket=bucket_name,
            Key=key,
            Body=json.dumps(report, indent=2),
            ContentType="application/json"
        )
        return {
            "stored": True,
            "bucket": bucket_name,
            "key": key
        }
    except (ClientError, BotoCoreError) as e:
        raise RuntimeError(f"Failed to persist scan results to S3 bucket '{bucket_name}': {e}") from e


def load_latest_scan_results() -> dict | None:
    """
    Loads latest scan results from AWS S3 bucket specified by SCAN_REPORT_BUCKET.
    Returns None if environment variable is not configured or object does not exist.
    """
    bucket_name = get_report_bucket_name()
    if not bucket_name:
        return None

    s3 = boto3.client("s3")
    key = "latest_scan.json"

    try:
        response = s3.get_object(Bucket=bucket_name, Key=key)
        content = response["Body"].read().decode("utf-8")
        return json.loads(content)
    except (ClientError, BotoCoreError, json.JSONDecodeError):
        return None
