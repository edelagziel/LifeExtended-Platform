import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  console.log("Incoming event:", JSON.stringify(event)); 

  try {
    let body = event.body;
    
    if (event.body && typeof event.body === 'string') {
        try {
            body = JSON.parse(event.body);
        } catch (e) {
            console.error("Failed to parse body string:", e);
            return errorResponse(400, "Invalid JSON body");
        }
    } else if (!event.body) {
        body = event;
    }

    const { title, description, options } = body;

    if (!title || !options || !Array.isArray(options) || options.length < 2) {
      console.error("Validation failed. Body:", body);
      return errorResponse(400, "Missing title or options (must be an array of 2+ options)");
    }

    const newPoll = {
      pollId: "active-poll", 
      title: title,
      description: description || "", 
      options: options,
      status: "ACTIVE",
      totalVotes: 0,
      createdAt: new Date().toISOString()
    };

    await dynamo.send(
      new PutCommand({
        TableName: "PollConfig",
        Item: newPoll,
      })
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        success: true, 
        message: "Poll created successfully",
        poll: newPoll
      }),
    };

  } catch (err) {
    console.error("System Error:", err);
    return errorResponse(500, err.message);
  }
};

function errorResponse(statusCode, message) {
    return {
        statusCode: statusCode,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            success: false, 
            error: message 
        }),
    };
}