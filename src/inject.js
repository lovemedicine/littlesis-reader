import { log } from "./util.js";

export function injectLittleSisLinkForMatch({ id, name, type, blurb }) {
  const url = buildLittleSisUrl(type, id);
  const regexp = new RegExp(`(>[^<]*)(${name})([^>]*<)(.[^h][^1])`, "gi");
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

export function injectLittleSisNav(entities) {
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

  entities.forEach((entity) => {
    const { id, name, blurb } = entity;
    const div = document.createElement("div");
    const a = document.createElement("a");
    a.innerHTML = name;
    if (blurb) {
      a.title = blurb;
    }
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
  navButton.style.backgroundColor = "white";
  navButton.style.padding = "5px";
  navButton.style.top = 0;
  navButton.style.right = 0;
  navButton.style.maxHeight = window.innerHeight;
  navButton.style.overflowY = "scroll";
  navButton.style.position = "fixed";
  navButton.style.zIndex = 10000;

  const img = document.createElement("img");
  img.src = chrome.runtime.getURL("assets/img/logo.png");
  img.style.cursor = "pointer";
  img.addEventListener("click", () => {
    const navElement = document.getElementById("littlesis-reader-nav");
    if (navElement.style.display === "none") {
      navElement.style.display = "block";
    } else {
      navElement.style.display = "none";
    }
  });
  navButton.appendChild(img);
  document.body.appendChild(navButton);
}
