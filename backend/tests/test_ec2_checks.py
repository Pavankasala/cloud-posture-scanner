from backend.checks.ec2_checks import check_ssh_rdp_exposure

def test_ssh_rdp_exposure_fail():
    security_groups = [
        {
            "group_id": "sg-test",
            "permissions": [
                {
                    "IpProtocol": "tcp",
                    "FromPort": 3389,
                    "ToPort": 3389,
                    "IpRanges": [
                        {"CidrIp": "0.0.0.0/0"}
                    ]
                }
            ]
        }
    ]

    result = check_ssh_rdp_exposure(security_groups)

    assert result[0]["check_id"] == "EC2_SSH_RDP_EXPOSURE"
    assert result[0]["resource"] == "sg-test"
    assert result[0]["status"] == "FAIL"
    