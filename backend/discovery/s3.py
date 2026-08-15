import os
import boto3

s3 = boto3.client("s3")

def discover_buckets():
    buckets = []
    report_bucket = os.getenv("SCAN_REPORT_BUCKET")
    response = s3.list_buckets()

    for bucket in response["Buckets"]:
        bucket_name = bucket["Name"]
        if report_bucket and bucket_name == report_bucket:
            continue

        encryption = None
        location = s3.get_bucket_location(
            Bucket=bucket_name
        )
        try:
            encryption = s3.get_bucket_encryption(
                Bucket=bucket_name
            )
            encryption = encryption["ServerSideEncryptionConfiguration"]["Rules"][0]["ApplyServerSideEncryptionByDefault"]["SSEAlgorithm"]
        except Exception:
            pass

        try:
            public_access = s3.get_public_access_block(
                Bucket=bucket_name
            )["PublicAccessBlockConfiguration"]
        except s3.exceptions.NoSuchPublicAccessBlockConfiguration:
            public_access = None
        
        if location["LocationConstraint"] is None:
            region = "us-east-1"
        else:
            region = location["LocationConstraint"]

        if public_access and all(public_access.values()):
            public_access_blocked = True
        else:
            public_access_blocked = False

        bucket_data = {
            "name": bucket_name,
            "region": region,
            "encryption": encryption,
            "public_access_blocked": public_access_blocked
            }

        buckets.append(bucket_data)

    return buckets


