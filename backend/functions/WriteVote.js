import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({});

export const handler = async ({ userHash, choice }) => {
  console.log('START WriteVote. Input:', JSON.stringify({ userHash, choice }));

  if (!userHash || !choice) {
    console.error('ERROR: Missing input parameters');
    throw new Error('Missing userHash or choice');
  }

  const command = new PutItemCommand({
    TableName: 'Votes',
    Item: {
      userHash: { S: userHash },
      choice: { S: choice },
      createdAt: { S: new Date().toISOString() },
    },
    ConditionExpression: 'attribute_not_exists(userHash)',
  });

  try {
    console.log(`Attempting to write vote for hash: ${userHash}...`);

    await client.send(command);

    console.log('SUCCESS: Vote saved to DynamoDB.');
    return { status: 'OK' };
  } catch (err) {
    if (err.name === 'ConditionalCheckFailedException') {
      console.warn(`WARNING: User ${userHash} already voted.`);
      return { status: 'ALREADY_VOTED' };
    }

    console.error('FATAL ERROR: DynamoDB write failed:', err);
    throw err;
  }
};
