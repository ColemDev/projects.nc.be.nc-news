const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  return db.end();
});

//C-reate aka POST
describe("POST /api/articles/:article_id/comments", () => {
  it("should accept an object in the form { username, body } and respond with an object", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a new comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Object);
      });
  });
  it("should return a 400 error if the username is not provided", () => {
    const newComment = {
      body: "This is a new comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("username and body are required");
      });
  });
  it("must respond with the posted comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a new comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body.body).toBe("This is a new comment");
      });
  });
});

//R-ead aka GET
describe("GET /api", () => {
  it.only("must respond with a JSON describing all the available endpoints on your API, and a status of 200", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body.endpoints).toHaveProperty("GET /api");
        expect(response.body.endpoints).toHaveProperty("GET /api/topics");
        expect(response.body.endpoints).toHaveProperty("GET /api/articles");
        expect(response.body.endpoints).toHaveProperty(
          "GET /api/articles/:article_id"
        );
        expect(response.body.endpoints).toHaveProperty(
          "GET /api/articles/:article_id/comments"
        );
        expect(response.body.endpoints).toHaveProperty("GET /api/users");
        expect(response.body.endpoints).toHaveProperty(
          "POST /api/articles/:article_id/comments"
        );
        expect(response.body.endpoints).toHaveProperty(
          "PATCH /api/articles/:article_id"
        );
        expect(response.body.endpoints).toHaveProperty(
          "DELETE /api/comments/:comment_id"
        );
      });
  });
});

describe("GET /api/articles", () => {
  it("should return return an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeArray();
        expect(response.body.articles[0]).toBeInstanceOf(Object);
      });
  });
  it("should be that each object in the array should contain the correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles[0]).toHaveProperty("article_id");
        expect(response.body.articles[0]).toHaveProperty("title");
        expect(response.body.articles[0]).toHaveProperty("topic");
        expect(response.body.articles[0]).toHaveProperty("author");
        expect(response.body.articles[0]).toHaveProperty("body");
        expect(response.body.articles[0]).toHaveProperty("created_at");
        expect(response.body.articles[0]).toHaveProperty("votes");
        expect(response.body.articles[0]).toHaveProperty("comment_count");
      });
  });
  it("must have each key in each object should contain the correct values", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles[0].author).toBe("icellusedkars");
        expect(response.body.articles[0].title).toBe(
          "Eight pug gifs that remind me of mitch"
        );
        expect(response.body.articles[0].topic).toBe("mitch");
        expect(response.body.articles[0].article_id).toBe(3);
        expect(response.body.articles[0].body).toBe("some gifs");
        expect(response.body.articles[0].votes).toBe(0);
        expect(response.body.articles[0].comment_count).toBe(2);
      });
  });
  it("Status 200, default sort & order: created_at, desc", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("title", {
          descending: true,
        });
      });
  });
  it(" Status 200, accepts sort_by query, e.g. ?sort_by=votes", () => {
    return request(app)
      .get("/api/articles/?sort_by=votes")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("votes", {
          descending: true,
        });
      });
  });
  it("Status 200, accepts sort_by query, e.g. ?sort_by=author", () => {
    return request(app)
      .get("/api/articles/?sort_by=author")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("author", {
          descending: true,
        });
      });
  });
  it(" Status 200, accepts order query, e.g. ?order=asc,", () => {
    return request(app)
      .get("/api/articles/?order=asc")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("created_at", {
          ascending: true,
        });
      });
  });
  it(" Status 200,  a topic, which filters the articles by the topic value specified in the query", () => {
    return request(app)
      .get("/api/articles/?topic=cats")
      .expect(200)
      .then((response) => {
        expect(
          response.body.articles[response.body.articles.length - 1].topic
        ).toBe("cats");
      });
  });
  it(" Status 400. invalid sort_by query, e.g. ?sort_by=bananas", () => {
    return request(app)
      .get("/api/articles/?sort_by=bananas")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("sort_by is not valid");
      });
  });
  it(" Status 400. invalid order query, e.g. ?order=bananas", () => {
    return request(app)
      .get("/api/articles/?order=bananas")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("order is not valid");
      });
  });
  it(" Status 404. non-existent topic query, e.g. ?topic=bananas", () => {
    return request(app)
      .get("/api/articles/?topic=bananas")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("topic does not exist");
      });
  });
});
describe("GET /api/articles/:article_id", () => {
  it("the object returned should contain the following keys: title,topic, author, body, created_at, votes. UPDATE: The object should now also have the property 'comment_count' which is the totally count of comments listed in the comments table that match the selected id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty("article_id");
        expect(response.body).toHaveProperty("title");
        expect(response.body).toHaveProperty("topic");
        expect(response.body).toHaveProperty("author");
        expect(response.body).toHaveProperty("body");
        expect(response.body).toHaveProperty("created_at");
        expect(response.body).toHaveProperty("votes");
        //UPDATE: Tests for new "comment_count" property to be found here.
        expect(response.body).toHaveProperty("comment_count");
        expect(response.body.comment_count).toBe(11);
      });
  });
  it("when an id does not have any comments the default is 0", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then((response) => {
        expect(response.body.article_id).toBe(2);
        expect(response.body.comment_count).toBe(0);
      });
  });
  it("should when passed an incorrect id return a 404 error", () => {
    return request(app)
      .get("/api/articles/45")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("id does not exist");
      });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  it("should return an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toBeInstanceOf(Array);
        expect(response.body.comments[0]).toBeInstanceOf(Object);
      });
  }),
    it("should return an error 404 if the article_id does not exist", () => {
      return request(app)
        .get("/api/articles/45/comments")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("article_id does not exist");
        });
    });
  it("should should have the following keys: comment_id, votes, created_at, author, body", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments[0]).toHaveProperty("comment_id");
        expect(response.body.comments[0]).toHaveProperty("votes");
        expect(response.body.comments[0]).toHaveProperty("created_at");
        expect(response.body.comments[0]).toHaveProperty("author");
        expect(response.body.comments[0]).toHaveProperty("body");
      });
  });
  it("must ensure that the authors property is the username from the users table", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments[0].author).toBe("jonny");
      });
  });
});
describe("GET /api/topics", () => {
  it("should return return an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics).toBeInstanceOf(Array);
        response.body.topics.forEach((topic) => {
          expect(topic.hasOwnProperty("slug")).toBe(true);
          expect(topic.hasOwnProperty("description")).toBe(true);
        });
      });
  });
});
describe("status 404 error - not found", () => {
  it("when passed an endpoint that doesnt exist, responds with a 404 error", () => {
    return request(app)
      .get("/api/not-a-path")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("route not found");
      });
  });
});
//U-pdate aka PATCH
describe("PATCH /api/articles/:article_id", () => {
  it("should accept an object in the form { inc_votes: >>insert newVote number here<< }and respond with an object", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/2")
      .send(newVote)
      .expect(200)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Object);
      });
  });
  it("if the inc_votes value is positive, it would increment the votes property by that much", () => {
    const newVote = { inc_votes: 4 };
    return request(app)
      .patch("/api/articles/4")
      .send(newVote)
      .expect(200)
      .then((response) => {
        expect(response.body.votes).toBe(4);
      });
  });
  it("if the inc_votes value is a negative number, it would decrement the votes property by that much", () => {
    const newVote = { inc_votes: -55 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(200)
      .then((response) => {
        expect(response.body.votes).toBe(45);
      });
  });
  it("should when passed the newVote, return the updated article", () => {
    const newVote = { inc_votes: 42 };
    return request(app)
      .patch("/api/articles/6")
      .send(newVote)
      .expect(200)
      .then((response) => {
        expect(response.body.article_id).toBe(6);
        expect(response.body.title).toBe("A");
        expect(response.body.topic).toBe("mitch");
        expect(response.body).toHaveProperty("author");
        expect(response.body.author).toBe("icellusedkars");
        expect(response.body).toHaveProperty("body");
        expect(response.body.body).toBe("Delicious tin of cat food");
        expect(response.body).toHaveProperty("created_at");
        expect(response.body.votes).toBe(42);
      });
  });
  it('should when passed a vote with the incorrect data type return a 400 bad request and the message "incorrect type: vote must be a number', () => {
    const newVote = { inc_votes: "seven eight nine" };
    return request(app)
      .patch("/api/articles/8")
      .send(newVote)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe(
          "400 Bad Request: incorrect type: must be a number"
        );
      });
  });
  it("should if passed a valid syntax of id that does not exist should return a 404", () => {
    const newVote = { inc_votes: 74 };
    return request(app)
      .patch("/api/articles/not-an-id")
      .send(newVote)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe(
          "400 Bad Request: incorrect type: must be a number"
        );
      });
  });
  it("should if passed an id that is not a valid number, return a 404 error", () => {
    const newVote = { inc_votes: 75 };
    return request(app)
      .patch("/api/articles/123456789")
      .send(newVote)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe(`id does not exist`);
      });
  });
  describe("GET users", () => {
    it("should respond with an array of objects and a 200 code", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          expect(response.body.users).toBeInstanceOf(Array);
          response.body.users.forEach((user) => {
            expect(user).toBeInstanceOf(Object);
          });
        });
    });
    it("each array should contain the properties of username, name, avatar_url", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          response.body.users.forEach((user) => {
            expect(user.hasOwnProperty("username")).toBe(true);
            expect(user.hasOwnProperty("name")).toBe(true);
            expect(user.hasOwnProperty("avatar_url")).toBe(true);
          });
        });
    });
  });
});
//D- elete
describe("DELETE /api/comments/:comment_id", () => {
  it("must respond with a status code of 204 and no content", () => {
    return request(app)
      .delete("/api/comments/7")
      .expect(204)
      .then((response) => {
        expect(response.body).toEqual({});
      });
  });
});
