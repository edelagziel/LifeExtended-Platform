import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  console.log(" Event Received:", JSON.stringify(event, null, 2));

  let choice;

  if (event.Records && event.Records[0].Sns) {
    const snsMessage = event.Records[0].Sns.Message;
    try {
      const parsed = JSON.parse(snsMessage);
      choice = parsed.choice;
    } catch (e) {
      choice = snsMessage;
    }
  } else {
    choice = event.choice;
  }

  if (!choice) {
    console.error(" Error: No choice found in event!");
    return { status: "Error", message: "No choice provided" };
  }

  const command = new UpdateCommand({
    TableName: "Stats",
    Key: { statName: "Election2026" },
    UpdateExpression: "ADD #party :inc, totalVotes :inc",
    ExpressionAttributeNames: {
      "#party": choice,
    },
    ExpressionAttributeValues: {
      ":inc": 1,
    },
    ReturnValues: "ALL_NEW",
  });

  try {
    const result = await docClient.send(command);
    // עכשיו result.Attributes יכיל את כל המפלגות!
    console.log(` Successfully updated stats for: ${choice}. New counts:`, JSON.stringify(result.Attributes));

    return {
      status: "Updated",
      party: choice,
      currentStandings: result.Attributes,
    };
  } catch (err) {
    console.error(" DynamoDB Error:", err);
    throw err;
  }
};
