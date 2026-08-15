import boto3

iam = boto3.client("iam")


def discover_root_mfa():
    response = iam.get_account_summary()

    return bool(
        response["SummaryMap"]["AccountMFAEnabled"]
    )
    
def discover_users():
    response = iam.list_users()

    users = []

    for user in response["Users"]:
        user_name = user["UserName"]

        mfa_response = iam.list_mfa_devices(
            UserName=user_name
        )

        mfa_enabled = bool(mfa_response["MFADevices"])

        users.append({
            "user_name": user_name,
            "mfa_enabled": mfa_enabled
        })

    return users
