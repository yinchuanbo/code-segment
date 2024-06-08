const fs = require("fs");
const path = require("path");
const marked = require("marked");
const ejs = require("ejs");
var sass = require("node-sass");

const mdDir = path.resolve(__dirname, "md");
const htmlDir = path.resolve(__dirname, "html");

const templateContent = fs.readFileSync("./templates/editor.html", "utf-8");

if (!fs.existsSync(htmlDir)) {
  fs.mkdirSync(htmlDir);
}

function getTime(dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDate;
}

let itemHtml = "<ul>";

fs.readdir(mdDir, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }
  files = files.reverse();
  files.forEach((file) => {
    if (file.endsWith(".md")) {
      const mdFile = path.resolve(mdDir, file);
      const htmlFile = path.resolve(htmlDir, file.replace(".md", ".html"));
      try {
        let data = fs.readFileSync(mdFile, "utf8");
        const titleMatch = data.match(/title: "(.*?)"/);
        const dateMatch = data.match(
          /date: (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2})/
        );
        const codeMatch = data.match(/code: "(.*?)"/);
        let title = "";
        let date = "";
        let code = "";
        if (titleMatch && titleMatch[1]) {
          title = titleMatch[1];
        }
        if (dateMatch && dateMatch[1]) {
          date = dateMatch[1];
        }
        if (codeMatch && codeMatch[1]) {
          code = codeMatch[1];
        }
        data = data.replace(/---[\s\S]*?---/, "");
        const htmlContent = marked.parse(data);
        let filename = htmlFile.substring(htmlFile.lastIndexOf("\\") + 1);
        let pageNum = filename.split(".");
        pageNum = Number(pageNum[0]);
        let preLink = "";
        let nextLink = "";
        if (pageNum === 1) {
          preLink = "style='opacity: 0.5;pointer-events: none'";
          nextLink = `onclick="location.href='/02.html'"`;
        } else if (pageNum === files.length) {
          let curNum = pageNum - 1;
          curNum = curNum < 10 ? "0" + curNum : curNum;
          preLink = `onclick="location.href='/${curNum}.html'"`;
          nextLink = "style='opacity: 0.5;pointer-events: none;'";
        } else {
          let curNum1 = pageNum - 1;
          let curNum2 = pageNum + 1;
          curNum1 = curNum1 < 10 ? "0" + curNum1 : curNum1;
          curNum2 = curNum2 < 10 ? "0" + curNum2 : curNum2;
          preLink = `onclick="location.href='/${curNum1}.html'"`;
          nextLink = `onclick="location.href='/${curNum2}.html'"`;
        }
        let details = `<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>${title}</title>
                <link rel=icon href="./imgs/code.svg" sizes=32x32>
                <link rel="stylesheet" href="./css/prism.css">
                <link rel="stylesheet" type="text/css" href="./css/style.css" />
              </head>
              <body>
                <div class="container">
                  <div class="container-header">
                    <h2>${title}</h2>
                    <p>${getTime(date)} · YinHao</p>
                  </div>
                  ${htmlContent}
                  <div class="nav">
                    <div class="nav-prev" ${preLink}>PREV</div>
                    <div class="nav-next" ${nextLink}>NEXT</div>
                  </div>
                  <div class="home" onclick="location.href='/'">HOME</div>
                </div>
                <script src="./js/prism.min.js"></script>
                <script src="./js/script.js"></script>
              </body>
            </html>
            `;
        if (code === "true") {
          marked.setOptions({
            highlight: function (code, lang) {
              return code;
            },
          });
          const tokens = marked.lexer(data);
          let jsContent = "";
          let cssContent = "";
          let htmlContent = "";
          tokens.forEach((token) => {
            if (token.type === "code") {
              if (token.lang === "js") {
                jsContent += token.text + "\n";
              } else if (token.lang === "css") {
                cssContent += token.text + "\n";
              } else if (token.lang === "html") {
                htmlContent += token.text + "\n";
              }
            }
          });
          let sassCss = cssContent;
          try {
            const sassRes = sass.renderSync({
              data: cssContent,
            });
            sassCss = sassRes.css.toString();
          } catch (error) {}
          const compiledIframeHtml = `<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>IFRAME</title>
                <link rel=icon href="../imgs/code.svg" sizes=32x32>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
                <link
                  rel="stylesheet"
                  href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
                />
                <script src="https://unpkg.com/pagedjs/dist/paged.legacy.polyfill.js"></script>
                <style>
                  * {
                    padding: 0;
                    margin: 0;
                    font-family: Montserrat;
                  }
                  html,
                  body {
                    height: 100%;
                  }
                  body {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  }
                  ::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                  }
                  ::-webkit-scrollbar-thumb {
                    border-radius: 0;
                    background: rgba(255, 255, 255, 0.4);
                  }
                  ::-webkit-scrollbar-track {
                    box-shadow: none;
                    border-radius: 0;
                    background: transparent;
                  }
                </style>
                <style id="live-preview-style">${sassCss || cssContent}</style>
              </head>
              <body>
                ${htmlContent}
                <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.js"></script>
                <script src="https://hammerjs.github.io/dist/hammer.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.0/anime.min.js"></script>
                <script id="script__preview">${jsContent}</script>
              </body>
            </html>
            `;
          let params = `doc-${file.split(".")[0]}`;
          fs.writeFileSync(
            `./html/iframes/${params}-iframe.html`,
            compiledIframeHtml
          );
          details = ejs.render(templateContent, {
            title: (title || "").trim(),
            cssContent: (cssContent || "").trim(),
            jsContent: (jsContent || "").trim(),
            htmlContent: (htmlContent || "").trim(),
            url: `./iframes/${params}-iframe.html`,
          });
        }
        itemHtml += `<li class="${ code === "true" ? 'preview_eye' : '' }"><a href="/${filename}">${title}</a></li>`;
        fs.writeFileSync(htmlFile, details);
        console.log(`${file} compiled successfully to ${htmlFile}`);
      } catch (err) {
        console.error(err);
      }
    }
  });
  itemHtml += `</ul>`;
  const home = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>code segment 有用的代码片段</title>
          <link rel=icon href="./imgs/code.svg" sizes=32x32>
          <link rel="stylesheet" type="text/css" href="./css/home.css" />
        </head>
        <body>
          <div class="toolbar">
          <svg onclick="window.open('/tools')" t="1717815163217" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9788" width="48" height="48"><path d="M640 631.467a8.533 8.533 0 0 0-8.533 8.533v213.333a8.533 8.533 0 0 0 8.533 8.534h213.333a8.533 8.533 0 0 0 8.534-8.534V640a8.533 8.533 0 0 0-8.534-8.533z m0-68.267h213.333a76.8 76.8 0 0 1 76.8 76.8v213.333a76.8 76.8 0 0 1-76.8 76.8H640a76.8 76.8 0 0 1-76.8-76.8V640a76.8 76.8 0 0 1 76.8-76.8z m0-401.067a8.533 8.533 0 0 0-8.533 8.534V384a8.533 8.533 0 0 0 8.533 8.533h213.333a8.533 8.533 0 0 0 8.534-8.533V170.667a8.533 8.533 0 0 0-8.534-8.534z m0-68.266h213.333a76.8 76.8 0 0 1 76.8 76.8V384a76.8 76.8 0 0 1-76.8 76.8H640a76.8 76.8 0 0 1-76.8-76.8V170.667a76.8 76.8 0 0 1 76.8-76.8z m-469.333 537.6a8.533 8.533 0 0 0-8.534 8.533v213.333a8.533 8.533 0 0 0 8.534 8.534H384a8.533 8.533 0 0 0 8.533-8.534V640a8.533 8.533 0 0 0-8.533-8.533z m0-68.267H384a76.8 76.8 0 0 1 76.8 76.8v213.333a76.8 76.8 0 0 1-76.8 76.8H170.667a76.8 76.8 0 0 1-76.8-76.8V640a76.8 76.8 0 0 1 76.8-76.8z m0-401.067a8.533 8.533 0 0 0-8.534 8.534V384a8.533 8.533 0 0 0 8.534 8.533H384a8.533 8.533 0 0 0 8.533-8.533V170.667a8.533 8.533 0 0 0-8.533-8.534z m0-68.266H384a76.8 76.8 0 0 1 76.8 76.8V384a76.8 76.8 0 0 1-76.8 76.8H170.667a76.8 76.8 0 0 1-76.8-76.8V170.667a76.8 76.8 0 0 1 76.8-76.8z" fill="#ffffff" p-id="9789"></path></svg>
          </div>
          <div class="container">
            ${itemHtml}
          </div>
        </body>
      </html>
      `;
  fs.writeFileSync("./html/index.html", home);
});
