import json
import boto3
import os
import base64
import urllib3

dynamodb = boto3.resource('dynamodb')
http = urllib3.PoolManager()

def lambda_handler(event, context):
    # # TODO implement
    table = dynamodb.Table('eldistPersonalInfo')
    
    returnBody = ""
    try:
        loadData = json.loads(event['body'])
    except:
        return {
            'statusCode': 200,
        }
    try:
        auth_token = event['headers']['authorization']
        data = {'access_token': auth_token }
        encoded_data = json.dumps(data).encode('utf-8')
        r = http.request('POST','https://lr4eblj2k2.execute-api.ap-northeast-1.amazonaws.com/beta/user/tstuser',body=encoded_data)
        user_data = json.loads(r.data.decode('utf-8'))
        username = user_data["data"]["Username"]
    except Exception as e:
        print(e)
        return {
            'statusCode': 401,
        }
    fullname = user_data["data"]["UserAttributes"][2]["Value"]
    
    if(loadData['op'] == 'register'):
        table.put_item(Item={'userName':username,'fullName':fullname,'date':loadData['date'],'wantedAge':loadData['wantedAge'],'previousIncome':loadData['previousIncome']})
        returnBody = "Success"
   
    elif(loadData['op'] == 'append'):
        item = table.get_item(Key={'userName':username})
        s = ','
        try:
            incomeForm = item['Item']['incomeForm']
        except:
            incomeForm = []
        try: 
            paymentForm = item['Item']['paymentForm']
        except:
            paymentForm = []
        for i in range(len(loadData['incomeForm'])):
            incomeForm.append(loadData['incomeForm'][i])
        for i in range(len(loadData['paymentForm'])):
            paymentForm.append(loadData['paymentForm'][i])
        table.update_item(Key={'userName':username},UpdateExpression='SET incomeForm = :val1,paymentForm = :val2',ExpressionAttributeValues={':val1': incomeForm,':val2': paymentForm})
        returnBody = "Success"
    
    elif(loadData['op'] == 'get'):
        item = table.get_item(Key={'userName': username})
        returnBody = item
    
    elif(loadData['op'] == 'replaceIncome'):
        try:
            table.update_item(Key={'userName':username},UpdateExpression='SET incomeForm = :val1',ExpressionAttributeValues={':val1': loadData['data']})
            returnBody = "Success"
        except:
            returnBody = "Failed"
            
    elif(loadData['op'] == 'replacePayment'):
        try:
            table.update_item(Key={'userName':username},UpdateExpression='SET paymentForm = :val1',ExpressionAttributeValues={':val1': loadData['data']})
            returnBody = "Success"
        except:
            returnBody = "Failed"
    
    return {
        'statusCode': 200,
        'body': json.dumps(returnBody)
    }
