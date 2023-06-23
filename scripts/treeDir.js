const fs = require("node:fs/promises");
const nodepath = require("node:path");

async function treeDir(path, depth = 0) {
  try {
    await fs.access(path, fs.constants.F_OK);
    const stat = await fs.stat(path);
    console.log(
      Array.from({ length: depth * 2 }, () => "-").join(""),
      nodepath.basename(path)
    );
    if (stat.isDirectory()) {
      const files = await fs.readdir(path);
      for (const file of files) {
        await treeDir(nodepath.join(path, file), depth + 1);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

treeDir(process.argv[2]);
