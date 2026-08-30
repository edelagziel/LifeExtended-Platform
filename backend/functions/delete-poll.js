import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {

  try {


    await dynamo.send(

      new DeleteCommand({

        TableName: "PollConfig",

        Key: { pollId: "active-poll" },

      })

    );
    return {

      statusCode: 200,

      headers: {

        "Access-Control-Allow-Origin": "*",

        "Access-Control-Allow-Methods": "DELETE, OPTIONS",

        "Content-Type": "application/json"

      },

      body: JSON.stringify({ message: "Poll deleted successfully" }),

    };

  } catch (err) {

    console.error("Error deleting poll:", err);

    return {

      statusCode: 500,

      headers: { "Access-Control-Allow-Origin": "*" },

      body: JSON.stringify({ error: err.message }),

    };

  }

};