const express = require("express");
const { scrapeLogic } = require("./scrapeLogic");
const bodyParser = require('body-parser');
const app = express();

const PORT = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get("/scrape", (req, res) => {
  scrapeLogic(req,res);
});

app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
