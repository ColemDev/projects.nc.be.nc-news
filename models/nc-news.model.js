const db = require("../db/connection");

//CRUD
//C- reate aka insert or CREATE
exports.insertCommentToArticle_id = (article_id, username, body) => {
  if (!username || !body) {
    return Promise.reject({
      status: 400,
      msg: `username and body are required`,
    });
  } else {
    return db
      .query(
        `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`,
        [article_id, username, body]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  }
};

//R- ead aka select [!NOTE] Refactor all "selectX" names in the execution chain from controller onwards change to "fetch" to avoid confusion since every sql request uses SELECT
exports.selectUsers = () => {
  return db.query(`SELECT * FROM users;`).then((data) => {
    return data.rows;
  });
};
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
exports.selectArticles = (sort_by, order, topic) => {
  let sortVar = "created_at";
  let orderVar = "DESC";
  let topicVar = "";
  if (
    sort_by &&
    (sort_by === "title" ||
      sort_by === "author" ||
      sort_by === "article_id" ||
      sort_by === "topic" ||
      sort_by === "created_at" ||
      sort_by === "votes")
  ) {
    sortVar = sort_by;
  } else if (sort_by) {
    return Promise.reject({
      status: 400,
      msg: `sort_by is not valid`,
    });
  }
  if (
    order &&
    (order === "desc" || order === "DESC" || order === "asc" || order === "ASC")
  ) {
    orderVar = order;
  } else if (order) {
    return Promise.reject({
      status: 400,
      msg: `order is not valid`,
    });
  }

  if (topic) {
    topicVar = `WHERE articles.topic = '${topic}'`;
  } else {
    topicVar = "";
  }

  return db
    .query(
      `
    SELECT articles.*,
    CAST (COUNT(comments.article_id) AS INT) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    ${topicVar}
    GROUP BY articles.article_id
    ORDER BY ${sortVar} ${orderVar};`
    )
    .then((data) => {
      if (data.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `topic does not exist`,
        });
      } else {
        return data.rows;
      }
    });
};
exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT comments.*, users.name AS author FROM comments 
      LEFT JOIN users ON users.username = comments.author 
      WHERE comments.article_id = $1;`,
      [article_id]
    )
    .then((data) => {
      if (data.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `article_id does not exist`,
        });
      }
      return data.rows;
    });
};

//U- pdate aka UPDATE
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

//D- elete aka DELETE or remove
exports.removeCommentById = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
      comment_id,
    ])
    .then(({ rows }) => {
      return rows[0];
    });
};
