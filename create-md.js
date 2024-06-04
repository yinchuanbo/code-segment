const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
try {
  userName = execSync("git config user.name", { encoding: "utf-8" }).trim();
} catch (err) {
  console.error("Error getting Git user name:", err);
}

function time() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");
  const timezoneOffset = currentDate.getTimezoneOffset();
  const timezoneHours = Math.abs(Math.floor(timezoneOffset / 60));
  const timezoneMinutes = Math.abs(timezoneOffset % 60);
  const timezoneSign = timezoneOffset < 0 ? "+" : "-";
  const isoDateString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${timezoneSign}${String(
    timezoneHours
  ).padStart(2, "0")}:${String(timezoneMinutes).padStart(2, "0")}`;
  return isoDateString;
}

const fileContent = `---
date: ${time()}
title: ""
---`;

function getFileCountByExtension(directory, extension) {
  return fs.readdirSync(directory).filter(file => path.extname(file) === extension).length;
}
const pagesDirectory = path.join(__dirname, "md");
const mdFileCount = getFileCountByExtension(pagesDirectory, ".md");

const timestamp = new Date().getTime();
const filePath = path.join(__dirname, "md", `${ mdFileCount + 1 < 10 ? "0" + (mdFileCount + 1) : mdFileCount + 1}.md`);

fs.writeFile(filePath, fileContent, (err) => {
  if (err) {
    console.error("Error creating file:", err);
  } else {
    console.log(`File ${filePath} created successfully.`);
  }
});
