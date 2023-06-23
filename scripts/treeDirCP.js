const childProcess = require("child_process");

childProcess.exec("ls -lR", (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});
