import { Readability } from "@mozilla/readability";
import { encodingForModel } from "js-tiktoken";
import { chunkArray, log } from "./util.js";
import {
  getHuggingfaceInference,
  getOpenaiCompletion,
  getOpenaiRelationshipsForEntities,
} from "./api.js";
import { debugMode, openaiModel, openaiMaxTokens } from "./config.js";

export async function extractEntitiesWithBert(text) {
  const words = text.split(/\s+/);
  const chunks = chunkArray(words, 300);
  const inputs = chunks.map((chunk) => chunk.join(" "));
  const bertEntities = await getHuggingfaceInference({ inputs });
  const entities = bertEntities
    .flat()
    .filter(bertEntityIsValid)
    .map((entity, index) => ({
      id: index + 1,
      name: entity.word,
      type: entity.entity_group === "PER" ? "person" : "org",
    }));
  return uniqueEntities(entities);
}

export async function extractRelationshipsFromEntities(text, entities) {
  return await getOpenaiRelationshipsForEntities(text, entities);
}

export async function extractEntitiesAndRelationships(text) {
  text = truncateText(text);
  const startTime = debugMode ? Date.now() : null;
  const data = await getOpenaiCompletion(text);

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

function truncateText(text) {
  const encoding = encodingForModel(openaiModel);
  const tokens = encoding.encode(text);
  const truncatedTokens = tokens.slice(0, openaiMaxTokens - 500);
  const truncatedText = encoding.decode(truncatedTokens);
  return truncatedText;
}

export function getVisibleText() {
  const html = document.cloneNode(true).querySelector("html").innerHTML;
  const tags = document.body.getElementsByTagName("*");

  [...tags].forEach((tag) => {
    const style = window.getComputedStyle(tag);

    if (
      !style ||
      style.visibility === "hidden" ||
      style.display === "none" ||
      style.opacity == 0 ||
      parseInt(style.height.replace("px", "")) < 2 ||
      parseInt(style.width.replace("px", "")) < 2
    ) {
      tag.remove();
    }
  });

  const page = new Readability(document).parse();
  document.querySelector("html").innerHTML = html;
  return page.textContent;
}

export function getPageContent() {
  const text = getVisibleText();
  const content = getMainContent(text);
  log(
    `full page text is ${text.length} chars and begins with: ${text.slice(
      0,
      50
    )}`
  );
  log(
    `main content is ${content.length} chars and begins with: ${content.slice(
      0,
      50
    )}`
  );
  return content;
}

function getMainContent(text) {
  const lines = text.split("\n").filter(isContentLine);
  return lines.join("\n");
}

function isContentLine(str) {
  str = str.trim();

  if (str.length < 50) {
    return false;
  }

  if (str.length > 200 || (isCapital(str[0]) && hasSentenceEnd(str))) {
    return true;
  }

  return false;
}

function isCapital(char) {
  return char === char.toUpperCase();
}

function hasSentenceEnd(str) {
  return /[\.\?\!](”")?$/.test(str);
}

function bertEntityIsValid(entity) {
  if (entity.score < 0.8 || !/^\w\w/.test(entity.word)) return false;

  if (entity.entity_group === "PER") {
    return entity.word.length > 4 && entity.word.split(/\s+/).length > 1;
  }

  if (entity.entity_group === "ORG") {
    return (
      entity.word.length > 3 ||
      (entity.word.length > 1 && entity.word === entity.word.toUpperCase())
    );
  }

  return false;
}

function uniqueEntities(entities) {
  return Object.values(
    entities.reduce((map, entity) => {
      if (!map[entity.name]) {
        map[entity.name] = entity;
      }
      return map;
    }, {})
  );
}
