import OpenAI from "openai";
import {
  openaiApiKey,
  openaiModel,
  huggingfaceModel,
  huggingfaceApiKey,
} from "./config.js";

export async function getHuggingfaceInference(data) {
  const response = await fetch(
    `https://api-inference.huggingface.co/models/${huggingfaceModel}`,
    {
      headers: {
        Authorization: `Bearer ${huggingfaceApiKey}`,
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  return await response.json();
}

export async function getOpenaiRelationshipsForEntities(text, entities) {
  const instructions = `You will be provided with text from a web page that might include info about the following entities: ${JSON.stringify(
    entities
  )}. Your task is to extract a list of relationships mentioned in the text between any of these entities. Return the list of relationships in a JSON array under the key 'relationships'. Each relationship should have the following fields: entity1_id and entity2_id. The entity1_id and entity2_id fields are the ids of the related people or organizations from the provided entities array. If no relationships between the provided entities are mentioned in the text, then set 'relationships' equal to an empty array.`;
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
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: instructions },
      { role: "user", content: text },
    ],
  });

  return JSON.parse(chatCompletion.choices[0].message.content);
}
