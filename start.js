var liveServer = require("live-server");
const fs = require("fs");
const { exec } = require("child_process");

var params = {
  port: 3333,
  host: "0.0.0.0",
  root: "./html",
  open: true,
  file: "index.html",
};

liveServer.start(params);

const directoryToWatch = "./md"; // 监听的目录路径
const commandToExecute = "node app.js"; // 要执行的命令

// 监听目录变化
fs.watch(directoryToWatch, (eventType, filename) => {
  if (filename && filename.endsWith(".md")) {
    console.log(
      `File ${filename} changed. Executing command: ${commandToExecute}`
    );

    // 执行命令
    exec(commandToExecute, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Command stderr: ${stderr}`);
        return;
      }
      console.log(`Command stdout: ${stdout}`);
    });
  }
});

console.log(`Watching directory ${directoryToWatch} for changes...`);
