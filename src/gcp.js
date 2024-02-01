import { callBackendFunction } from "./api.js";

// returns entities in the form of { name, type, related, metadata }
export async function extractEntitiesWithGcp(text) {
  const gcpEntities = await getGcpNamedEntities(text);
  console.log(gcpEntities);
  return prepareGcpEntities(gcpEntities);
}

async function getGcpNamedEntities(text) {
  return await callBackendFunction("getGcpNamedEntities", { text });
}

function prepareGcpEntities(entities) {
  entities = entities.filter(isUsableEntity).map(formatEntity);
  return addRelatedToEntities(entities);
}

function isUsableEntity(entity) {
  return Boolean(
    (["PERSON", "ORGANIZATION"].includes(entity.type) ||
      (entity.type === "LOCATION" &&
        /university|college|school/i.test(entity.name))) &&
      (entity.metadata.mid || entity.metadata.wikipedia_url)
  );
}

function formatEntity(entity) {
  return {
    ...entity,
    type: entity.type === "PERSON" ? "Person" : "Org",
  };
}

function addRelatedToEntities(entities) {
  const nameMap = entities.reduce((map, entity) => {
    map[entity.name] = entity;
    return map;
  }, {});

  const offsetMap = entities.reduce((map, entity) => {
    entity.mentions
      .map((mention) => mention.text.beginOffset)
      .forEach((offset) => {
        map[offset] = entity.name;
      });
    return map;
  }, {});

  const lastOffset = Math.max(...Object.keys(offsetMap));
  const groupRange = 300;
  let group = {};

  for (let i = 0; i < lastOffset; i++) {
    let mid = i + Math.floor(groupRange / 2);
    let end = i + groupRange;

    // if there's an entity at the end of offset range, add it to the group
    if (offsetMap[end]) {
      group[end] = true;
    }

    // when an entity is at the midpoint of the range, add all the names of entities
    // in the range to the entity's related set
    if (group[mid]) {
      const entity = nameMap[offsetMap[mid]];
      Object.keys(group).forEach((offset) => {
        // skip entity's own name
        if (offsetMap[offset] === entity.name) {
          return;
        }

        entity.related = (entity.related || new Set()).add(offsetMap[offset]);
      });
    }

    // remove from group any entity at start of offset range
    delete group[i];
  }

  // convert set of related names to array
  return Object.values(nameMap).map((entity) => {
    entity.related = [...(entity.related || [])];
    return entity;
  });
}

export let exportsForTesting;

if (process.env.NODE_ENV === "test") {
  exportsForTesting = {
    isUsableEntity,
    prepareGcpEntities,
  };
}
