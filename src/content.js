import { getPageContent, extractEntities } from "./extract.js";
import { matchEntities } from "./search.js";
import { injectEntities } from "./inject.js";
import { log } from "./util.js";

async function main() {
  const content = getPageContent();
  log("page content", content);
  const entities = await extractEntities("gcp", content);
  log("extracted entities", entities);
  const matchedEntities = await matchEntities(entities);
  log("matched entities", matchedEntities);
  injectEntities(matchedEntities);
}

main();
