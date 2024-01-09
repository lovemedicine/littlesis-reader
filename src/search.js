import { laTimesEntities as entitiesWithRelated } from "./testData.js";
import { maxEntitiesToMatch, maxRelatedEntities } from "./config.js";
import { log } from "./util.js";

async function main() {
  const matches = await matchLittleSisEntities(entitiesWithRelated);
  matches.forEach((match) => {
    log(match.hits.hit);
  });
}

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
  const typeQuery = `type:'${prepareType(type)}'`;
  const preparedRelated = related.map(prepareRelatedName);
  const relatedQuery =
    "(or " +
    preparedRelated
      .slice(0, maxRelatedEntities)
      .map((name) => `related:'${name}'`)
      .join(" ") +
    ")";
  return `(and (or name:'${name}' aliases:'${name}') ${typeQuery} ${relatedQuery})`;
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

// main();
