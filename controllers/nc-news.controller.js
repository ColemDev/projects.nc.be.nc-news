const {
  selectTopics,
  selectArticleById,
  updateTableVotes,
  selectUsers,
  selectArticles,
  selectCommentsByArticleId,
  insertCommentToArticle_id,
  removeCommentById,
} = require("../models/nc-news.model.js");
const endpoints = require("../endpoints.json");

//CRUD
//C-reate aka POST
exports.postCommentToArticle_id = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  insertCommentToArticle_id(article_id, username, body)
    .then((comment) => {
      res.status(201).send(comment);
    })
    .catch((err) => {
      next(err);
    });
};
//R- ead aka GET
exports.getApiEndpoints = (req, res, next) => {
  res.status(200).send({ endpoints });
};

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  selectArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
};
exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};
//U- pdate aka PATCH
exports.updateArticleVotes = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;

  updateTableVotes(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(200).send(updatedArticle);
    })
    .catch((err) => {
      next(err);
    });
};
//D- elete aka DELETE
exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then((comment) => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
