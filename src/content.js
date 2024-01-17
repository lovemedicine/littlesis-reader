import {
  getPageContent,
  extractEntitiesWithBert,
  extractRelationshipsFromEntities,
} from "./extract.js";
import { matchLittleSisEntities } from "./search.js";
import { injectLittleSisLinkForMatch, injectLittleSisNav } from "./inject.js";
import { log } from "./util.js";

async function main() {
  console.time("entity names");
  const content = getPageContent();
  log(content);
  const entities = await extractEntitiesWithBert(content);
  console.timeEnd("entity names");
  console.log(entities);
  // const entitiesWithNearbyRelated = buildEntitiesWithRelatedUsingContent(
  //   entities,
  //   content
  // );
  // console.log(entitiesWithNearbyRelated);
  return;
  log(entities.map((entity) => entity.name));
  const { relationships } = await extractRelationshipsFromEntities(
    content,
    entities
  );
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

// function buildEntitiesWithRelatedUsingContent(entities, content) {
//   const lineBreakIndexes = [
//     ...content.matchAll(new RegExp("\n", "gi")),
//   ].map((a) => a.index);

//   const singleLineEntityGroups = {}

//   for (let i = 0; i < entities.length; i++) {
//     const index = content.indexOf(entity.name);

//     for (let j = 0; j < lineBreakIndexes.length; j++) {
//       if (index > lineBreakIndexes)
//     }
//   }
// }

main();
