-- CRUD SQL HTTP
-- Create INSERT POST
-- Read SELECT GET
-- Update UPDATE PUT / PATCH
-- Delete DELETE DELETE

-- Useful for naming conventions

// note to self, do not put patch below .use for some reason it prevented the controller from returning console logs so it must be a break point in the script this is probably true of any methods I'm not "using" lets put them above the use blocks.

UPDATE table
SET column value to equal new value matching position on external array
WHERE row contents matches the value of external array

"UPDATE articles
SET votes = votes + $1 WHERE article_id = $2 RETURNING \*;",
[inc_votes, article_id]

potential
// it("should when passed an empty object return a 400 bad request malformed body/missing fields", () => {
// const newVote = {};
// return request(app)
// .patch("/api/articles/7")
// .send(newVote)
// .expect(400)
// .then((response) => {
// console.log(
// "newVote test unhappy path empty object",
// response.body.msg
// );
// expect(response.body.msg).toBe(
// "400 Bad Request: malformed body / missing required fields"
// );
// });
// });

I may do that in a moment. When I get to adjusting the article id to include the aggregate count count from the comments table.

//app

//controller

//model
