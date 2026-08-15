from backend.checks.iam_checks import check_mfa


def test_mfa_fail():
    result = check_mfa(False)

    assert result[0]["check_id"] == "IAM_MFA"
    assert result[0]["resource"] == "root account"
    assert result[0]["status"] == "FAIL"
    assert "root account" in result[0]["message"]


def test_mfa_pass():
    result = check_mfa(True)

    assert result[0]["check_id"] == "IAM_MFA"
    assert result[0]["resource"] == "root account"
    assert result[0]["status"] == "PASS"