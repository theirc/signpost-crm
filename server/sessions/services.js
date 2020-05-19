const { GoogleSpreadsheet } = require('google-spreadsheet');

const db = require('../config/db');
const Sequelize = require('sequelize');

const pushToGSheet = async data => {
	// Auth
	const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);
	await doc.useServiceAccountAuth({
		client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
		private_key: process.env.GOOGLE_PRIVATE_KEY,
	});

	// Load data
	await doc.loadInfo();

	// Choose first sheet
	const sheet = doc.sheetsByIndex[0];

	// Clear old data
	await sheet.clear();

	// Set header+data
	await sheet.setHeaderRow(Object.keys(data[0]));
	await sheet.addRows(data);
}

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
		pushToGSheet(result);
		
    console.log("Result:", result);
  });
}
