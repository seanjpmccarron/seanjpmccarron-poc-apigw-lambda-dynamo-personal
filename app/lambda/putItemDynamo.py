import boto3
import logging
import os
import uuid
import time
import json

logger = logging.getLogger()

id = str(uuid.uuid4())

# 2ad13fa7-a5a3-4481-8608-e58507ba359a

session = boto3.session.Session()
dynamodb = session.resource('dynamodb', 'eu-west-1')
table = dynamodb.Table('sean-test-apigw-dynamoDynamoDB')

def lambda_handler(event, context):
    
    print(event)
    # print(event['body'])
    
    # body = event.get('body')

    put_id = table.put_item(
        Item={
            'uuid': id,
            'timestamp': int(time.time()),
            'personalia': {
                'title': 'Mr',
                'forename': 'Sean',
                'surname': 'McCarron'
            },
            'address': {
                'first_line': '11 Baker Street',
                'city': 'London'
            },
            'bank_account': {
                'account': '12345678',
                'sort_code': '12-23-56'
            }
        })

     
    return {
        "isBase64Encoded": False,
        "statusCode": 201,
        "headers": {
            "Content-Type": "application/json",
        },
        "body": json.dumps(event)
    }



    # put_id = table.put_item(
    #  Item=json.loads(body)
    #  )