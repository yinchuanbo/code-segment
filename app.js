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
  files.sort((a, b) => {
    let numA = parseInt(a);
    let numB = parseInt(b);
    return numA - numB;
  });
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
            <span id="article-num">${files.length}</span>
            <svg onclick="window.open('/tools')" t="1717851663896" class="icon" viewBox="0 0 1027 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="71155" width="30" height="30"><path d="M384.015754 105.487754a55.478745 55.478745 0 0 1 55.403126 55.403126v216.369625a55.453538 55.453538 0 0 1-55.403126 55.302301H167.646129a55.478745 55.478745 0 0 1-55.403126-55.403126v-216.2688a55.478745 55.478745 0 0 1 55.403126-55.403126H384.015754z m0-49.517489H167.646129a104.895409 104.895409 0 0 0-104.933218 104.933218v216.369625c0 57.885932 46.946462 104.832394 104.933218 104.832394H384.015754a104.895409 104.895409 0 0 0 104.933218-104.933219v-216.2688c-0.100825-57.986757-47.047286-104.933218-104.933218-104.933218M736.372578 110.579397a45.774375 45.774375 0 0 1 64.653785 0L927.258782 236.811815a45.774375 45.774375 0 0 1 0 64.653785L801.026363 427.710622a45.749169 45.749169 0 0 1-64.590769-0.063016L610.190572 301.415188a45.774375 45.774375 0 0 1 0-64.653785L736.372578 110.579397z m-28.898855-28.898855L581.228702 207.925563a86.520123 86.520123 0 0 0 0.063015 122.38848L707.536738 456.546462a86.557932 86.557932 0 0 0 122.451496 0l126.245021-126.245022a86.557932 86.557932 0 0 0 0-122.451495L829.975631 81.617526a86.658757 86.658757 0 0 0-122.501908 0.063016M384.015754 598.683963a55.314905 55.314905 0 0 1 55.302301 55.302302v216.369624a55.478745 55.478745 0 0 1-55.403126 55.403126h-216.2688a55.478745 55.478745 0 0 1-55.403126-55.403126V653.986265a55.478745 55.478745 0 0 1 55.403126-55.403127H384.015754v0.100825z m0-49.517489H167.646129c-57.986757 0-104.933218 46.946462-104.933218 104.832394V870.368492a104.895409 104.895409 0 0 0 104.933218 104.933219H384.015754a104.895409 104.895409 0 0 0 104.933218-104.933219V653.986265c-0.100825-57.873329-47.047286-104.819791-104.933218-104.819791M877.111138 598.683963a55.478745 55.478745 0 0 1 55.403127 55.403126v216.369625a55.478745 55.478745 0 0 1-55.403127 55.403126H660.741514a55.478745 55.478745 0 0 1-55.403126-55.403126V653.986265a55.453538 55.453538 0 0 1 55.403126-55.302302h216.369624z m0-49.517489H660.741514a104.8576 104.8576 0 0 0-104.832394 104.832394V870.368492a104.895409 104.895409 0 0 0 104.933218 104.933219h216.369625a104.895409 104.895409 0 0 0 104.933219-104.933219V653.986265a105.034043 105.034043 0 0 0-105.034044-104.819791" fill="#ffffff" p-id="71156"></path></svg>
          </div>
          <div class="container">
            ${itemHtml}
          </div>
        </body>
      </html>
      `;
  fs.writeFileSync("./html/index.html", home);
});
