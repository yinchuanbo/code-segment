const tabs = document.querySelectorAll(".home_tabs__item");
const contents = document.querySelectorAll(".home_content__item");

function clear() {
  for (let i = 0; i < tabs.length; i++) {
    const tab = tabs[i];
    tab.classList.remove("active");
  }
  for (let i = 0; i < contents.length; i++) {
    const content = contents[i];
    content.classList.remove("active");
  }
}

for (let i = 0; i < tabs.length; i++) {
  const tab = tabs[i];
  tab.onclick = () => {
    clear();
    tab.classList.add("active");
    contents[i].classList.add("active");
  };
}

let editorHTML,
  editorCSS,
  editorJS,
  iframeDocument,
  iframeWrapper,
  styleContent,
  scriptContent,
  livePreviewBtn = document.querySelector("#live-preview");

const htmlcode = document.getElementById("htmlcode");
const csscode = document.getElementById("csscode");
const jscode = document.getElementById("jscode");

// require.config({
//   paths: { vs: "https://unpkg.com/monaco-editor@^0.21.2/min/vs" },
// });

// window.MonacoEnvironment = { getWorkerUrl: () => proxy };

function vsCodeObj(value = "", language = "") {
  return {
    value,
    language,
    automaticLayout: true,
    theme: "vs-dark",
    fontSize: 17,
    fontFamily: "hack, Fira Code, SF Mono",
    scrollbar: {
      vertical: "hidden",
      horizontal: "hidden",
    },
    lineNumbers: true,
    lineHeight: 30,
  };
}

function loadCode() {
  let html = editorHTML.getValue();
  let css = editorCSS.getValue();
  let js = editorJS.getValue();
  if (html) {
    iframeWrapper.innerHTML = html;
  }
  if (css) {
    Sass.compile(css, function (result) {
      if (result.status === 0) {
        styleContent.innerHTML = result.text;
      } else {
        styleContent.innerHTML = css;
      }
    });
  }
  if (js) {
    scriptContent.innerHTML = js;
  }
}

let jsTimer = null;

document.addEventListener("DOMContentLoaded", () => {
  livePreviewBtn.onload = () => {
    iframeDocument =
      livePreviewBtn.contentDocument || livePreviewBtn.contentWindow.document;
    iframeWrapper = iframeDocument.getElementById("iframe__wrapper");
    styleContent = iframeDocument.getElementById("live-preview-style");
    scriptContent = iframeDocument.getElementById("script__preview");
    require.config({
      paths: {
        vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.26.0/min/vs",
      },
    });
    require(["vs/editor/editor.main"], function () {
      editorHTML = monaco.editor.create(
        htmlcode,
        vsCodeObj(
          document.getElementById("htmlcode-ta").innerText.trim(),
          "html"
        )
      );
      editorCSS = monaco.editor.create(
        csscode,
        vsCodeObj(
          document.getElementById("csscode-ta").innerText.trim(),
          "scss"
        )
      );
      editorJS = monaco.editor.create(
        jscode,
        vsCodeObj(
          document.getElementById("jscode-ta").innerText.trim(),
          "javascript"
        )
      );
      editorHTML.onDidChangeModelContent(function () {
        var body = iframeDocument.querySelector("body");
        while (body.firstChild) {
          if (body.firstChild.tagName !== "SCRIPT") {
            body.removeChild(body.firstChild);
          } else {
            break;
          }
        }
        body.insertAdjacentHTML("afterbegin", editorHTML.getValue());
      });
      editorCSS.onDidChangeModelContent(function () {
        let val = editorCSS.getValue();
        Sass.compile(val, function (result) {
          if (result.status === 0) {
            styleContent.innerHTML = result.text;
          } else {
            styleContent.innerHTML = val;
          }
          //   iframeDocument.location.reload();
        });
      });
      editorJS.onDidChangeModelContent(function () {
        clearTimeout(jsTimer);
        jsTimer = null;
        jsTimer = setTimeout(() => {
          //   scriptContent.innerHTML = editorJS.getValue();
          const scriptPreview =
            iframeDocument.querySelector("#script__preview");
          if (scriptPreview) {
            scriptPreview.remove();
          }
          scriptContent = document.createElement("script");
          scriptContent.id = "script__preview";
          scriptContent.textContent = editorJS.getValue();
          iframeDocument.querySelector("body").appendChild(scriptContent);
        }, 3000);
      });
    });
  };
});
