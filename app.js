const express = require("express");
const app = express();
const {
  getTopics,
  getArticleById,
  updateArticleVotes,
} = require("./controllers/nc_news.controller");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", updateArticleVotes);
//!keep the use blocks below the other endpoint calls to ensure all further console logs in the chain are functional!
app.use("/*", (req, res) => {
  res.status(400).send({ msg: "route not found" });
});
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res
      .status(400)
      .send({ msg: "400 Bad Request: incorrect type: vote must be a number" });
  } else {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else {
      console.log(err, "app");
    }
  }
});

module.exports = app;
