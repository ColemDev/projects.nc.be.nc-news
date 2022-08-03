const express = require("express");
const app = express();
const { getTopics } = require("./controllers/nc_news.controller");

app.use(express.json());

app.get("/api/topics", getTopics);

app.use("/*", (req, res) => {
  res.status(404).send({ msg: "route not found" });
});

app.use((err, req, res, next) => {
  console.log(err, "app.use error");
});
module.exports = app;
