import json
import boto3
import botocore.exceptions
import hmac
import hashlib
import base64
import uuid
USER_POOL_ID = 'ap-northeast-1_TiSE2vg8b'
CLIENT_ID = '166b0jr0ttdngvrl4t6a1c40i4'
CLIENT_SECRET = 's7t4ueprjo17uuaa8okhia8j23r9mfsop0e6e5o6mbuq7i6r96m'
def get_secret_hash(username):
    msg = username + CLIENT_ID
    dig = hmac.new(str(CLIENT_SECRET).encode('utf-8'), 
        msg = str(msg).encode('utf-8'),
        digestmod=hashlib.sha256).digest()
    d2 = base64.b64encode(dig).decode()
    return d2
def lambda_handler(event, context):
    client = boto3.client('cognito-idp')
    try:
        username = event['username']
        response = client.resend_confirmation_code(
        ClientId=CLIENT_ID,
        SecretHash=get_secret_hash(username),
        Username=username,
    )
    except client.exceptions.UserNotFoundException:
        return {"error": True, "success": False, "message":   "Username doesnt exists"}
        
    except client.exceptions.InvalidParameterException:
        return {"error": True, "success": False, "message": "User is already confirmed"}
    
    except Exception as e:
        return {"error": True, "success": False, "message": f"Unknown error {e.__str__()} "}
      
    return  {"error": False, "success": True}