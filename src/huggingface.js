import { huggingfaceApiKey } from "./config.js";
import { chunkArray } from "./util.js";

// returns entities in the form of { name, type, related }
export async function extractEntitiesWithBert(text) {
  const words = text.split(/\s+/);
  const chunks = chunkArray(words, 300);
  const inputs = chunks.map((chunk) => chunk.join(" "));

  // could alternatively group chunks by paragraph ("line") to preserve paragraph
  // grouping for adding related entities:
  //
  // const inputs = text
  //   .split("\n")
  //   .map((line) => {
  //     // chunk each line at 300 words, BERT max tokens is 512 per input
  //     const chunks = chunkArray(line.split(/\s+/), 300);
  //     return chunks.map((chunk) => chunk.join(" "));
  //   })
  //   .flat();

  const bertEntities = await getHuggingfaceInference("dslim/bert-base-NER", {
    inputs,
  });

  return prepareBertEntities(bertEntities);
}

function prepareBertEntities(entityGroups) {
  const nameIndex = {};

  function isNotDuplicate(entity) {
    if (nameIndex[entity.name]) {
      return false;
    } else {
      nameIndex[entity.name] = true;
      return true;
    }
  }

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

  function cleanupName(entity) {
    // BERT sometimes surrounds hyphens with spaces
    entity.name = entity.word.replace(" - ", "-");
    return entity;
  }

  return entityGroups
    .map((entities) => {
      entities = entities.filter(isRelevant).map(cleanupName);
      // .filter(isNotDuplicate);
      const entityNames = entities.map((entity) => entity.name);
      return entities.map((entity) => ({
        name: entity.name,
        type: entity.entity_group === "PER" ? "Person" : "Org",
        related: entityNames.filter((name) => name !== entity.name),
      }));
    })
    .flat();
}

export async function extractRelationshipsWithRebel({ inputs }) {
  return await getHuggingfaceInference("Babelscape/rebel-large", { inputs });
}

async function getHuggingfaceInference(model, { inputs }) {
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
