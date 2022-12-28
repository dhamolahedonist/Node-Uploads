const express = require("express");
const multer = require("multer");
const ejs = require("ejs");
const path = require("path");
const app = express();

// set storage engine
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function (req, file, callback) {
    callback(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// init upload variable
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, callback) {
    checkFileType(file, callback);
  },
}).single("myImage");

// checkFile type
function checkFileType(file, callback) {
  // Allowed extentions
  const fileTypes = /jpeg|jpg|png|gif/;
  // check ext
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  // check mime;
  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extname) {
    return callback(null, true);
  } else {
    callback("Error: Images only!");
  }
}

const PORT = process.env.process || 7000;

// Ejs
app.set("view engine", "ejs");

app.use(express.static("./public"));

app.get("/", (req, res) => res.render("index"));

app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.render("index", {
        msg: err,
      });
    } else {
      if (req.file == undefined) {
        res.render("index", {
          msg: "Error: No file selected!",
        });
      } else {
        res.render("index", {
          msg: "File Uploaded!",
          file: `uploads/${req.file.filename}`,
        });
      }
    }
  });
});

app.listen(PORT, console.log(`Server started on port ${PORT}`));
