const express = require("express");
const cors = require("cors");
const app = express();
const {
  getApiEndpoints,
  getTopics,
  getArticleById,
  updateArticleVotes,
  getUsers,
  getArticles,
  getCommentsByArticleId,
  postCommentToArticle_id,
  deleteCommentById,
} = require("./controllers/nc-news.controller");

app.use(cors());

app.use(express.json()); //parse section

//CRUD

//R- ead aka GET
app.get("/api", getApiEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.get("/api/users", getUsers);

//C- reate aka POST
app.post("/api/articles/:article_id/comments", postCommentToArticle_id);

//U- pdate aka PATCH

app.patch("/api/articles/:article_id", updateArticleVotes);

//D- elete aka DELETE
app.delete("/api/comments/:comment_id", deleteCommentById);

//!!! ::caution:: keep the "use" blocks below the other endpoint calls to ensure all further console logs in the chain are functional

app.use("/*", (req, res) => {
  res.status(404).send({ msg: "route not found" });
});

app.use((err, req, res, next) => {
  if (err) {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else if (err.code === "22P02") {
      res
        .status(400)
        .send({ msg: "400 Bad Request: incorrect type: must be a number" });
    } else {
      console.log(err, "app: error handler reached");
    }
  }
});

module.exports = app;
