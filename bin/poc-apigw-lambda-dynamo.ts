#!/usr/bin/env node
import 'source-map-support/register';
import { App } from '@aws-cdk/core';
import { PocApigwLambdaDynamoStack } from '../lib/poc-apigw-lambda-dynamo-stack';

const app = new App();
new PocApigwLambdaDynamoStack(app, 'PocApigwLambdaDynamoStack');
