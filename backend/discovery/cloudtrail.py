import boto3

cloudtrail = boto3.client(
    "cloudtrail",
    region_name="ap-south-1"
)


def discover_trails():
    response = cloudtrail.describe_trails()

    trails = []

    for trail in response["trailList"]:
        trail_name = trail["Name"]

        status = cloudtrail.get_trail_status(
            Name=trail_name
        )

        trails.append({
            "name": trail_name,
            "is_multi_region": trail["IsMultiRegionTrail"],
            "is_logging": status["IsLogging"]
        })

    return trails