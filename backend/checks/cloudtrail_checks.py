def check_cloudtrail(trails):
    findings = []

    if not trails:
        findings.append({
            "check_id": "CLOUDTRAIL_ENABLED",
            "resource": "AWS account",
            "status": "FAIL",
            "message": "No CloudTrail trail is configured."
        })
        return findings

    for trail in trails:
        if trail["is_multi_region"] and trail["is_logging"]:
            findings.append({
                "check_id": "CLOUDTRAIL_ENABLED",
                "resource": trail["name"],
                "status": "PASS",
                "message": "CloudTrail multi-region trail is enabled and logging."
            })
        else:
            findings.append({
                "check_id": "CLOUDTRAIL_ENABLED",
                "resource": trail["name"],
                "status": "FAIL",
                "message": "CloudTrail is not actively logging with a multi-region trail."
            })

    return findings