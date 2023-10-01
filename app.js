// app.js
const express = require("express");
const multer = require("multer");
const ExcelJS = require("exceljs");

const app = express();

// Setting up EJS as the templating engine
app.set("view engine", "ejs");

const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.render("upload");
});

app.post("/upload", upload.single("sampleFile"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(req.file.buffer);
  const tabName = req.body.tabName || workbook.worksheets[0].name;
  const worksheet = workbook.getWorksheet(tabName);

  if (!worksheet) {
    return res.status(400).send("Tab not found.");
  }

  const data = [];
  worksheet.eachRow((row, rowNumber) => {
    data.push(row.values);
  });

  console.log(data);

  res.send("Excel data logged to console.");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
