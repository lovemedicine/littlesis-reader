import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { awsAccessKey, awsSecretAccessKey } from "./config.js";

export async function getAnthropicCompletion(model, text) {
  const client = new BedrockRuntimeClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: awsAccessKey,
      secretAccessKey: awsSecretAccessKey,
    },
  });
  const request = {
    prompt: `\n\nHuman:${text}\n\nAssistant:`,
    max_tokens_to_sample: 1000,
    temperature: 0,
  };
  const input = {
    body: JSON.stringify(request),
    contentType: "application/json",
    accept: "application/json",
    modelId: model,
  };

  try {
    const command = new InvokeModelCommand(input);
    const response = await client.send(command);
    const completion = JSON.parse(Buffer.from(response.body).toString("utf-8"));
    return completion;
  } catch (error) {
    console.log(error);
  }
}
