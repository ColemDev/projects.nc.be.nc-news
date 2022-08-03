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
        expect(response.body.msg).toBe(
          "article doesn't exist yet for article_id: 45"
        );
      });
  });
});
