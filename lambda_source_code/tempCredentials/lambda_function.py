import json
import boto3
import hashlib
import hmac
import base64
USER_POOL_ID = 'ap-northeast-1_TiSE2vg8b'
IDENTITY_POOL_ID = "ap-northeast-1:d352e0f6-12d0-43b8-ba45-e57e3fcadc0c"
PROVIDER = f'cognito-idp.ap-south-1.amazonaws.com/{USER_POOL_ID}'
def lambda_handler(event, context):
    id_token = event["id_token"]
    identity_client = boto3.client('cognito-identity')
    try:
        identity_response = identity_client.get_id(
                              IdentityPoolId=IDENTITY_POOL_ID, 
                              Logins = {PROVIDER: id_token})
    except Exception as e:
        return {"error": True, 
                "success": False, 
                "message": repr(e), 
                "data": None}
    identity_id = identity_response['IdentityId']
    
    response = identity_client.get_credentials_for_identity(
                  IdentityId=identity_id,
                  Logins={PROVIDER: id_token})
    res = response["Credentials"]
    return {'data': {
                "identity_id": identity_id,
                "access_key": res["AccessKeyId"], 
                "secret_key":  res["SecretKey"], 
                "session_token": res["SessionToken"]}, 
            "error": False, 
            "success": True, 
            "message": None}