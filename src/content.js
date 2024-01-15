import {
  getPageContent,
  extractEntitiesAndRelationships,
  extractEntitiesWithBert,
  extractRelationshipsFromEntities,
} from "./extract.js";
import { matchLittleSisEntities } from "./search.js";
import { injectLittleSisLinkForMatch, injectLittleSisNav } from "./inject.js";
import { log } from "./util.js";

async function main() {
  const content = getPageContent();
  const entities = await extractEntitiesWithBert(content);
  console.log(entities);
  const { relationships } = await extractRelationshipsFromEntities(
    content,
    entities
  );
  console.log(relationships);
  const entitiesWithRelated = buildEntitiesWithRelated({
    entities,
    relationships,
  });
  log(entitiesWithRelated);
  log(
    `extracted entities: ${entitiesWithRelated
      .map((entity) => entity.name)
      .join(", ")}`
  );
  const results = await matchLittleSisEntities(entitiesWithRelated);
  const matches = results
    .filter((result) => result.hits?.hit?.length)
    .map((result) => {
      return { hit: result.hits.hit[0], entity: result.entity };
    });
  log(matches);
  matches.forEach((match) => {
    injectLittleSisLinkForMatch(match);
  });
  injectLittleSisNav(matches);
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
