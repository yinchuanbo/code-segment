const { exec } = require("child_process");

const remoteBranch = "origin/master";
const localBranch = "master";

exec(`git rev-parse ${localBranch}`, (err, localCommit) => {
  exec(`git rev-parse ${remoteBranch}`, (err, remoteCommit) => {
    if (localCommit.trim() === remoteCommit.trim()) {
      console.log("本地分支与远程分支的最新commit一致");
    } else {
      console.log("本地分支与远程分支的最新commit不一致");
    }
  });
});
