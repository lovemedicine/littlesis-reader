import { maxRelatedEntities } from "./config.js";
import {
  findLittlesisEntities,
  getLittlesisIdsFromGcpMetadata,
} from "./api.js";

export async function matchLittleSisEntities(entities) {
  entities = await matchEntitiesWithMetadata(entities);
  entities = await matchEntitiesWithRelated(entities);
  return convertSearchResultsToEntities(entities);
}

async function matchEntitiesWithMetadata(entities) {
  const metadataMap = {};
  const metadataKeys = ["mid", "wikipedia_url"];

  const maps = await Promise.all(
    metadataKeys.map(async (key) => {
      const metadataValues = entities
        .map((entity) => entity.metadata[key])
        .filter(Boolean);
      const map = await getLittlesisIdsFromGcpMetadata(key, metadataValues);
      return [key, map];
    })
  );

  maps.forEach(([key, map]) => {
    metadataMap[key] = map;
  });

  return entities.map((entity) => {
    if (entity.metadata.mid) {
      const id = metadataMap["mid"][entity.metadata.mid];

      if (id) {
        entity.id = id;
        return entity;
      }
    }

    if (entity.metadata.wikipedia_url) {
      const id = metadataMap["wikipedia_url"][entity.metadata.wikipedia_url];

      if (id) {
        entity.id = id;
        return entity;
      }
    }

    return entity;
  });
}

async function matchEntitiesWithRelated(entities) {
  return await Promise.all(entities.map(searchLittleSisEntities));
}

async function searchLittleSisEntities(entity) {
  const query = buildSearchQuery(entity);
  const data = await findLittlesisEntities(query);
  return { ...data, entity };
}

function buildSearchQuery(entity) {
  if (entity.id) {
    return `_id:${entity.id}`;
  }

  const { name, type, related } = entity;
  const nameQuery = `(or (near boost=5 field=name distance=1 '${name}') (phrase boost=3 field=aliases '${name}'))`;
  const typeQuery = `type:'${prepareType(type)}'`;
  const preparedRelated = related.map(prepareRelatedName);
  const blurbQuery = buildRelatedQuery(preparedRelated, "blurb", 5);
  const relatedQuery = buildRelatedQuery(preparedRelated, "related", 2);
  return `(and ${nameQuery} ${typeQuery} ${blurbQuery} ${relatedQuery})`;
}

function prepareType(type) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function prepareRelatedName(name) {
  const omit = {
    inc: true,
    corp: true,
    llc: true,
    corporation: true,
    company: true,
  };
  return name
    .toLowerCase()
    .replace(/[\.,]/g, "")
    .split(" ")
    .filter((part) => part.length > 2 && !omit[part])
    .join(" ");
}

function buildRelatedQuery(relatedNames, field, boost) {
  return (
    "(or " +
    relatedNames
      .slice(0, maxRelatedEntities)
      .map(
        (name) => `(near boost=${boost} field=${field} distance=1 '${name}')`
      )
      .join(" ") +
    // so that the search will succeed, but without a boost, even if there's no match on related
    `(not boost=0.001 field=${field} 'match_without_boost')` +
    ")"
  );
}

function convertSearchResultsToEntities(searchResults) {
  return searchResults
    .filter((result) => result.hits?.hit?.length)
    .map((result) => {
      const hit = result.hits.hit[0];
      const {
        id,
        fields: { type, blurb },
      } = hit;
      return { id, type, name: result.entity.name, blurb };
    });
}
