const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((data) => {
    return data.rows;
  });
};
/*
// in model.js
const selectPets = ({ species }) => {
    // getting the pets from the db here
   if (!pets.length) {
    await checkExists('species', 'species_name', species); // We, the devs, pass in the table and column name
   }
};*/
//consider this as another more updated pattern to add to the models functions for SELECT type functions
