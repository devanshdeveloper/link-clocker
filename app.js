let myLink = [
  {
    link: "https://www.google.com/",
    text: "Google",
    time: "",
  },
  {
    link: "https://us05web.zoom.us/j/83857138123?pwd=SVJ1ZjFiTHJiWkdIY0l4YXk2YnJxQT09",
    text: "Business Studies",
    time: "09:00",
  },
  {
    link: "https://us05web.zoom.us/j/86259438079?pwd=c2xZMDY3VTdDZFlBRzhaWTU3aFpoZz09",
    text: "Maths",
    time: "09:40",
  },
  {
    link: "https://us04web.zoom.us/j/77295357372?pwd=MFVCcXpTUDlXSHpmYmNmSEtwWGdhZz09",
    text: "English",
    time: "10:20",
  },
  {
    link: "https://us04web.zoom.us/j/71844310834?pwd=MCswUjRLZnhsTmdmOGJoQnFYRTN1QT09",
    text: "Economics",
    time: "11:00",
  },
  {
    link: "https://zoom.us/j/4145799977?pwd=UFJMbHcyUVpjMEhjYW9iNzFWeXFtdz09",
    text: "Accounts",
    time: "11:40",
  },
  {
    link: "https://us04web.zoom.us/j/3279834528?pwd=K1IxWkJycUtOQ3RmQzVNMWYrMFYxdz09",
    text: "Simplifier",
    time: "18:00",
  },
];
// {
//   link: "",
//   text: "",
//   time: "",
// },

let currentEdit = -1;
let linksArr = lsItem("links") || [];
linksArr.forEach((e, i) => (e.id = i));
const inputURL = document.getElementById("inputURL");
const inputText = document.getElementById("inputText");
const inputTime = document.getElementById("inputTime");
const form = document.getElementsByClassName("container")[0];
const linksDiv = document.getElementsByClassName("links")[0];
const wrapper = document.querySelector("wrapper");

function createLink(id, link, text, time) {
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
    let id = (linksArr[linksArr.length - 1]?.id || -1) + 1;
    linksArr.push({ id, link, text, time });
    createLink(id, link, text, time);
  } else {
    linksArr.forEach((e, i) => {
      if (e.id === currentEdit) linksArr[i] = { ...e, link, text, time };
    });
    paintLinks();
    currentEdit = -1;
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
    if (e.altKey && !isNaN(num)) open(linksArr[num - 1].link, "_blank");
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

function createAndAppendTo(tagName, appendTo, html, onclick) {
  const e = document.createElement(tagName);
  if (html) e.innerHTML = html;
  if (appendTo) appendTo.append(e);
  if (onclick) e.addEventListener("dblclick", onclick);
  return e;
}

// javascript: linksArr = myLink
