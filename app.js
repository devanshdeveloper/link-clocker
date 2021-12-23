const myLink = [
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
    isOpenIn: true,
  },
  {
    link: "https://us05web.zoom.us/j/86259438079?pwd=c2xZMDY3VTdDZFlBRzhaWTU3aFpoZz09",
    text: "Maths",
    time: "09:40",
    isOpenIn: true,
  },
  {
    link: "https://us04web.zoom.us/j/77295357372?pwd=MFVCcXpTUDlXSHpmYmNmSEtwWGdhZz09",
    text: "English",
    time: "10:20",
    isOpenIn: true,
  },
  {
    link: "https://us04web.zoom.us/j/71844310834?pwd=MCswUjRLZnhsTmdmOGJoQnFYRTN1QT09",
    text: "Economics",
    time: "11:00",
    isOpenIn: true,
  },
  {
    link: "https://zoom.us/j/4145799977?pwd=UFJMbHcyUVpjMEhjYW9iNzFWeXFtdz09",
    text: "Accounts",
    time: "11:40",
    isOpenIn: true,
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

function createLink({ id, link, text, time, isOpenIn }) {
  const linkDiv = createAndAppendTo("div", linksDiv);
  const anchorDiv = createAndAppendTo("div", linkDiv);
  const iconImg = createAndAppendTo("img", anchorDiv);
  const anchor = createAndAppendTo("a", anchorDiv, text || link);
  createAndAppendTo("span", linkDiv, link, function () {
    navigator.clipboard.writeText(link);
    this.innerHTML = `Copied`;
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
  });
  createAndAppendTo("button", btnDiv, "Delete", () =>
    paintLinks(linksArr.filter((e) => e.id !== id))
  );
  createAndAppendTo("button", btnDiv, "Share", () =>
    shareLink({ text: link, title: text, url: link })
  );
  const isOpenInEl = createAndAppendTo("input", btnDiv);
  isOpenInEl.type = "checkbox";
  isOpenInEl.classList.add("isOpenIn");
  isOpenInEl.checked = isOpenIn;
  isOpenInEl.addEventListener("change", () =>
    linksArr.forEach((e, i) => {
      if (e.id === id) linksArr[i].isOpenIn = isOpenInEl.checked;
    })
  );
  iconImg.src = getIcon(link);
  anchorDiv.classList.add("anchorDiv");
  anchor.href = link;
  anchor.target = "_blank";
  iconImg.addEventListener("click", () => openLink(text, link));
  linkDiv.classList.add("link");
}

function openLink(text, link, toNotify, isOpenIn) {
  if (document.visibilityState === "visible") openIframe(text, link);
  else if (isOpenIn) open(link, "_blank");
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

function updateLink(link, text, time, isOpenIn) {
  if (currentEdit === -1) {
    linksArr.push({
      id: (linksArr[linksArr.length - 1]?.id || -1) + 1,
      link,
      text: text || new URL(link).host,
      time,
      isOpenIn,
    });
    createLink(linksArr[linksArr.length - 1]);
  } else {
    linksArr.forEach((e, i) => {
      if (e.id === currentEdit)
        linksArr[i] = {
          id: e.id,
          link,
          text: text || new URL(link).host,
          time,
          isOpenIn,
        };
    });
    paintLinks();
    currentEdit = -1;
  }
  inputText.value = "";
  inputURL.value = "";
  inputTime.value = "";
  inputOpenIn.checked = false;
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
      inputOpenIn.checked
    );
  });
  closeBtn.addEventListener("click", () => (wrapper.style.display = "none"));
  addEventListener("beforeunload", () => lsItem("links", linksArr));
  addEventListener("keydown", (e) => {
    let num = parseInt(e.key);
    let l = linksArr[num - 1];
    if (e.altKey && !isNaN(num)) openLink(l.text, l.link, false, l.isOpenIn);
  });
  iframeEl.addEventListener("load", () => (wrapper.style.display = "block"));
  inputURL.addEventListener("focus", () => {
    navigator.clipboard
      .readText()
      .then((text) => isUrl(text) && (inputURL.value = text));
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

function isUrl(str) {
  let pattern = new RegExp(
    "^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$",
    "i"
  );
  return !!pattern.test(str);
}

function setTimer() {
  setInterval(() => {
    linksArr.forEach((e) => {
      if (toNumber(new Date()) === e.time && !e.isOpened) {
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
  if (html) e.innerHTML = html;
  if (appendTo) appendTo.append(e);
  if (onclick) e.addEventListener("click", onclick);
  return e;
}

// javascript: linksArr = myLink

function getIcon(link) {
  return `https://s2.googleusercontent.com/s2/favicons?domain_url=${link}`;
}

function shareLink(data) {
  navigator.canShare
    ? navigator.share(data).catch(console.log)
    : console.log("Your system doesn't support sharing files.");
}
