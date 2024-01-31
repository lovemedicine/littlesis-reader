import { getPageContent } from "../src/extract.js";
import { JSDOM } from "jsdom";

function setDomHtml(html) {
  const dom = new JSDOM(html, { url: "http://localhost" });
  global.window = dom.window;
  global.document = dom.window.document;
}

describe("getPageContent()", () => {
  context("page with 200 chars of paragraphs", () => {
    const para1 =
      "Here is a fairly short paragraph. It only has three sentences. This is the last sentence.";
    const para2 = "Here is a very short paragraph.";
    const para3 =
      "Here is another fairly short paragraph. It only has three sentences, can you believe it? This is the last sentence of this paragraph.";
    const html = `
      <html>
        <body>
          <p>${para1}</p>
          <p>${para2}</p>
          <p>${para3}</p>
          </body>
      </html>
    `;
    setDomHtml(html);
    const content = getPageContent();

    it("returns paragraphs", () => {
      expect(content).to.include(para1);
      expect(content).to.include(para2);
      expect(content).to.include(para3);
    });
  });

  context("page without paragraphs", () => {
    const visibleSentence =
      "Here is a sentence long enough to be considered part of the main content.";
    const hiddenSentence =
      "Here is a sentence that's long enough but not visible.";
    const shortText = "Too short.";
    const html = `
    <html>
      <body>
        <div style="height: 10px; width: 100px">${visibleSentence}</div>
        <div style="height: 10px; width: 10px; display: none;">${hiddenSentence}</div>
        <div style="height: 10px; width: 100px;">${shortText}</div>
      </body>
    </html>
  `;
    setDomHtml(html);
    const content = getPageContent();

    it("includes visible text", () => {
      expect(content).to.include(visibleSentence);
    });

    it("excludes hidden text", () => {
      expect(content).not.to.include(hiddenSentence);
    });

    it("excludes short text", () => {
      expect(content).not.to.include(shortText);
    });

    it("leaves document unchanged", () => {
      const before = document.innerHTML;
      getPageContent();
      const after = document.innerHTML;
      expect(before).to.equal(after);
    });
  });
});
