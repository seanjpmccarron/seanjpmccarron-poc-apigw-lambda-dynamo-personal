import { Construct, Duration, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
import { LambdaIntegration, RestApi } from '@aws-cdk/aws-apigateway';
import { Code, Runtime, Function } from '@aws-cdk/aws-lambda';
import { Role, PolicyStatement, ServicePrincipal } from '@aws-cdk/aws-iam'
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';


import path = require('path');


export class PocApigwLambdaDynamoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const accountId = Stack.of(this).account;
    const region = Stack.of(this).region;
    
     // IAM
    const testLambdaRole = new Role(this, 'sean-test-apigw-dynamoLambdaRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com')
    });

    testLambdaRole.addToPolicy(new PolicyStatement({
      resources: ['*'],
      actions: [
          'logs:CreateLogGroup',
          'logs:CreateLogStream',
          'logs:PutLogEvents']
    }));

    testLambdaRole.addToPolicy(new PolicyStatement({
      resources: [`arn:aws:dynamodb:${region}:${accountId}:table/sean-test-apigw-dynamoDynamoDB`],
      actions: [
          'dynamodb:PutItem']
    }));

    testLambdaRole.addToPolicy(new PolicyStatement({
      resources: [`arn:aws:apigateway:${region}:${accountId}:testSeanApi`],
      actions: ['*']
    }));


      // lambda
    const testPutItemLambda = new Function(this, 'testPutItemLambdaName', {
      functionName: 'sean-test-put-item-dynamo',
      code: Code.fromAsset(path.join(__dirname, '../app/lambda')),
      role: testLambdaRole,
      handler: 'putItemDynamo.lambda_handler',
      runtime: Runtime.PYTHON_3_8,
      timeout: Duration.seconds(10)
    });

    const api = new RestApi(this, "testSeanApi", {
      restApiName: "testSeanApi",
      description: "This service is a test."
    });
    
    const testLambdaIntegration = new LambdaIntegration(testPutItemLambda, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' },
      integrationResponses: [{
        statusCode: '200'}]
      });
    
    api.root.addMethod("PUT", testLambdaIntegration); // GET 

 

    const testDynamoDbTable = new Table(this, 'testDynamoSean', {
      tableName: 'sean-test-apigw-dynamoDynamoDB',
      removalPolicy: RemovalPolicy.DESTROY,
      partitionKey: { name: 'uuid', type: AttributeType.STRING }
      });

  }
}
