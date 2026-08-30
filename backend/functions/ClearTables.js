import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  ScanCommand,
  BatchWriteCommand,
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: 'eu-west-1' });
const docClient = DynamoDBDocumentClient.from(client);

const TABLES = [
  { name: 'Votes', key: 'userHash' },
  { name: 'Stats', key: 'statName' },
];

export const handler = async (event) => {
  console.log(' Starting System Reset...');

  for (const table of TABLES) {
    console.log(` Cleaning table: ${table.name}...`);
    await clearTable(table.name, table.key);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'System reset complete! Tables are empty. 🗑️',
    }),
  };
};

async function clearTable(tableName, keyName) {
  let items;
  let deletedCount = 0;

  do {
    // 1. סריקה
    const scanCommand = new ScanCommand({
      TableName: tableName,
      ProjectionExpression: `#k`,
      ExpressionAttributeNames: { '#k': keyName },
    });

    const response = await docClient.send(scanCommand);
    items = response.Items;

    if (!items || items.length === 0) {
      console.log(` Table ${tableName} is empty.`);
      break;
    }

    // 2. מחיקה בקבוצות
    const batches = [];
    while (items.length > 0) {
      batches.push(items.splice(0, 25));
    }

    for (const batch of batches) {
      const deleteRequests = batch.map((item) => ({
        DeleteRequest: {
          Key: { [keyName]: item[keyName] },
        },
      }));

      await docClient.send(
        new BatchWriteCommand({
          RequestItems: { [tableName]: deleteRequests },
        }),
      );

      deletedCount += batch.length;
    }
  } while (false);

  console.log(`🗑️ Deleted ${deletedCount} items from ${tableName}`);
}
