let myLink = [
  {
    link: "https://www.google.com/",
    text: "Google",
    time: "",
    isOpenIn: true,
  },
  {
    link: "http://youtube.com/",
    text: "YouTube",
    time: "",
    isOpenIn: true,
  },
  {
    link: "https://us05web.zoom.us/j/83857138123?pwd=SVJ1ZjFiTHJiWkdIY0l4YXk2YnJxQT09",
    text: "Business Studies",
    time: "09:00",
    isOpenIn: false,
  },
  {
    link: "https://us05web.zoom.us/j/86259438079?pwd=c2xZMDY3VTdDZFlBRzhaWTU3aFpoZz09",
    text: "Maths",
    time: "09:40",
    isOpenIn: false,
  },
  {
    link: "https://us04web.zoom.us/j/77295357372?pwd=MFVCcXpTUDlXSHpmYmNmSEtwWGdhZz09",
    text: "English",
    time: "10:20",
    isOpenIn: false,
  },
  {
    link: "https://us04web.zoom.us/j/71844310834?pwd=MCswUjRLZnhsTmdmOGJoQnFYRTN1QT09",
    text: "Economics",
    time: "11:00",
    isOpenIn: false,
  },
  {
    link: "https://zoom.us/j/4145799977?pwd=UFJMbHcyUVpjMEhjYW9iNzFWeXFtdz09",
    text: "Accounts",
    time: "11:40",
    isOpenIn: false,
  },
];
// {
//   link: "",
//   text: "",
//   time: "",
// isOpenIn : false
// },

let currentEdit = -1;
let linksArr = lsItem("links") || [];
linksArr.forEach((e, i) => (e.id = i));
const inputURL = document.getElementById("inputURL");
const inputText = document.getElementById("inputText");
const inputTime = document.getElementById("inputTime");
const form = document.getElementsByClassName("container")[0];
const linksDiv = document.getElementsByClassName("links")[0];
const wrapper = document.querySelector(".wrapper");
const iframeEl = document.querySelector(".iframeDiv iframe");
const closeBtn = document.querySelector(".wrapper button");
const showLinkText = document.querySelector(".wrapper p");
const inputOpenIn = document.getElementById("inputIsOpen");

function createLink({ id, link, text, time, isOpenIn }) {
  const linkDiv = createAndAppendTo("div", linksDiv);
  const anchorDiv = createAndAppendTo("div", linkDiv);
  const iconImg = createAndAppendTo("img", anchorDiv);
  const anchor = createAndAppendTo("a", anchorDiv, text || link);
  createAndAppendTo("span", linkDiv, link);
  createAndAppendTo("span", linkDiv, time);
  const btnDiv = createAndAppendTo("div", linkDiv);
  createAndAppendTo("button", btnDiv, "Edit", () => {
    currentEdit = id;
    inputText.value = text;
    inputURL.value = link;
    inputTime.value = time;
    inputOpenIn.checked = isOpenIn;
  });
  createAndAppendTo("button", btnDiv, "Delete", () =>
    paintLinks(linksArr.filter((e) => e.id !== id))
  );
  iconImg.src = `https://s2.googleusercontent.com/s2/favicons?domain_url=${link}`;
  anchorDiv.classList.add("anchorDiv");
  anchor.href = link;
  anchor.target = "_blank";
  iconImg.addEventListener("click", () => openLink(text, link));
  linkDiv.classList.add("link");
}

function openLink(text, link, isOpenIn) {
  if (isOpenIn) open(link, "_blank");
  else {
    iframeEl.src = link;
    showLinkText.innerHTML = text;
    wrapper.style.display = "flex";
  }
}

function paintLinks(newLinksArr) {
  if (newLinksArr) linksArr = newLinksArr;
  linksDiv.innerHTML = "";
  linksArr.forEach(createLink);
}

function updateLink(link, text, time, isOpenIn) {
  if (currentEdit === -1) {
    let id = (linksArr[linksArr.length - 1]?.id || -1) + 1;
    linksArr.push({ id, link, text, time, isOpenIn });
    createLink(linksArr[linksArr.length - 1]);
  } else {
    linksArr.forEach((e, i) => {
      if (e.id === currentEdit)
        linksArr[i] = { ...e, link, text, time, isOpenIn };
    });
    paintLinks();
    currentEdit = -1;
  }
  inputText.value = "";
  inputURL.value = "";
  inputTime.value = "";
  inputOpenIn.checked = false;
}

window.addEventListener("load", () => {
  setTimer();
  paintLinks();
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    updateLink(
      inputURL.value,
      inputText.value,
      inputTime.value,
      inputOpenIn.checked
    );
  });
  closeBtn.addEventListener("click", () => {
    wrapper.style.display = "none";
    iframeEl.src = "";
  });
  addEventListener("beforeunload", () => lsItem("links", linksArr));
  addEventListener("keydown", (e) => {
    let num = parseInt(e.key);
    let l = linksArr[num - 1];
    if (e.altKey && !isNaN(num)) openLink(l.text, l.link, l.isOpenIn);
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
      if (toNumber(new Date()) === e.time) openLink(e.text, e.link , e.isOpenIn);
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
