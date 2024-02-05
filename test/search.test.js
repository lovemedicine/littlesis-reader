jest.mock("../src/api.js");

import { exportsForTesting } from "../src/search.js";
import { callBackendFunction } from "../src/api.js";
const { matchEntitiesWithMetadata } = exportsForTesting;

const lsId1 = "littlesisid1";
const lsId2 = "littlesisid2";
const lsId3 = "littlesisid3";
const lsId4 = "littlesisid4";

callBackendFunction.mockImplementation(async function (_functionName, { key }) {
  if (key === "mid") {
    return Promise.resolve({
      mid1: lsId1,
      mid2: lsId2,
    });
  }

  if (key === "wikipedia_url") {
    return Promise.resolve({
      url1: lsId3,
      url2: lsId4,
    });
  }
});

describe("matchEntitiesWithMetadata()", () => {
  const entities = [
    { name: "Entity1", type: "Person", metadata: { mid: "mid1" } },
    { name: "Entity2", type: "Person", metadata: { mid: "mid2" } },
    { name: "Entity3", type: "Person", metadata: { wikipedia_url: "url1" } },
    { name: "Entity4", type: "Person", metadata: { wikipedia_url: "url2" } },
    { name: "Entity5", type: "Person", metadata: { wikipedia_url: "url3" } },
    { name: "Entity6", type: "Person", metadata: {} },
  ];
  const promise = matchEntitiesWithMetadata(entities);

  it("adds littlesis ids only for entities with matching freebase id", async () => {
    expect.assertions(3);
    const entities = [
      { name: "Entity1", type: "Person", metadata: { mid: "mid1" } },
      { name: "Entity2", type: "Person", metadata: { mid: "mid2" } },
      { name: "Entity3", type: "Person", metadata: { mid: "mid3" } },
    ];
    const matchedEntities = await matchEntitiesWithMetadata(entities);
    expect(matchedEntities[0].id).toBe("littlesisid1");
    expect(matchedEntities[1].id).toBe("littlesisid2");
    expect(matchedEntities[2].id).toBeUndefined();
  });

  it("adds littlesis ids only for entities with matching wikipedia url", async () => {
    expect.assertions(3);
    const entities = [
      { name: "Entity1", type: "Person", metadata: { wikipedia_url: "url1" } },
      { name: "Entity2", type: "Person", metadata: { wikipedia_url: "url2" } },
      { name: "Entity3", type: "Person", metadata: { wikipedia_url: "url3" } },
    ];

    const matchedEntities = await matchEntitiesWithMetadata(entities);
    expect(matchedEntities[0].id).toBe("littlesisid3");
    expect(matchedEntities[1].id).toBe("littlesisid4");
    expect(matchedEntities[2].id).toBeUndefined();
  });

  it("doesn't try to add littlesis ids for entities without metadata", async () => {
    expect.assertions(2);
    const calls = callBackendFunction.mock.calls.length;
    const entities = [{ name: "Entity1", type: "Person", metadata: {} }];
    const matchedEntities = await matchEntitiesWithMetadata(entities);
    expect(callBackendFunction).toHaveBeenCalledTimes(calls);
    expect(matchedEntities[0].id).toBeUndefined();
  });
});
