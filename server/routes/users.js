// #region requires
const { dir } = require("console");
const { json } = require("express");
var express = require("express");
var fs = require("fs/promises");
var router = express.Router();
var StringDecoder = require("string_decoder").StringDecoder;
var decoder = new StringDecoder("utf8");
var path = require("path");
var { constants } = require("fs");
// #endregion

//#region const varibles
const fileTypes = {
  txt: "Text File (.txt)",
  json: "JSON Source File (.json)",
  dir: "Files Directory",
};
//#endregion

/* GET. root url: /users/user */
router.get("/:user", async (req, res, next) => {
  const files = await fs.readdir(`users/${req.params.user}`);
  res.json(files);
});

// router.get("/user", async (req, res, next) => {
//   const files = await fs.readdir(`users/user`);
//   res.json(files);
// });

/* GET show functionallity. url: /users/user/*filename* */
router.get("/:user/:filename", async (req, res, next) => {
  const name = req.params.filename;
  const user = req.params.user;
  const filePath = `users/${user}/${name}`;
  const stat = await fs.lstat(filePath);

  if (stat.isFile())
    return res.sendFile(path.join(__dirname, `../${filePath}`));

  const files = await fs.readdir(filePath);
  res.json(files);

  // const data = await fs.readFile(
  //   `users/user/${req.params.filename}`,
  //   function (err, data) {
  //     if (err) throw err;
  //     return data;
  //   }
  // );
  // res.send(decoder.write(data));
});

/* GET info functionallity. url: /users/user/info/*filename* */
router.get("/:user/:filename/info", async (req, res, next) => {
  const name = req.params.filename;
  const user = req.params.user;
  const filePath = `users/${req.params.user}/${name}`;
  const cleanName = name.split(".")[0];
  const location = path.join(__dirname, `../${filePath}`);

  let type = fileTypes[name.split(".")[1]];
  let mtime = new Date(Date.now());
  let birthTime = new Date(Date.now());
  let info = {};

  //fetch file details
  try {
    const stats = await fs.stat(filePath);
    // print file last modified date
    mtime = stats.mtime;
    birthTime = stats.birthtime;

    if (stats.isDirectory()) {
      let count = await (await fs.readdir(filePath)).length;
      type = fileTypes["dir"];
      info["Number of files and directories"] = count;
    } else info.Size = stats.size;
  } catch (error) {
    console.log(error);
  }

  Object.assign(info, {
    Name: cleanName,
    Type: type,
    "Last Modified": mtime,
    Created: birthTime,
    Path: location,
  });
  res.json(info);
});

/* DELETE delete functionallity. url: /users/user/*filename* */
router.delete("/:user/:filename", async (req, res, next) => {
  const user = req.params.user;

  try {
    const filePath = `./users/${user}/${req.params.filename}`;
    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) await fs.rmdir(filePath, { recursive: true });
    else await fs.unlink(filePath);
  } catch (error) {
    console.error("there was an error:", error.message);
  }
  // res.redirect(200, "/users/user");
  const files = await fs.readdir(`users/${user}`);
  res.json(files);
});

/* PUT rename functionallity. url: /users/user/*filename* */
router.put("/:user/:filename", async (req, res, next) => {
  const user = req.params.user;
  const newNamePath = `users/${user}/${req.body.newName}`;
  const originalNamePath = `users/${user}/${req.params.filename}`;
  const stats = await fs.stat(originalNamePath);

  if (stats.isDirectory()) {
    await fs.cp(originalNamePath, newNamePath, {
      recursive: true,
    });
    await fs.rmdir(originalNamePath, {
      recursive: true,
    });
  } else await fs.rename(originalNamePath, newNamePath);
  const files = await fs.readdir(`users/${user}`);
  res.json(files);
});

/* POST copy functionallity. url: /users/user/*filename*
 if filename exist - copy operation
 else add new file */
router.post("/:user/:filename", async (req, res, next) => {
  const user = req.params.user;
  const filename = req.params.filename;
  const newNamePath = `users/${user}/${req.body.newName}`;
  const originalNamePath = `users/${user}/${filename}`;

  try {
    await fs.access(
      path.join(__dirname, `../${originalNamePath}`),
      constants.F_OK
    );

    const stats = await fs.stat(originalNamePath);
    if (stats.isDirectory()) {
      await fs.cp(originalNamePath, newNamePath, {
        recursive: true,
      });
    } else await fs.copyFile(originalNamePath, newNamePath);
  } catch (error) {
    if (filename.includes(".")) {
      const type = filename.split(".")[1];
      let fileContent;
      switch (type) {
        case "txt":
          fileContent = req.body.content;
          break;
        case "json":
          fileContent = JSON.stringify(req.body);
          break;
        default:
          console.log("unsupported file type.");
          break;
      }
      await fs.writeFile(originalNamePath, fileContent);
    } else await fs.mkdir(originalNamePath, { recursive: true });
  }

  const files = await fs.readdir(`users/${user}`);
  res.json(files);
});

module.exports = router;
