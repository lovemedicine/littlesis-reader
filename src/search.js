// import { laTimesEntities as entitiesWithRelated } from "./testData.js";
import { maxEntitiesToMatch, maxRelatedEntities } from "./config.js";
import { log } from "./util.js";

// async function main() {
//   const matches = await matchLittleSisEntities(entitiesWithRelated);
//   matches.forEach((match) => {
//     log(match.hits.hit);
//   });
// }

export async function matchLittleSisEntities(entities) {
  const entitiesToMatch = entities
    .filter((entity) => entity.related?.length)
    .slice(0, maxEntitiesToMatch);
  return await Promise.all(entitiesToMatch.map(searchLittleSisEntities));
}

async function searchLittleSisEntities(entity) {
  const query = buildSearchQuery(entity);
  log("query", query);
  const endpoint =
    "https://2c76ayi2ic.execute-api.us-east-1.amazonaws.com/search";
  const url = `${endpoint}?q=${encodeURIComponent(query)}&q.parser=structured`;
  const response = await fetch(url);
  const data = await response.json();
  return { ...data, entity };
}

function buildSearchQuery(entity) {
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
    co: true,
    corp: true,
    llc: true,
  };
  return name
    .toLowerCase()
    .replace(/[\.,]/g, "")
    .split(" ")
    .filter((part) => !omit[part])
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

// main();
