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
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("route not found");
      });
  });
});
describe("GET /api/articles/:article_id", () => {
  it("should return an error 200 status and return an object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Object);
      });
  });
  it("the object returned should contain the following keys: title,topic, author, body, created_at, votes", () => {
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
      });
  });
  it("should when passed an incorrect id return a 404 error", () => {
    return request(app)
      .get("/api/articles/45")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article not found");
      });
  });
});
describe.only("PATCH /api/articles/:article_id", () => {
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
        console.log("newVote test", response.body);
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
        console.log("newVote test", response.body);
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
        console.log("newVote test", response.body);
        expect(response.body.article_id).toBe(6);
        expect(response.body.title).toBe("A");
        expect(response.body.topic).toBe("mitch");
        expect(response.body).toHaveProperty("author");
        expect(response.body.author).toBe("icellusedkars");
        expect(response.body).toHaveProperty("body");
        expect(response.body.body).toBe("Delicious tin of cat food");
        expect(response.body).toHaveProperty("created_at");
        //too complicated for me to set up a program to figure out the time stamp so I'm settling for it having the proberty right now.
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
        console.log(
          "newVote test unhappy path: wrong data type ",
          response.body.msg
        );
        expect(response.body.msg).toBe(
          "400 Bad Request: incorrect type: vote must be a number"
        );
      });
  });
});
