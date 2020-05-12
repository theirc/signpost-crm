const db = require('../config/db');
const Sequelize = require('sequelize');


exports.getCategoriesStats = async () =>{
  const query = "select catlist.name, count(catlist.name) as total from (select distinct C.name, S.phone from categories as C \
    left join session_categories as SC on SC.CategoryId = C.id \
    left join sessions as S on S.id = SC.SessionId \
    where SC.SessionId is not null) as catlist \
    group by name;"
  db.sequelize.query(query, { type: Sequelize.QueryTypes.SELECT })
  .then(result =>  {
    /// Insert stats into Spreadsheet
    // Result: [ { name: 'zzzz' , total: 999}, ... ]
    console.log("Result:", result);
  });
}