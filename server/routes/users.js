// #region requires
const { dir } = require("console");
const { json } = require("express");
var express = require("express");
var fs = require("fs/promises");
var router = express.Router();
var StringDecoder = require("string_decoder").StringDecoder;
var decoder = new StringDecoder("utf8");
var path = require("path");
// #endregion

//#region const varibles
const fileTypes = {
  txt: "Text File (.txt)",
  json: "JSON Source File (.json)",
  dir: "Files Directory",
};
//#endregion

/* GET. root url: /users/joen */
router.get("/joen", async (req, res, next) => {
  const files = await fs.readdir("users/joen");
  res.json(files);
});

/* GET show functionallity. url: /users/joen/*filename* */
router.get("/joen/:filename", async (req, res, next) => {
  const name = req.params.filename;
  const stat = await fs.lstat(`users/joen/${name}`);

  if (stat.isFile())
    return res.sendFile(path.join(__dirname, `../users/joen/${name}`));

  const files = await fs.readdir(`users/joen/${name}`);
  res.json(files);
  // console.log(stat.isDirectory());
  // console.log(stat.isFile());
  // console.log(stat);

  // const data = await fs.readFile(
  //   `users/joen/${req.params.filename}`,
  //   function (err, data) {
  //     if (err) throw err;
  //     return data;
  //   }
  // );
  // res.send(decoder.write(data));
});

/* GET info functionallity. url: /users/joen/info/*filename* */
router.get("/joen/info/:filename", async (req, res, next) => {
  // console.log(req.params.filename);
  const name = req.params.filename;
  const cleanName = name.split(".")[0];
  const location = path.join(__dirname, `../users/joen/${name}`);

  let type = fileTypes[name.split(".")[1]];
  let mtime = new Date(Date.now());
  let birthTime = new Date(Date.now());
  let size = 0;
  let info = {};

  //fetch file details
  try {
    const stats = await fs.stat(`./users/joen/${name}`);
    // print file last modified date
    mtime = stats.mtime;
    birthTime = stats.birthtime;
    size = stats.size;

    if (stats.isDirectory()) {
      let count = await (await fs.readdir(`./users/joen/${name}`)).length;
      type = fileTypes["dir"];
      info.countFiles = count;
    }
  } catch (error) {
    console.log(error);
  }

  // const size = String(data.byteLength);
  Object.assign(info, { cleanName, type, size, mtime, birthTime, location });
  res.json(info);
});

/* DELETE delete functionallity. url: /users/joen/*filename* */
router.delete("/joen/:filename", async (req, res, next) => {
  try {
    const filePath = `./users/joen/${req.params.filename}`;
    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) await fs.rmdir(filePath, { recursive: true });
    else await fs.unlink(filePath);
  } catch (error) {
    console.error("there was an error:", error.message);
  }
  // console.log("jhbfsk");
  // res.redirect(200, "/users/joen");
  const files = await fs.readdir("users/joen");
  res.json(files);
});

/* PUT rename functionallity. url: /users/joen/*filename* */
router.put("/joen/:filename", async (req, res, next) => {
  const newName = req.body.newName;
  console.log(newName);
  const oldName = req.params.filename;
  await fs.rename(`users/joen/${oldName}`, `users/joen/${newName}`);
  const files = await fs.readdir("users/joen");
  res.json(files);
});

/* POST copy functionallity. url: /users/joen/*filename* */
router.post("/joen/:filename", async (req, res, next) => {
  const newName = req.body.newName;
  console.log(newName);
  const originalName = req.params.filename;
  // try {
  await fs.copyFile(`users/joen/${originalName}`, `users/joen/${newName}`);
  // } catch {
  //   console.log("The file could not be copied");
  // }
  const files = await fs.readdir("users/joen");
  res.json(files);
});

module.exports = router;
