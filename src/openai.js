import OpenAI from "openai";
import { encodingForModel } from "js-tiktoken";
import { log } from "./util.js";
import {
  debugMode,
  openaiApiKey,
  openaiModel,
  openaiMaxTokens,
} from "./config.js";

export async function extractRelationshipsFromEntities(text, entities) {
  text = truncateOpenaiText(text);
  return await getOpenaiRelationshipsForEntities(
    text,
    entities.map((entity) => entity.name)
  );
}

export async function extractEntitiesAndRelationships(text) {
  text = truncateOpenaiText(text);
  const startTime = debugMode ? Date.now() : null;
  const data = await getOpenaiEntitiesAndRelationships(text);

  if (debugMode) {
    const entityCount = data.entities.length;
    const wordCount = text.split(/\s+/g).length;
    const time = Math.floor((Date.now() - startTime) / 1000);
    log(
      `${openaiModel} extracted ${entityCount} entities from ${wordCount} words in ${time} seconds`
    );
  }

  return data;
}

function truncateOpenaiText(text) {
  const encoding = encodingForModel(openaiModel);
  const tokens = encoding.encode(text);
  const truncatedTokens = tokens.slice(0, openaiMaxTokens - 500);
  const truncatedText = encoding.decode(truncatedTokens);
  return truncatedText;
}

async function getOpenaiRelationshipsForEntities(text, entityNames) {
  const format = `["<First Entity Name>","<Second Entity Name>","<relationship type>"]`;
  const formatInstructions = useJson()
    ? `Return the relationships as a JSON array under the key 'relationships'. Each relationship in the JSON should be an array with this format: ${format}.`
    : `Each relationship should have this format:\n\n${format}`;
  const instructions = `You will be provided with text from a web page that mentions the following entities: ${entityNames.join(
    ", "
  )}. Your task is to find all membership, eployment, familial, and financial relationships that are clearly and specifically mentioned in the text, between any two of these entities. Do not include more than one relationship between any two entities. ${formatInstructions}`;
  return await getOpenaiCompletion(instructions, text);
}

async function getOpenaiEntitiesAndRelationships(text) {
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
