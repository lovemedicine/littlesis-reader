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
        `<img style="display: inline-block; height: 16px; width: 16px;" src="${chrome.runtime.getURL(
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
  nav.id = "littlesis-reader-nav";
  nav.style.backgroundColor = "#ffffff";
  nav.style.padding = "10px";
  nav.style.width = 300;
  nav.style.top = 0;
  nav.style.right = 0;
  nav.style.position = "fixed";
  nav.style.zIndex = 9999;
  nav.style.display = "none";

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

  const navButton = document.createElement("div");
  nav.style.backgroundColor = "#ffffff";
  nav.style.padding = "5px";
  nav.style.top = 0;
  nav.style.right = 0;
  nav.style.position = "fixed";
  nav.style.zIndex = 10000;
  nav.style.display = "none";

  const img = document.createElement("img");
  img.src = chrome.runtime.getURL("assets/img/logo.png");
  img.style.cursor = "pointer";
  img.addEventListener("click", () => {
    const nav = document.getElementById("littlesis-reader-nav");
    if (nav.style.display === "none") {
      nav.style.display = "block";
    } else {
      nav.style.display = "none";
    }
  });
  navButton.appendChild(img);
  document.body.appendChild(navButton);
}
