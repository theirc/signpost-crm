const { GoogleSpreadsheet } = require('google-spreadsheet');

const db = require('../config/db');
const Sequelize = require('sequelize');
require('dotenv').config();

const pushToGSheet = async data => {
	// Auth
	console.log('Account: ', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);

	const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);
	await doc.useServiceAccountAuth({
		client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
		private_key: process.env.GOOGLE_PRIVATE_KEY,
	});

	// Load data
	await doc.loadInfo();

	// Choose first sheet
	const sheet = doc.sheetsByIndex[process.env.GOOGLE_SPREADSHEET_TAB];

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
  .then(async result =>  {
    /// Insert stats into Spreadsheet
		// Result: [ { name: 'zzzz' , total: 999}, ... ]
		
		await pushToGSheet(result);
  });
}

exports.analytics = function(categories) {
	const ua = require('universal-analytics');
	let visitor = ua(process.env.GA_KEY, 'visitor', {strictCidFormat: false});
	
  categories.forEach(c => {
		var params = {
			ec: c.label,
			ea: 'New',
		}
		
		visitor.event(params, function (err) {
				if(err) {
						console.log(err);
						return false
				}
				return true
		});
	})
	
};

exports.getLogs = async (phone) => {
	const isMessenger = phone.match(/\d{16}/) ? true : false;
	let number = isMessenger ? 'Messenger:'+phone : 'whatsapp:+'+phone;
	
  token = process.env.TWILIO_TOKEN;
  sid = process.env.TWILIO_SID;
  
	let result = await Promise.all([getLog(number, "inbound"), getLog(number, "outbound")])
	let logs = getChat(result[0], result[1]);
	return logs;

}

const getLog = async (number, direction) => {
	token = process.env.TWILIO_TOKEN;
  sid = process.env.TWILIO_SID;
	const client = require('twilio')(sid, token);
	if (direction === "inbound"){
		return client.messages.list({
			from: number,
			limi: 200,
			order: 'desc'
		})
	}else{
		return client.messages.list({
			to: number,
			limi: 200,
			order: 'desc'
		})
	}
}


function getChat(from, to){
	let chat = [...from, ...to].sort(function(a,b){
			return new Date(a.dateCreated) - new Date(b.dateCreated);
	});
	if (chat.length > 100){
		chat = chat.slice(chat.length-50);
	}	
	chat = chat.map(c => { return {"date": c.dateCreated, "from": c.from, "to": c.to, "body": c.body}} )
	return chat;
	 
}