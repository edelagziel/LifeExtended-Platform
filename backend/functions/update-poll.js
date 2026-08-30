import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { title, description, options } = body;

    let updateExpression = 'set';
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    if (title) {
      updateExpression += ' #t = :t,';
      expressionAttributeNames['#t'] = 'title';
      expressionAttributeValues[':t'] = title;
    }
    if (description) {
      updateExpression += ' #d = :d,';
      expressionAttributeNames['#d'] = 'description';
      expressionAttributeValues[':d'] = description;
    }
    if (options) {
      updateExpression += ' #o = :o,';
      expressionAttributeNames['#o'] = 'options';
      expressionAttributeValues[':o'] = options;
    }

    if (updateExpression === 'set') {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Nothing to update' }),
      };
    }

    updateExpression = updateExpression.slice(0, -1);

    await dynamo.send(
      new UpdateCommand({
        TableName: 'PollConfig',
        Key: { pollId: 'active-poll' },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      }),
    );

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PUT, OPTIONS',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'Poll updated successfully' }),
    };
  } catch (err) {
    console.error('Error updating poll:', err);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
