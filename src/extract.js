import { Readability } from "@mozilla/readability";
import { extractEntitiesWithGcp } from "./gcp.js";
import { extractEntitiesWithBert } from "./huggingface.js";

const entityExtractors = {
  gcp: extractEntitiesWithGcp,
  bert: extractEntitiesWithBert,
};

export async function extractEntities(engine = "gcp", text) {
  return entityExtractors[engine](text);
}

export function getPageContent() {
  let text = getParagraphText();

  if (text && text.length > 200) {
    return text;
  }

  return getMainContent(getVisibleText());
}

function getParagraphText() {
  const paras = [...document.querySelectorAll("p")];

  if (!paras?.length) {
    return null;
  }

  // textContent is easier to test than innerText but might contain hidden text
  return paras.map((element) => element.textContent?.trim()).join("\n");
}

function getVisibleText() {
  const docElem = document.documentElement.cloneNode(true);
  const tags = document.body.getElementsByTagName("*");

  [...tags].forEach((tag) => {
    const style = window.getComputedStyle(tag);

    if (
      !style ||
      style.visibility === "hidden" ||
      style.display === "none" ||
      style.opacity === 0 ||
      (parseInt(style.height.replace("px", "")) < 2 &&
        parseInt(style.width.replace("px", "")) < 2)
    ) {
      tag.remove();
    }
  });

  const page = new Readability(document).parse();
  document.documentElement.replaceWith(docElem);
  return page.textContent.trim();
}

function getMainContent(text) {
  const lines = text.split("\n").filter(isContentLine);
  return lines.join("\n");
}

function isContentLine(str) {
  str = str.trim();

  if (str.length < 50) {
    return false;
  }

  if (str.length > 200 || (isCapital(str[0]) && hasSentenceEnd(str))) {
    return true;
  }

  return false;
}

function isCapital(char) {
  return char === char.toUpperCase();
}

function hasSentenceEnd(str) {
  return /[\.\?\!](”")?$/.test(str);
}
