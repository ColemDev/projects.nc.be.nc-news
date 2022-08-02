const { selectTopics } = require("../models/nc-news.model.js");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      console.log(topics, "controller topics");
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};
