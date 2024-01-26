import OpenAI from "openai";
import {
  openaiApiKey,
  openaiModel,
  huggingfaceApiKey,
  awsAccessKey,
  awsSecretAccessKey,
  awsCloudSearchApiKey,
  apiDomain,
  apiKey,
} from "./config.js";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

export async function getLittlesisIdsFromGcpMetadata(key, values) {
  return await callBackendFunction("getLittlesisIdsFromGcpMetadata", {
    key,
    values,
  });
}

export async function getGcpNamedEntities(text) {
  return await callBackendFunction("getGcpNamedEntities", { text });
}

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

export async function getHuggingfaceInference(model, { inputs }) {
  const response = await fetch(
    `https://api-inference.huggingface.co/models/${model}`,
    {
      headers: {
        Authorization: `Bearer ${huggingfaceApiKey}`,
      },
      method: "POST",
      body: JSON.stringify({ inputs }),
    }
  );
  return await response.json();
}

export async function getOpenaiRelationshipsForEntities(text, entityNames) {
  const format = `["<First Entity Name>","<Second Entity Name>","<relationship type>"]`;
  const formatInstructions = useJson()
    ? `Return the relationships as a JSON array under the key 'relationships'. Each relationship in the JSON should be an array with this format: ${format}.`
    : `Each relationship should have this format:\n\n${format}`;
  const instructions = `You will be provided with text from a web page that mentions the following entities: ${entityNames.join(
    ", "
  )}. Your task is to find all membership, eployment, familial, and financial relationships that are clearly and specifically mentioned in the text, between any two of these entities. Do not include more than one relationship between any two entities. ${formatInstructions}`;
  return await getOpenaiCompletion(instructions, text);
}

export async function getOpenaiEntitiesAndRelationships(text) {
  const instructions = `You will be provided with text from a web page that might include names of people and organizations. Your task is to extract a list of people and organizations and any relationships between them. Only include the kinds of organizations that typically have a board of directors. Return the list of people and organizations in a JSON array under the key 'entities'. Each entitiy should have the following fields: id, name, type. The id field should increment starting from 0. The name field's value should be the full name of the person or organization. The type field's value should be either 'person' or 'organization'. Return the list of relationships in a JSON array under the key 'relationships'. Each relationship should have the following fields: entity1_id, entity2_id, and description. The entity1_id and entity2_id fields are the ids of the related people or organizations from the 'entities' array. The description field should be a very concise description of the relationship between the two entities. If no entities are mentioned in the text then set 'entities' equal to an empty array. If no relationships are mentioned in the text then set 'relationships' equal to an empty array.`;
  return await getOpenaiCompletion(instructions, text);
}

async function getOpenaiCompletion(instructions, text) {
  const openai = new OpenAI({
    apiKey: openaiApiKey,
    dangerouslyAllowBrowser: true,
  });

  const chatCompletion = await openai.chat.completions.create({
    model: openaiModel,
    response_format: useOpenaiJson() ? { type: "json_object" } : undefined,
    temperature: 0.2,
    messages: [
      { role: "system", content: instructions },
      { role: "user", content: text },
    ],
  });

  if (chatCompletion.choices.finish_reason == "length") {
    console.log(
      "completion finished early due to length:",
      chatCompletion.choices[0].message.content
    );
    return chatCompletion.choices[0].message.content;
  }

  try {
    const content = chatCompletion.choices[0].message.content;
    return useOpenaiJson() ? JSON.parse(content) : content;
  } catch (error) {
    console.log(error);
    console.log(chatCompletion);
    return chatCompletion;
  }
}

function useOpenaiJson() {
  return ["gpt-3.5-turbo-1106", "gpt-4-1106-preview"].includes(openaiModel);
}

export async function findLittlesisEntities(query) {
  const endpoint =
    "https://2c76ayi2ic.execute-api.us-east-1.amazonaws.com/search";
  const url = `${endpoint}?q=${encodeURIComponent(query)}&q.parser=structured`;
  const headers = { "X-Api-Key": awsCloudSearchApiKey };
  const response = await fetch(url, { headers });
  return await response.json();
}

async function callBackendFunction(functionName, requestData) {
  const response = await fetch(`${apiDomain}/api/${functionName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": apiKey,
    },
    body: JSON.stringify(requestData),
  });
  const { data } = await response.json();
  return data;
}
