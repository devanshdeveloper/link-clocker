const myLink = [
  {
    url: "https://www.google.com/",
    text: "Google",
    time: "",
    toOpen: true,
    toNotify: false,
    openIn: "New Window",
  },
  {
    url: "http://youtube.com/",
    text: "YouTube",
    time: "",
    toOpen: true,
    toNotify: false,
    openIn: "New Window",
  },
  {
    url: "https://us04web.zoom.us/j/71844310834?pwd=MCswUjRLZnhsTmdmOGJoQnFYRTN1QT09",
    text: "Econmics",
    time: "09:10",
    toOpen: true,
    toNotify: false,
    openIn: "New Tab",
  },
  {
    url: "https://us05web.zoom.us/j/85988493170?pwd=c1BvQVloRkZoYmFyUVFDRE5VS3pPdz09",
    text: "Maths",
    time: "09:45",
    toOpen: true,
    toNotify: false,
    openIn: "New Tab",
  },
  {
    url: "https://us04web.zoom.us/j/77295357372?pwd=MFVCcXpTUDlXSHpmYmNmSEtwWGdhZz09",
    text: "English",
    time: "10:20",
    toOpen: true,
    toNotify: false,
    openIn: "New Tab",
  },
  {
    url: "https://zoom.us/j/4145799977?pwd=UFJMbHcyUVpjMEhjYW9iNzFWeXFtdz09",
    text: "Accounts",
    time: "10:55",
    toOpen: true,
    toNotify: false,
    openIn: "New Tab",
  },
  {
    url: "https://us05web.zoom.us/j/9766781918?pwd=Qzc3L0ZDUnIxTmVocStzay9zSll2Zz09",
    text: "Business Studies",
    time: "11:50",
    toOpen: true,
    toNotify: false,
    openIn: "New Tab",
  },
];
let currentEdit = -1;
let linksArr = lsItem("links") || [];
linksArr.forEach((e, i) => {
  e.id = i;
  e.isOpened = false;
});
const wrapper = document.querySelector(".wrapper");
const form = document.querySelector(".container");
const linksDiv = document.querySelector(".links");
const iframeEl = document.querySelector(".iframeDiv iframe");
const ctxMenu = document.getElementById("menu");
// selects
const showLinkText = wrapper.querySelector("p");
const [refreshBtn, closeBtn] = wrapper.querySelectorAll("button");
const openInInput = document.getElementById("openInInput");
const openInLinkInput = document.getElementById("openIn");
const [URLInput, textInput, timeInput, toOpenInput] =
  form.getElementsByTagName("input");
const [editBtn, deleteBtn, copyBtn, shareBtn] =
  ctxMenu.getElementsByTagName("button");
const [toOpenLinkInput, toNotifyLinkInput] =
  ctxMenu.getElementsByTagName("input");
addEventListener("DOMContentLoaded", () => {
  setTimer();
  paintLinks();
  refreshBtn.addEventListener("click", () => (iframeEl.src = iframeEl.src));
  iframeEl.addEventListener("load", showIframe);
  addEventListener("beforeunload", () => lsItem("links", linksArr));
  addEventListener("keydown", (e) => {
    let num = parseInt(e.key);
    let l = linksArr[num - 1];
    if (!e.altKey) return;
    if (!isNaN(num)) openLink(l.text, l.link, "iframe");
  });
  URLInput.addEventListener("focus", function () {
    navigator.clipboard
      .readText()
      .then((text) => isUrl(text) && (this.value = text));
  });
});
// handlers
function handleSubmit(e) {
  e.preventDefault();
  const url = URLInput.value;
  if (!isUrl(url)) return alert("invalid url");
  const isEdit = !!~currentEdit;
  linksArr[isEdit ? getIndexWithId(currentEdit) : linksArr.length] = {
    id: isEdit ? currentEdit : (linksArr[linksArr.length - 1]?.id || -1) + 1,
    url,
    text: textInput.value || new URL(url).host,
    time: timeInput.value,
    toOpen: toOpenInput.checked,
    toNotify: false,
    openIn: openInInput.value,
  };
  paintLinks();
  setInput();
}
// links
function paintLinks(newLinksArr) {
  if (newLinksArr) linksArr = newLinksArr;
  linksDiv.innerHTML = "";
  linksArr.forEach(createLink);
}
// Dom
function createLink({ id, url, text, time, toOpen, toNotify, openIn }) {
  const currentIndex = getIndexWithId(id);
  const linkDiv = create("div", linksDiv);
  const anchorDiv = create("div", linkDiv);
  const iconImg = create("img", anchorDiv, "Open In : " + openIn, () => {
    openLink(text, url, openIn);
  });
  create("a", anchorDiv, text || url, () => {
    openLink(text, url, "New Tab");
  });
  create("span", linkDiv, url, function () {
    navigator.clipboard
      .writeText(url)
      .then(() => (this.innerHTML = "Copied : " + url));
    setTimeout(() => (this.innerHTML = url), 2000);
  });
  create("span", linkDiv, time);
  iconImg.src = getIcon(url);
  anchorDiv.classList.add("anchorDiv");
  linkDiv.classList.add("link");
  function editLink() {
    showMenu(false);
    currentEdit = id;
    setInput(url, text, time, openIn, toOpen);
  }
  function deleteLink() {
    showMenu(false);
    paintLinks(linksArr.filter((e) => e.id !== id));
  }
  function shareLink() {
    showMenu(false);
    navigator.share({ text, title: text, url: url });
  }
  function copyLink() {
    showMenu(false);
    navigator.clipboard.writeText(url).then(() => (this.innerHTML = "Copied"));
    setTimeout(() => (this.innerHTML = "Copy"), 2000);
  }
  function handleToNotify() {
    linksArr[currentIndex].toNotify = this.checked;
    paintLinks();
  }
  function handleToOpen() {
    linksArr[currentIndex].toOpen = this.checked;
    paintLinks();
  }
  function handleOpenIn() {
    linksArr[currentIndex].openIn = this.value;
    paintLinks();
  }
  linkDiv.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    if (ctxMenu.style.display === "flex") {
      ctxMenu.style.display = "none";
      editBtn.removeEventListener("click", editLink);
      deleteBtn.removeEventListener("click", deleteLink);
      copyBtn.removeEventListener("click", copyLink);
      shareBtn.removeEventListener("click", shareLink);
      toNotifyLinkInput.removeEventListener("input", handleToNotify);
      toOpenLinkInput.removeEventListener("input", handleToOpen);
      openInLinkInput.removeEventListener("input", handleOpenIn);
    } else {
      ctxMenu.style.display = "flex";
      ctxMenu.style.top = e.pageY + "px";
      ctxMenu.style.left = e.pageX + "px";
      editBtn.addEventListener("click", editLink);
      deleteBtn.addEventListener("click", deleteLink);
      copyBtn.addEventListener("click", copyLink);
      shareBtn.addEventListener("click", shareLink);
      toNotifyLinkInput.addEventListener("input", handleToNotify);
      toOpenLinkInput.addEventListener("input", handleToOpen);
      openInLinkInput.addEventListener("input", handleOpenIn);
      toNotifyLinkInput.checked = toNotify;
      toOpenLinkInput.checked = toOpen;
      openInLinkInput.value = openIn;
    }
  });
}
function openLink(text, link, openIn = "", toNotify) {
  // openIn : Iframe, New Tab, New Window
  if (toNotify)
    Push.create(text, {
      body: link,
      icon: getIcon(link),
      timeout: 8000,
      onClick: function () {
        window.focus();
        this.close();
        openLink(text, link, openIn);
      },
    });
  else {
    if (openIn === "Iframe") openIframe();
    else if (openIn === "New Window")
      open(link, "blank", "height=570,width=520");
    else open(link, "blank");
  }
}
function openIframe(text, link) {
  if (iframeEl.src === link) return showIframe();
  iframeEl.src = link;
  showLinkText.innerHTML = text;
  showLinkText.title = link;
  const showTimeout = setTimeout(showIframe, 2000);
  closeBtn.addEventListener("click", () => {
    showIframe(false);
    clearTimeout(showTimeout);
  });
}
function showIframe(bool = true) {
  if (!wrapper.style.display === bool ? "block" : "none")
    wrapper.style.display = bool ? "block" : "none";
}
const pad = (n) => (n < 10 ? "0" + n : n);
function toNumber(t) {
  return `${pad(t.getHours())}:${pad(t.getMinutes())}`;
}
function lsItem(key, value) {
  if (value) localStorage.setItem(key, JSON.stringify(value));
  else {
    let temp = localStorage.getItem(key);
    if (temp) return JSON.parse(temp);
  }
}
function isUrl(str) {
  return !!new RegExp(
    "^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$",
    "i"
  ).test(str);
}
function setTimer() {
  setInterval(() => {
    linksArr.forEach((e) => {
      if (e.toOpen && !e.isOpened && toNumber(new Date()) === e.time) {
        openLink(e.text, e.url, e.openIn, e.toNotify);
        e.isOpened = true;
        setTimeout(() => {
          e.isOpened = false;
        }, 60000);
      }
    });
  }, 10000);
}
// javascript: linksArr = myLink
function getIcon(link) {
  if (link.includes("web.zoom.us")) link = "https://zoom.us";
  return `https://s2.googleusercontent.com/s2/favicons?domain_url=${link}`;
}
function getIndexWithId(id) {
  for (let i = 0; i < linksArr.length; i++) {
    if (linksArr[i].id === id) return i;
  }
}
function changeIndex(from, to) {
  linksArr.splice(to, 0, linksArr.splice(from, 1)[0]);
  paintLinks();
}
function create(tagName, appendTo, html, onclick) {
  const e = document.createElement(tagName);
  if (appendTo) appendTo.append(e);
  if (html) {
    e.innerHTML = html;
    e.title = html;
  }
  if (onclick) e.addEventListener("click", onclick);
  return e;
}
function setInput(
  url = "",
  text = "",
  time = "",
  openIn = "New Tab",
  toOpen = false
) {
  URLInput.value = url;
  textInput.value = text;
  timeInput.value = time;
  openInInput.value = openIn;
  toOpenInput.checked = toOpen;
}
function showMenu(bool = true) {
  ctxMenu.style.display = bool ? "flex" : "none";
}