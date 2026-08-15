def check_mfa(root_mfa_enabled):
    if root_mfa_enabled:
        return [{
            "check_id": "IAM_MFA",
            "resource": "root account",
            "status": "PASS",
            "message": "IAM root account has MFA enabled."
        }]

    return [{
        "check_id": "IAM_MFA",
        "resource": "root account",
        "status": "FAIL",
        "message": "IAM root account does not have MFA enabled."
    }]