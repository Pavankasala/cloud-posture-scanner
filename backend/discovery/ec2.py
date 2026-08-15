import boto3

ec2 = boto3.client("ec2", region_name="ap-south-1")

def discover_instances():
    response = ec2.describe_instances()

    instances = []

    for reservation in response["Reservations"]:
        for instance in reservation["Instances"]:
            instance_id=instance["InstanceId"]
            security_groups=[group["GroupId"] for group in instance["SecurityGroups"]]
            instances.append({
                "instance_id": instance_id,
                "instance_type": instance["InstanceType"],
                "region": "ap-south-1",
                "public_ip": instance.get("PublicIpAddress"),
                "security_groups": security_groups
            })
    
    return instances
def discover_security_groups():
    response = ec2.describe_security_groups()

    security_groups = []

    for group in response["SecurityGroups"]:
        security_groups.append({
            "group_id": group["GroupId"],
            "permissions": group["IpPermissions"]
            })

    return security_groups
