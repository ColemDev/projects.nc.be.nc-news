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
      .expect(404)
      .then((response) => {
        console.log(response, "test");
        expect(response.body.msg).toBe("route not found");
      });
  });
});

//NOTES WITH KYLE - I'll insert this into my Workflow Template
//should recieve an article object 200
//object returned should contain the following properties
//get api/articles/:articleID , fetchArticleID
//controller fetchArticleID >>> grab he article ID froom the req url
//model selectArticleID db.query $1, [articleID] (this is the format)
//return rows
//back in controller >> return status code and the body
//back at test and checks status  and the expect checks.... conditions
//CONSOLE LOG where I am (where the log is coming from,), data form (what is the type of data (json, object, array, numbers etc), what does it read like, what structure does it have eg if object,what properties), what it looks like....(to string?) what's the response, what's the "data ID",
