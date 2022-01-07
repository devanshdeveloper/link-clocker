const myLink = [
  {
    link: "https://www.google.com/",
    text: "Google",
    time: "",
    toOpen: true,
    isOpenIn: true,
  },
  {
    link: "http://youtube.com/",
    text: "YouTube",
    time: "",
    toOpen: true,
    isOpenIn: true,
  },
  {
    link: "https://us04web.zoom.us/j/71844310834?pwd=MCswUjRLZnhsTmdmOGJoQnFYRTN1QT09",
    text: "Econmics",
    time: "09:10",
    toOpen: true,
    isOpenIn: false,
  },
  {
    link: "https://us05web.zoom.us/j/85988493170?pwd=c1BvQVloRkZoYmFyUVFDRE5VS3pPdz09",
    text: "Maths",
    time: "09:45",
    toOpen: true,
    isOpenIn: false,
  },
  {
    link: "https://us04web.zoom.us/j/77295357372?pwd=MFVCcXpTUDlXSHpmYmNmSEtwWGdhZz09",
    text: "English",
    time: "10:20",
    toOpen: true,
    isOpenIn: false,
  },
  {
    link: "https://zoom.us/j/4145799977?pwd=UFJMbHcyUVpjMEhjYW9iNzFWeXFtdz09",
    text: "Accounts",
    time: "10:55",
    toOpen: true,
    isOpenIn: false,
  },
  {
    link: "https://us05web.zoom.us/j/9766781918?pwd=Qzc3L0ZDUnIxTmVocStzay9zSll2Zz09",
    text: "Business Studies",
    time: "11:50",
    toOpen: true,
    isOpenIn: false,
  },
];
let currentEdit = -1;
let linksArr = lsItem("links") || [];
linksArr.forEach((e, i) => {
  e.id = i;
  e.isOpened = false;
});
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
const inputToOpen = document.getElementById("inputToOpen");
function createLink({ id, link, text, time, isOpenIn, toOpen }) {
  const currentIndex = getIndexWithId(id);
  const linkDiv = createAndAppendTo("div", linksDiv);
  const anchorDiv = createAndAppendTo("div", linkDiv);
  const iconImg = createAndAppendTo("img", anchorDiv);
  const anchor = createAndAppendTo("a", anchorDiv, text || link);
  createAndAppendTo("span", linkDiv, link, function () {
    navigator.clipboard.writeText(link);
    this.innerHTML = `Copied : ${link}`;
    setTimeout(() => (this.innerHTML = link), 5000);
  });
  createAndAppendTo("span", linkDiv, time);
  const btnDiv = createAndAppendTo("div", linkDiv);
  createAndAppendTo("button", btnDiv, "Edit", () => {
    currentEdit = id;
    inputText.value = text;
    inputURL.value = link;
    inputTime.value = time;
    inputOpenIn.checked = isOpenIn;
    inputToOpen.checked = toOpen;
  });
  createAndAppendTo("button", btnDiv, "Delete", () =>
    paintLinks(linksArr.filter((e) => e.id !== id))
  );
  navigator.share &&
    createAndAppendTo("button", btnDiv, "Share", () =>
      navigator.share({ text, title: text, url: link })
    );
  if (time) {
    createCheckbox(isOpenIn, "isOpenIn", btnDiv, currentIndex);
    createCheckbox(toOpen, "toOpen", btnDiv, currentIndex);
  } else {
    linksArr[currentIndex].isOpenIn = true;
    linksArr[currentIndex].toOpen = false;
  }
  iconImg.src = getIcon(link);
  anchorDiv.classList.add("anchorDiv");
  anchor.href = link;
  anchor.target = "blank";
  iconImg.addEventListener("click", () => openLink(text, link));
  linkDiv.classList.add("link");
}

function openLink(text, link, toNotify, isOpenIn) {
  if (document.visibilityState === "visible") openIframe(text, link);
  else if (isOpenIn) open(link, "blank");
  else {
    if (toNotify)
      Push.create(text, {
        body: link,
        icon: getIcon(link),
        timeout: 8000,
        onClick: function () {
          window.focus();
          this.close();
          openIframe(text, link);
        },
      });
    else openIframe(text, link);
  }
}
function openIframe(text, link) {
  if (iframeEl.src === link) return (wrapper.style.display = "block");
  iframeEl.src = link;
  showLinkText.innerHTML = text;
}
function paintLinks(newLinksArr) {
  if (newLinksArr) linksArr = newLinksArr;
  linksDiv.innerHTML = "";
  linksArr.forEach(createLink);
}
function updateLink(link, text, time, isOpenIn, toOpen) {
  if (!isUrl(link)) return alert("invalid url");
  const isEdit = !!~currentEdit;
  linksArr[isEdit ? getIndexWithId(currentEdit) : linksArr.length] = {
    id: isEdit ? currentEdit : (linksArr[linksArr.length - 1]?.id || -1) + 1,
    link,
    text: text || new URL(link).host,
    time,
    toOpen,
    isOpenIn,
  };
  paintLinks();
  currentEdit = -1;
  inputText.value = "";
  inputURL.value = "";
  inputTime.value = "";
  inputOpenIn.checked = false;
  inputToOpen.checked = true;
}

addEventListener("DOMContentLoaded", () => {
  setTimer();
  paintLinks();
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    updateLink(
      inputURL.value,
      inputText.value,
      inputTime.value,
      inputOpenIn.checked,
      inputToOpen.checked
    );
  });
  closeBtn.addEventListener("click", () => (wrapper.style.display = "none"));
  addEventListener("beforeunload", () => lsItem("links", linksArr));
  addEventListener("keydown", (e) => {
    let num = parseInt(e.key);
    let l = linksArr[num - 1];
    if (!e.altKey) return;
    if (!isNaN(num)) openLink(l.text, l.link, false, l.isOpenIn);
  });
  iframeEl.addEventListener("load", () => (wrapper.style.display = "block"));
  iframeEl.addEventListener("error", () => (iframeEl.src += " "));
  inputURL.addEventListener("focus", () => {
    navigator.clipboard
      .readText()
      .then((text) => isUrl(text) && (inputURL.value = text));
  });
});

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
        openLink(e.text, e.link, true, e.isOpenIn);
        e.isOpened = true;
        setTimeout(() => {
          e.isOpened = false;
        }, 60000);
      }
    });
  }, 10000);
}
function createAndAppendTo(tagName, appendTo, html, onclick) {
  const e = document.createElement(tagName);
  if (appendTo) {
    appendTo.append(e);
    if (html) {
      e.innerHTML = html;
      e.title = html;
      if (onclick) e.addEventListener("click", onclick);
    }
  }
  return e;
}
// javascript: linksArr = myLink
function getIcon(link) {
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
function createCheckbox(isChecked, prop, appendTo, currentIndex) {
  const checkbox = createAndAppendTo("input", appendTo);
  checkbox.type = "checkbox";
  checkbox.checked = isChecked;
  checkbox.classList.add("isOpenIn");
  checkbox.addEventListener("input", () => {
    linksArr[currentIndex][prop] = checkbox.checked;
    console.log(linksArr);
  });
  checkbox.title = prop;
}
