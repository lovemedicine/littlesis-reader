import { exportsForTesting } from "../src/gcp.js";
const { isUsableEntity } = exportsForTesting;

describe("isUsableEntity", () => {
  it("returns false for person without metadata", () => {
    const entity = { name: "person", type: "PERSON", metadata: {} };
    expect(isUsableEntity(entity)).to.be.false;
  });

  it("returns true for person with metadata", () => {
    const entity = {
      name: "person",
      type: "PERSON",
      metadata: { mid: "someid" },
    };
    expect(isUsableEntity(entity)).to.be.true;
  });

  it("returns true for org with metadata", () => {
    const entity = {
      name: "org",
      type: "ORGANIZATION",
      metadata: { mid: "someid" },
    };
    expect(isUsableEntity(entity)).to.be.true;
  });

  it("returns false for school location without metadata", () => {
    const entity = { name: "school", type: "LOCATION", metadata: {} };
    expect(isUsableEntity(entity)).to.be.false;
  });

  it("returns false for non-school location with metadata", () => {
    const entity = {
      name: "restaurant",
      type: "LOCATION",
      metadata: { mid: "someid" },
    };
    expect(isUsableEntity(entity)).to.be.false;
  });

  it("returns true for school location with metadata", () => {
    const entity = {
      name: "school",
      type: "LOCATION",
      metadata: { mid: "someid" },
    };
    expect(isUsableEntity(entity)).to.be.true;
  });
});
