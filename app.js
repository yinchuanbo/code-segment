const fs = require("fs");
const path = require("path");
const marked = require("marked");

const mdDir = path.resolve(__dirname, "md");
const htmlDir = path.resolve(__dirname, "html");

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
        let title = "";
        let date = "";
        if (titleMatch && titleMatch[1]) {
          title = titleMatch[1];
        }
        if (dateMatch && dateMatch[1]) {
          date = dateMatch[1];
        }
        data = data.replace(/---[\s\S]*?---/, "");
        const htmlContent = marked.parse(data);
        const details = `<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Document</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/default.min.css">
                <link rel="stylesheet" type="text/css" href="./css/style.css" />
              </head>
              <body>
                <div class="container">
                  <div class="container-header">
                    <h2>${title}</h2>
                    <p>${getTime(date)} · YinHao</p>
                  </div>
                  ${htmlContent}
                </div>
              <script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js"></script>
              <script>hljs.highlightAll();</script>
              </body>
            </html>
            `;
        let filename = htmlFile.substring(htmlFile.lastIndexOf("\\") + 1);
        itemHtml += `<li><a href="/${filename}">${title}</a></li>`;
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
          <title>Document</title>
          <link rel="stylesheet" type="text/css" href="./css/home.css" />
        </head>
        <body>
          <div class="container">
            ${itemHtml}
          </div>
        </body>
      </html>
      `;
  fs.writeFileSync("./html/index.html", home);
});
