const fs = require("fs");
const path = require("path");
const marked = require("marked");
const ejs = require("ejs");
var sass = require("node-sass");

// const args = process.argv.slice(2);

// console.log('args', args)

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

function getTime2(dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const formattedDate = `${day}/${month}/${year}`;
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
  files.forEach((file, _idx) => {
    if (file.endsWith(".md")) {
      const mdFile = path.resolve(mdDir, file);
      const htmlFile = path.resolve(htmlDir, file.replace(".md", ".html"));
      let params = `doc-${file.split(".")[0]}`;
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
                    <span onclick="location.href='/'"></span>
                    <h2>${title}</h2>
                    <p>${getTime(date)} · YinHao</p>
                  </div>
                  <div class="container-main">${htmlContent}</div>
                  <div class="nav">
                    <div class="nav-prev" ${preLink}>← Prev</div>
                    <div class="nav-next" ${nextLink}>→ Next</div>
                  </div>
                  <div class="home" onclick="location.href='/'">
                    <svg t="1720872401065" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17881" width="200" height="200"><path d="M134.528 307.072l18.218667 26.282667-18.218667-26.282667zM407.04 117.888l-18.218667-26.282667 18.218667 26.282667z m209.834667 0l18.218666-26.282667-18.218666 26.282667z m272.554666 189.184l-18.218666 26.282667 18.218666-26.282667zM120.32 479.786667l-22.101333 23.125333 22.101333-23.125333z m783.36 0l-22.101333-23.168 22.101333 23.168zM426.666667 736a32 32 0 0 0 0 64v-64z m170.666666 64a32 32 0 0 0 0-64v64z m93.013334 106.666667H333.653333v64h356.693334v-64zM152.746667 333.354667L425.386667 144.213333l-36.48-52.565333-272.64 189.184 36.522666 52.565333zM598.656 144.213333l272.597333 189.184 36.48-52.565333-272.597333-189.184-36.48 52.565333z m238.08 416.170667v208.128h64v-208.128h-64zM187.264 768.469333v-208.128h-64v208.128h64z m0-208.128a143.36 143.36 0 0 0-44.885333-103.68l-44.16 46.250667c16.213333 15.488 25.045333 36.181333 25.045333 57.429333h64z m694.314667-103.68a143.36 143.36 0 0 0-44.842667 103.68h64c0-21.248 8.832-41.941333 25.045333-57.429333l-44.202666-46.293333zM425.386667 144.128a153.301333 153.301333 0 0 1 173.312 0l36.48-52.565333a217.301333 217.301333 0 0 0-246.272 0l36.48 52.565333zM333.610667 906.666667c-82.218667 0-146.346667-63.274667-146.346667-138.24h-64c0 113.066667 95.616 202.24 210.346667 202.24v-64z m356.736 64c114.773333 0 210.346667-89.173333 210.346666-202.24h-64c0 74.965333-64.085333 138.24-146.346666 138.24v64z m180.906666-637.312c42.922667 29.781333 47.36 87.936 10.325334 123.306666l44.202666 46.250667c66.730667-63.658667 57.685333-169.557333-18.048-222.122667l-36.48 52.565334zM116.266667 280.789333C40.533333 333.354667 31.488 439.253333 98.218667 502.912l44.16-46.293333c-36.992-35.328-32.554667-93.44 10.368-123.264l-36.48-52.565334zM426.666667 800h170.666666v-64h-170.666666v64z" p-id="17882" fill="#ffffff"></path></svg>
                  </div>
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
        const curUrl = `./iframes/${params}-iframe.html`;
        const htmlP = `<div class="preview__click" data-url="${curUrl}" title="点击查看效果"></div>`
        itemHtml += `<li class="${ code === "true" ? 'preview_eye' : '' }">
           <a href="/${filename}">${title}</a>
           ${ code === "true" ? htmlP : '' }
           <p>${getTime2(date)}</p>
        </li>`;
        fs.writeFileSync(htmlFile, details);
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
          <div class="header-top">
            <div class="header-top-item" onclick="window.open('/tools')">TOOLS</div>
          </div>
          <div class="container">
            ${itemHtml}
          </div>
          <script src="./js/home.js"></script>
        </body>
      </html>
      `;
  fs.writeFileSync("./html/index.html", home);
});
