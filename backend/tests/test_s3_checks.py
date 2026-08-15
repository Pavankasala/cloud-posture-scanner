from backend.checks.s3_checks import check_encryption, check_public_access


def test_encryption_pass():
    buckets = [
        {
            "name": "test-bucket",
            "encryption": "AES256"
        }
    ]

    result = check_encryption(buckets)

    assert result[0]["check_id"] == "S3_ENCRYPTION"
    assert result[0]["resource"] == "test-bucket"
    assert result[0]["status"] == "PASS"


def test_encryption_fail():
    buckets = [
        {
            "name": "unencrypted-bucket",
            "encryption": None
        }
    ]

    result = check_encryption(buckets)

    assert result[0]["check_id"] == "S3_ENCRYPTION"
    assert result[0]["resource"] == "unencrypted-bucket"
    assert result[0]["status"] == "FAIL"


def test_public_access_fail():
    buckets = [
        {
            "name": "public-bucket",
            "public_access_blocked": False
        }
    ]

    result = check_public_access(buckets)

    assert result[0]["check_id"] == "S3_PUBLIC_ACCESS"
    assert result[0]["resource"] == "public-bucket"
    assert result[0]["status"] == "FAIL"


def test_public_access_pass():
    buckets = [
        {
            "name": "secure-bucket",
            "public_access_blocked": True
        }
    ]

    result = check_public_access(buckets)

    assert result[0]["check_id"] == "S3_PUBLIC_ACCESS"
    assert result[0]["resource"] == "secure-bucket"
    assert result[0]["status"] == "PASS"

def test_public_access_missing_configuration():
    buckets = [
        {
            "name": "unconfigured-bucket",
            "public_access_blocked": False
        }
    ]

    result = check_public_access(buckets)

    assert result[0]["status"] == "FAIL"