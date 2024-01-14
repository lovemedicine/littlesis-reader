import OpenAI from "openai";
import { encodingForModel } from "js-tiktoken";
import {
  debugMode,
  openaiApiKey,
  openaiModel,
  openaiMaxTokens,
} from "./config.js";

export async function extractEntitiesAndRelationships(text) {
  const openai = new OpenAI({
    apiKey: openaiApiKey,
    dangerouslyAllowBrowser: true,
  });
  text = truncateText(text);
  const startTime = debugMode ? Date.now() : null;
  const chatCompletion = await openai.chat.completions.create({
    model: openaiModel,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You will be provided with text from a web page that might include names of people and organizations. Your task is to extract a list of people and organizations and any relationships between them. Only include organizations that typically have a board of directors. Return the list of people and organizations in a JSON array under the key 'entities'. Each entitiy should have the following fields: id, name, type. The id field should increment starting from 0. The type field's value should be either 'person' or 'organization'. Return the list of relationships in a JSON array under the key 'relationships'. Each relationship should have the following fields: entity1_id, entity2_id, and description. The entity1_id and entity2_id fields are the ids of the related people or organizations from the 'entities' array. The description field should be a very concise description of the relationship between the two entities. If no entities are mentioned in the text then set 'entities' equal to an empty array. If no relationships are mentioned in the text then set 'relationships' equal to an empty array.`,
      },
      { role: "user", content: text },
    ],
  });
  const data = JSON.parse(chatCompletion.choices[0].message.content);
  if (debugMode) {
    const entityCount = data.entities.length;
    const wordCount = text.split(/\s+/g).length;
    const time = Math.floor((Date.now() - startTime) / 1000);
    console.log(
      `${openaiModel} extracted ${entityCount} entities from ${wordCount} words in ${time} seconds`
    );
  }
  return data;
}

function truncateText(text) {
  const encoding = encodingForModel(openaiModel);
  const tokens = encoding.encode(text);
  const truncatedTokens = tokens.slice(0, openaiMaxTokens - 2000);
  const truncatedText = encoding.decode(truncatedTokens);
  return truncatedText;
}

export function getPageContent() {
  const text = document.body.innerText;
  const content = getTextContent(text);
  console.log(
    `full page text is ${text.length} chars and begins with: ${text.slice(
      0,
      50
    )}`
  );
  console.log(
    `main content is ${content.length} chars and begins with: ${content.slice(
      0,
      50
    )}`
  );
  return content;
}

function getTextContent(text) {
  const lines = text.split("\n").filter((line) => isContentLine(line));
  return lines.join("\n");
}

function isContentLine(str) {
  str = str.trim();

  if (str.length < 50) {
    return false;
  }

  if (
    str.length > 300 ||
    (isCapital(str[0]) && isSentenceEnd(str[str.length - 1]))
  ) {
    return true;
  }

  return false;
}

function isCapital(char) {
  return char === char.toUpperCase();
}

function isSentenceEnd(char) {
  return [".", "?", "!", "”"].includes(char);
}
