import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const SYSTEM_FIELDS = ['id', 'totalVotes'];

export const handler = async (event) => {
  console.log('🎬 Calculating results for Step Function...');

  try {
    const data = await docClient.send(new ScanCommand({ TableName: 'Stats' }));
    const stats = data.Items[0] || {};

    let winner = { name: 'No winner', votes: 0 };
    let resultsSummary = '';

    Object.keys(stats).forEach((key) => {
      if (SYSTEM_FIELDS.includes(key)) return;
      const votes = stats[key];
      resultsSummary += `${key}: ${votes}, `;
      if (votes > winner.votes) winner = { name: key, votes: votes };
    });

    return {
      status: 'SUCCESS',
      winnerName: winner.name,
      winnerVotes: winner.votes,
      summary: resultsSummary,
      totalVotes: stats.totalVotes || 0,
    };
  } catch (err) {
    console.error(' Error during calculation:', err);
    throw err;
  }
};
