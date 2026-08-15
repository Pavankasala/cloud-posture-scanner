from backend.discovery.s3 import discover_buckets


def check_encryption(buckets):
    findings = []

    for bucket in buckets:
        if bucket["encryption"] in ["AES256","aws:kms"]:
            finding = {
                "check_id": "S3_ENCRYPTION",
                "resource": bucket["name"],
                "status": "PASS",
                "message": "S3 bucket encryption is enabled."
            }
        else:
            finding = {
                "check_id": "S3_ENCRYPTION",
                "resource": bucket["name"],
                "status": "FAIL",
                "message": "S3 bucket encryption is not enabled."
            }

        findings.append(finding)

    return findings


def check_public_access(buckets):
    findings = []

    for bucket in buckets:
        if bucket["public_access_blocked"]:
            finding = {
                "check_id": "S3_PUBLIC_ACCESS",
                "resource": bucket["name"],
                "status": "PASS",
                "message": "S3 public access is blocked."
            }
        else:
            finding = {
                "check_id": "S3_PUBLIC_ACCESS",
                "resource": bucket["name"],
                "status": "FAIL",
                "message": "S3 bucket may be publicly accessible."
            }

        findings.append(finding)

    return findings
