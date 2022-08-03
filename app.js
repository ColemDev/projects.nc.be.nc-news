const express = require("express");
const app = express();
const {
  getTopics,
  getArticleById,
} = require("./controllers/nc_news.controller");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.use("/*", (req, res) => {
  res.status(400).send({ msg: "route not found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    console.log(err, "app");
  }
});

module.exports = app;
