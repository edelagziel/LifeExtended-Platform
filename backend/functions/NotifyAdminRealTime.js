export const handler = async (event) => {
  const APPSYNC_URL = process.env.APPSYNC_ENDPOINT;
  const API_KEY = process.env.APPSYNC_API_KEY;

  console.log('Event received:', JSON.stringify(event));

  let rawStandings = {};

  try {
    if (event.Records && event.Records[0].Sns) {
      const snsMessage = event.Records[0].Sns.Message;
      const parsedMessage = JSON.parse(snsMessage);

      rawStandings = parsedMessage.currentStandings || parsedMessage;
    } else {
      rawStandings = event.currentStandings || event;
    }
  } catch (e) {
    console.error('Error parsing SNS message:', e);
    rawStandings = {};
  }

  console.log('Extracted Standings:', JSON.stringify(rawStandings));

  const query = `
    mutation PublishUpdate($data: String) {
      publishUpdate(standings: $data) {
        standings
      }
    }
  `;

  const variables = {
    data: JSON.stringify(rawStandings),
  };

  try {
    const response = await fetch(APPSYNC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify({ query, variables }),
    });

    const json = await response.json();

    if (json.errors) {
      console.error('AppSync Error:', JSON.stringify(json.errors));
      throw new Error('AppSync returned errors');
    }

    return { status: 'Success', sent: variables.data };
  } catch (error) {
    console.error('Network Error:', error);
    throw error;
  }
};
