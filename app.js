let currentEdit = -1;
let linksArr = lsItem("links") || [];
linksArr.forEach((e, i) => (e.id = i));
const inputURL = document.getElementById("inputURL");
const inputText = document.getElementById("inputText");
const inputTime = document.getElementById("inputTime");
const form = document.getElementsByClassName("container")[0];
const linksDiv = document.getElementsByClassName("links")[0];

function createLink(id, link, text, time) {
  function createAndAppendTo(tagName, appendTo, html, onclick) {
    const e = document.createElement(tagName);
    if (html) e.innerHTML = html;
    if (appendTo) appendTo.append(e);
    if (onclick) e.addEventListener("click", onclick);
    return e;
  }
  const linkDiv = createAndAppendTo("div", linksDiv);
  const anchorDiv = createAndAppendTo("div", linkDiv);
  const anchor = createAndAppendTo("a", anchorDiv, text || link);
  createAndAppendTo("span", linkDiv, link);
  createAndAppendTo("span", linkDiv, time);
  const btnDiv = createAndAppendTo("div", linkDiv);
  createAndAppendTo("button", btnDiv, "Edit", () => {
    currentEdit = id;
    inputText.value = text;
    inputURL.value = link;
    inputTime.value = time;
  });
  createAndAppendTo("button", btnDiv, "Delete", () =>
    paintLinks(linksArr.filter((e) => e.id !== id))
  );
  anchor.href = link;
  anchor.target = "_blank";
  linkDiv.classList.add("link");
}

function paintLinks(newLinksArr) {
  if (newLinksArr) linksArr = newLinksArr;
  linksDiv.innerHTML = "";
  linksArr.forEach((e) => createLink(e.id, e.link, e.text, e.time));
}

function updateLink(link, text, time) {
  if (currentEdit === -1) {
    let id = linksArr.length;
    createLink(id, link, text, time);
    linksArr.push({ id, link, text, time });
  } else {
    linksArr.forEach((e, i) => {
      if (e.id === currentEdit) linksArr[i] = { ...e, link, text, time };
    });
    paintLinks();
  }
  inputText.value = "";
  inputURL.value = "";
  inputTime.value = "";
}

window.addEventListener("load", () => {
  setTimer();
  paintLinks();
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    updateLink(inputURL.value, inputText.value, inputTime.value);
  });
  addEventListener("beforeunload", () => lsItem("links", linksArr));
  addEventListener("keydown", (e) => {
    let num = parseInt(e.key);
    if (e.altKey) if (!isNaN(num)) open(linksArr[num - 1].link, "_blank");
  });
});

function toNumber(t) {
  const pad = (n) => (n < 10 ? "0" + n : n);
  return `${pad(t.getHours())}:${pad(t.getMinutes())}`;
}

function lsItem(key, value) {
  if (value) localStorage.setItem(key, JSON.stringify(value));
  else {
    let temp = localStorage.getItem(key);
    if (temp) return JSON.parse(temp);
  }
}

function setTimer() {
  setInterval(() => {
    linksArr.forEach((e) => {
      if (toNumber(new Date()) === e.time) open(e.link, "_blank");
    });
  }, 30000);
}
