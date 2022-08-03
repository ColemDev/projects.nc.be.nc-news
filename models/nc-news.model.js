const db = require("../db/connection");
const { articleData } = require("../db/data/test-data");

exports.selectTopics = (endpointRequest) => {
  return db.query(`SELECT * FROM topics;`).then((data) => {
    return data.rows;
  });
};
exports.selectArticleById = (selectedArticle_id) => {
  return db
    .query(`SELECT *FROM articles WHERE article_id = $1;`, [selectedArticle_id])
    .then(({ rows }) => {
      const article = rows[0];
      if (article === undefined) {
        return Promise.reject({
          status: 404,
          msg: `article doesn't exist yet for article_id: ${selectedArticle_id}`,
        });
      } else {
        return article;
      }
    });
};
