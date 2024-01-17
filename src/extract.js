import { Readability } from "@mozilla/readability";
import { encodingForModel } from "js-tiktoken";
import { chunkArray, log } from "./util.js";
import {
  getHuggingfaceInference,
  getOpenaiEntitiesAndRelationships,
  getOpenaiRelationshipsForEntities,
} from "./api.js";
import {
  debugMode,
  openaiModel,
  openaiMaxTokens,
  huggingfaceEntityModel,
  huggingfaceRelationModel,
} from "./config.js";

export async function extractEntitiesWithBert(text) {
  const words = text.split(/\s+/);
  const chunks = chunkArray(words, 300);
  const inputs = chunks.map((chunk) => chunk.join(" "));
  // const inputs = text
  //   .split("\n")
  //   .map((line) => {
  //     // chunk each line at 300 words, BERT max tokens is 512 per input
  //     const chunks = chunkArray(line.split(/\s+/), 300);
  //     return chunks.map((chunk) => chunk.join(" "));
  //   })
  //   .flat();
  const bertEntities = await getHuggingfaceInference(huggingfaceEntityModel, {
    inputs,
  });

  return prepareBertEntities(bertEntities);
}

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

export async function extractRelationships({ inputs }) {
  return await getHuggingfaceInference(huggingfaceRelationModel, { inputs });
}

function truncateOpenaiText(text) {
  const encoding = encodingForModel(openaiModel);
  const tokens = encoding.encode(text);
  const truncatedTokens = tokens.slice(0, openaiMaxTokens - 500);
  const truncatedText = encoding.decode(truncatedTokens);
  return truncatedText;
}

export function getVisibleText() {
  const docElem = document.documentElement.cloneNode(true);
  const tags = document.body.getElementsByTagName("*");

  [...tags].forEach((tag) => {
    const style = window.getComputedStyle(tag);

    if (
      !style ||
      style.visibility === "hidden" ||
      style.display === "none" ||
      style.opacity == 0 ||
      (parseInt(style.height.replace("px", "")) < 2 &&
        parseInt(style.width.replace("px", "")) < 2)
    ) {
      tag.remove();
    }
  });

  const page = new Readability(document).parse();
  document.documentElement.replaceWith(docElem);
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

function prepareBertEntities(entityGroups) {
  const nameIndex = {};

  function isRelevant(entity) {
    if (entity.score < 0.8 || !/^\w\w/.test(entity.word)) return false;

    if (entity.entity_group === "PER") {
      return entity.word.length > 4 && entity.word.split(/\s+/).length > 1;
    }

    if (entity.entity_group === "ORG") {
      return (
        entity.word.length > 4 ||
        (entity.word.length > 1 && entity.word === entity.word.toUpperCase())
      );
    }

    return false;
  }

  function isNotDuplicate(entity) {
    if (nameIndex[entity.name]) {
      return false;
    } else {
      nameIndex[entity.name] = true;
      return true;
    }
  }

  function cleanupName(entity) {
    // BERT sometimes surrounds hyphens with spaces
    entity.name = entity.word.replace(" - ", "-");
    return entity;
  }

  return entityGroups.map((entities) => {
    entities = entities.filter(isRelevant).map(cleanupName);
    // .filter(isNotDuplicate);
    const entityNames = entities.map((entity) => entity.name);
    return entities.map((entity, index) => ({
      id: index,
      name: entity.name,
      type: entity.entity_group === "PER" ? "person" : "org",
      related: entityNames.filter((name) => name !== entity.name),
    }));
  });
}

function removeDuplicateEntities(entityGroups) {
  // return Object.values(
  //   entities.reduce((map, entity) => {
  //     if (!map[entity.name]) {
  //       map[entity.name] = entity;
  //     }
  //     return map;
  //   }, {})
  // );

  const nameIndex = {};

  return entityGroups.map((group) => {
    const newGroup = [];

    group.forEach((entity) => {
      if (!nameIndex[entity.name]) {
        newGroup.push(entity);
        nameIndex[entity.name] = true;
      }
    });

    return newGroup;
  });
}
