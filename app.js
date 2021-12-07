let linksArr = ls.item("links") || [];
const inputURL = document.getElementById("inputURL");
const inputText = document.getElementById("inputText");
const inputTime = document.getElementById("inputTime");
const form = document.getElementsByClassName("container")[0];
const linksDiv = document.getElementsByClassName("links")[0];
const linkDivs = () => document.getElementsByClassName("link");
// console.log(document.getElementById(''));
function deleteLink(id) {
  linksArr.splice(id, 1);
  linkDivs()[id].remove();
}
function createLink(link, text, time, i) {
  function createAndAppendTo(tagName, appendTo, html) {
    if (!tagName) return;
    const e = document.createElement(tagName);
    if (html) e.innerHTML = html;
    if (appendTo) appendTo.append(e);
    return e;
  }
  const linkDiv = createAndAppendTo("div", linksDiv);
  const anchorDiv = createAndAppendTo("div", linkDiv);
  const anchor = createAndAppendTo("a", anchorDiv, text || link);
  createAndAppendTo("span", linkDiv, link);
  createAndAppendTo("span", linkDiv, time);
  const btnDiv = createAndAppendTo("div", linkDiv);
  const editBtn = createAndAppendTo("button", btnDiv, "Edit");
  const deleteBtn = createAndAppendTo("button", btnDiv, "Delete");
  deleteBtn.addEventListener("click", () => {
    linksArr.splice(i, 1);
    linkDivs()[i].remove();
  });
  editBtn.addEventListener("click", () => {
    inputText.value = text;
    inputTime.value = time;
    inputURL.value = link;
    form.id = i;
  });
  anchor.href = link;
  anchor.target = "_blank";
  linkDiv.classList.add("link");
}
function paintLinks() {
  linksArr.forEach((e, i) => createLink(e.link, e.text, e.time, i));
}

function toNumber(t) {
  const pad = (n) => (n < 10 ? "0" + n : n);
  return `${pad(t.getHours())}:${pad(t.getMinutes())}`;
}
function updateLinks(link, text, time, i) {
  if (!link) return;
  if (i) {
    linksArr[+i] = { link, text, time };
    [anchor, linkSpan, timeSpan] = linkDivs()[+i].children;
    anchor.innerText = text || link;
    anchor.href = link;
    linkSpan.innerText = link;
    timeSpan.innerText = time;
    inputText.value = "";
    inputTime.value = "";
    inputURL.value = "";
    form.id = "";
  } else {
    createLink(link, text, time, linksArr.length);
    linksArr.push({ link, text, time });
  }
}
function App() {
  setInterval(() => {
    linksArr.forEach((e) => {
      if (toNumber(new Date()) === e.time) open(e.link, "_blank");
    });
  }, 50000);
  paintLinks();
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    updateLinks(inputURL.value, inputText.value, inputTime.value, form.id);
  });
  addEventListener("beforeunload", () => ls.item("links", linksArr));
  addEventListener("keydown", (e) => {
    let num = parseInt(e.key);
    if (e.altKey) if (!isNaN(num)) open(linksArr[num - 1].link, "_blank");
  });
}
addEventListener("load", App);
