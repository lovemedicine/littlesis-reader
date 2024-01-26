import { getPageContent, extractEntitiesWithGcp } from "./extract.js";
import { matchLittleSisEntities } from "./search.js";
import { injectLittleSisLinkForMatch, injectLittleSisNav } from "./inject.js";
import { log } from "./util.js";

async function main() {
  const content = getPageContent();
  const entities = await extractEntitiesWithGcp(content);
  log("extracted entities", entities);
  const matchedEntities = await matchLittleSisEntities(entities);
  log("matched entities", matchedEntities);
  matchedEntities.forEach((entity) => {
    injectLittleSisLinkForMatch(entity);
  });
  injectLittleSisNav(matchedEntities);
}

function cleanupEntities(entities) {
  return entities.map((entity) => {
    return {
      id: entity.id,
      name: entity.name,
      type: entity.type === "PERSON" ? "person" : "org",
      blurb: entity.blurb,
    };
  });
}

function buildEntitiesWithRelated({ entities, relationships }) {
  for (let i = 0; i < relationships.length; i++) {
    const { entity1_id, entity2_id } = relationships[i];
    const entity1 = entities[entity1_id];
    const entity2 = entities[entity2_id];

    if (!entity1 || !entity2) {
      continue;
    }

    if (!entity1.related) entity1.related = [];
    if (!entity2.related) entity2.related = [];

    entity1.related.push(entity2.name);
    entity2.related.push(entity1.name);
  }

  return entities;
}

main();
