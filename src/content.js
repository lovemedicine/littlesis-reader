import { getPageContent, extractEntitiesAndRelationships } from "./extract.js";
import { matchLittleSisEntities } from "./search.js";
import { log } from "./util.js";
// import { laTimesEntities as entitiesWithRelated } from "./testData.js";

async function main() {
  const content = getPageContent();
  const data = await extractEntitiesAndRelationships(content);
  const entitiesWithRelated = buildEntitiesWithRelated(data);
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

  return entities.filter((entity) => entity.related?.length);
}

function injectLittleSisLinkForMatch({ hit, entity }) {
  const {
    id,
    fields: { name, type, blurb, aliases },
  } = hit;
  const url = `https://littlesis.org/${type.toLowerCase()}/${id}`;
  const regexp = new RegExp(
    `(>[^<]*)(${entity.name})([^>]*<)(.[^h][^1])`,
    "gi"
  );
  log(regexp);
  const newHtml = document.body.innerHTML.replace(
    regexp,
    (_, p1, p2, p3, p4) => {
      return p1 + `<a href="${url}" target="_blank">` + p2 + "</a>" + p3 + p4;
    }
  );
  document.body.innerHTML = newHtml;
}

main();
