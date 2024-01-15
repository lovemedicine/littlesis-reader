import { log } from "./util.js";

export function injectLittleSisLinkForMatch({ hit, entity }) {
  const {
    id,
    fields: { type, blurb },
  } = hit;
  const url = buildLittleSisUrl(type, id);
  const regexp = new RegExp(
    `(>[^<]*)(${entity.name})([^>]*<)(.[^h][^1])`,
    "gi"
  );
  log(regexp);
  const newHtml = document.body.innerHTML.replace(
    regexp,
    (_, p1, p2, p3, p4) => {
      return (
        p1 +
        p2 +
        `<a data-littlesis-id="${id}" href="${url}" target="_blank" title="${blurb}" aria-label="${blurb}">` +
        `<img style="display: inline-block;" src="${chrome.runtime.getURL(
          "assets/img/logo.png"
        )}" />` +
        "</a>" +
        p3 +
        p4
      );
    }
  );
  document.body.innerHTML = newHtml;
}

function buildLittleSisUrl(type, id) {
  return `https://littlesis.org/${type.toLowerCase()}/${id}`;
}

export function injectLittleSisNav(matches) {
  const nav = document.createElement("div");
  nav.style.backgroundColor = "#ffffff";
  nav.style.padding = "10px";
  nav.style.width = 300;
  nav.style.top = 0;
  nav.style.right = 0;
  nav.style.position = "fixed";
  nav.style.zIndex = 9999;

  matches.forEach(({ hit }) => {
    const {
      id,
      fields: { name },
    } = hit;
    const div = document.createElement("div");
    const a = document.createElement("a");
    a.innerHTML = name;
    a.style.cursor = "pointer";
    a.addEventListener("click", () => {
      const link = document.querySelector(`[data-littlesis-id="${id}"]`);
      link.scrollIntoView({ block: "center" });
    });
    div.appendChild(a);
    nav.appendChild(div);
  });

  document.body.appendChild(nav);
}
