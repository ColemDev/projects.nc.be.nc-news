const db = require("../db/connection");

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
          msg: `article not found`,
        });
      } else {
        return article;
      }
    });
};
exports.updateTableVotes = (article_id, inc_votes) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      console.log("models votes rows", rows);
      return rows[0];
    });
};
