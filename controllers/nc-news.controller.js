const {
  selectTopics,
  selectArticleById,
  updateTableVotes,
} = require("../models/nc-news.model.js");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
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
exports.updateArticleVotes = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;

  updateTableVotes(article_id, inc_votes)
    .then((upDatedArticle) => {
      res.status(200).send(upDatedArticle);
    })
    .catch((err) => {
      next(err);
    });
};
