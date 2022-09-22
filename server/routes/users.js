const { json } = require("express");
var express = require("express");
var fs = require("fs/promises");
var router = express.Router();
var StringDecoder = require("string_decoder").StringDecoder;
var decoder = new StringDecoder("utf8");
var path = require("path");

const fileTypes = {
  txt: "Text File (.txt)",
  json: "JSON Source File (.json)",
};
/* GET users listing. */
router.get("/joen", async (req, res, next) => {
  const files = await fs.readdir("users/joen");
  res.json(files);
});

router.get("/joen/:filename", async (req, res, next) => {
  res.sendFile(path.join(__dirname, `../users/joen/${req.params.filename}`));
  // const data = await fs.readFile(
  //   `users/joen/${req.params.filename}`,
  //   function (err, data) {
  //     if (err) throw err;
  //     return data;
  //   }
  // );
  // res.send(decoder.write(data));
});

router.get("/joen/info/:filename", async (req, res, next) => {
  // console.log(req.params.filename);
  const name = req.params.filename;
  const cleanName = name.split(".")[0];
  const type = fileTypes[name.split(".")[1]];
  let mtime = new Date(Date.now());
  let birthTime = new Date(Date.now());
  const data = await fs.readFile(`users/joen/${name}`, function (err, data) {
    if (err) throw err;
    return data;
  });

  //fetch file details
  try {
    const stats = await fs.stat(`./users/joen/${name}`);
    // print file last modified date
    mtime = stats.mtime;
    birthTime = stats.birthtime;
  } catch (error) {
    console.log(error);
  }

  const size = String(data.byteLength);
  const location = path.join(__dirname, `../users/joen/${name}`);
  const info = { cleanName, type, size, mtime, location, birthTime };
  res.json(info);
});

router.delete("/joen/:filename", async (req, res, next) => {
  try {
    await fs.unlink(`users/joen/${req.params.filename}`);
    console.log("successfully deleted /tmp/hello");
  } catch (error) {
    console.error("there was an error:", error.message);
  }
  // console.log("jhbfsk");
  // res.redirect(200, "/users/joen");
  const files = await fs.readdir("users/joen");
  res.json(files);
});

router.put("/joen/:filename", async (req, res, next) => {
  const newName = req.body.newName;
  console.log(newName);
  const oldName = req.params.filename;
  await fs.rename(`users/joen/${oldName}`, `users/joen/${newName}`);
  const files = await fs.readdir("users/joen");
  res.json(files);
});

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
