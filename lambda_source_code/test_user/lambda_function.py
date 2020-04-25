import boto3
import botocore.exceptions
import json
USER_POOL_ID = 'ap-northeast-1_TiSE2vg8b'
def error_message(msg):
    return {'message': msg, "error": True, "success": False, "data": None}
def lambda_handler(event, context):
    # for field in ["username"]:
    #     if event.get(field) is None:
    #         return error_message(f"Please provide {field} to renew tokens")
    client = boto3.client('cognito-idp')
    try:
        # $$if you want to get user from users access_token
        response = client.get_user(
          AccessToken=event["access_token"])
        
        # response = client.admin_get_user(
        #         UserPoolId=USER_POOL_ID,
        #         Username=event["username"]
        #     )
    except client.exceptions.UserNotFoundException as e:
        return error_message("Invalid username ")
    return {
        "data": response
    }