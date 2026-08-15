from backend.checks.cloudtrail_checks import check_cloudtrail


def test_cloudtrail_fail():
    trails = []

    result = check_cloudtrail(trails)

    assert result[0]["check_id"] == "CLOUDTRAIL_ENABLED"
    assert result[0]["resource"] == "AWS account"
    assert result[0]["status"] == "FAIL"
    
def test_cloudtrail_multi_region_logging_pass():
    trails = [
        {
            "name": "test-trail",
            "is_multi_region": True,
            "is_logging": True
        }
    ]

    result = check_cloudtrail(trails)

    assert result[0]["check_id"] == "CLOUDTRAIL_ENABLED"
    assert result[0]["resource"] == "test-trail"
    assert result[0]["status"] == "PASS"


def test_cloudtrail_not_logging_fail():
    trails = [
        {
            "name": "test-trail",
            "is_multi_region": True,
            "is_logging": False
        }
    ]

    result = check_cloudtrail(trails)

    assert result[0]["check_id"] == "CLOUDTRAIL_ENABLED"
    assert result[0]["resource"] == "test-trail"
    assert result[0]["status"] == "FAIL"