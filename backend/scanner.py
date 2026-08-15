from backend.discovery.s3 import discover_buckets
from backend.discovery.ec2 import discover_instances, discover_security_groups
from backend.discovery.iam import discover_root_mfa
from backend.discovery.cloudtrail import discover_trails

from backend.checks.s3_checks import check_encryption, check_public_access
from backend.checks.ec2_checks import check_ssh_rdp_exposure
from backend.checks.iam_checks import check_mfa
from backend.checks.cloudtrail_checks import check_cloudtrail

from backend.storage import save_scan_results

import json

def run_scan():
    findings = []

    # S3
    buckets = discover_buckets()
    findings.extend(check_encryption(buckets))
    findings.extend(check_public_access(buckets))

    # EC2
    instances = discover_instances()
    security_groups = discover_security_groups()
    findings.extend(check_ssh_rdp_exposure(security_groups))

    # IAM
    root_mfa = discover_root_mfa()
    findings.extend(check_mfa(root_mfa))

    # CloudTrail
    trails = discover_trails()
    findings.extend(check_cloudtrail(trails))

    passed = sum(
        1 for finding in findings
        if finding["status"] == "PASS"
    )

    failed = sum(
        1 for finding in findings
        if finding["status"] == "FAIL"
    )

    report = {
        "summary": {
            "total": len(findings),
            "passed": passed,
            "failed": failed
        },
        "instances": instances,
        "buckets": buckets,
        "findings": findings
    }

    storage_info = save_scan_results(report)
    if storage_info.get("stored"):
        report["storage"] = storage_info

    return report
    
if __name__ == "__main__":
    report = run_scan()

    with open("scan_report.json", "w") as file:
        json.dump(report, file, indent=2)
