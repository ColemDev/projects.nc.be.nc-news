const db = require("../db/connection");
const articles = require("../db/data/test-data/articles");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((data) => {
    return data.rows;
  });
};
exports.selectArticleById = (selectedArticle_id) => {
  return db
    .query(
      `SELECT articles.*, CAST (COUNT(comments.article_id) AS INT)
        AS comment_count
      
        FROM articles
        
        LEFT JOIN comments 
        
        ON comments.article_id = articles.article_id
        WHERE articles.article_id = $1

        GROUP BY articles.article_id;`,
      [selectedArticle_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `id does not exist`,
        });
      }
      return rows[0];
    });
};
exports.updateTableVotes = (article_id, inc_votes) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `id does not exist`,
        });
      }
      return rows[0];
    });
};
exports.selectUsers = () => {
  return db.query(`SELECT * FROM users;`).then((data) => {
    return data.rows;
  });
};
