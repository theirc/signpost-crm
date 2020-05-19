const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const compress = require("compression");
const cors = require("cors");
const helmet = require("helmet");
const twilio = require('twilio');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const request = require('request');
const routes = require('./routes');

//app.use(cors({"origin": process.env.FLEX_ORIGIN_HEADER}));
app.use(compress());
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'build'))); //  "public" off of current is root

app.use(express.static(__dirname+"/build"));
app.use(express.static('build'));


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  //res.header("Access-Control-Allow-Origin", process.env.FLEX_ORIGIN_HEADER); 
  next();
});

app.use('/api', routes);

app.use("/chatnumbers", getChatNumbers);

// init cron job, check out https://crontab.guru/#*/15_*_*_*_*
initCronJob();

app.get('/api/ping', function (req, res) {
  return res.send('pong'); 
});


app.get('/', function (req, res) {
  res.header("Access-Control-Allow-Origin", process.env.FLEX_ORIGIN_HEADER); // update to match the domain you will make the request from
  res.header('Cache-Control', 'no-cache');
  res.sendFile(path.join(path.dirname(__dirname), 'build', 'index.html'));
});
app.get('*', function (req, res) {
  res.header("Access-Control-Allow-Origin", process.env.FLEX_ORIGIN_HEADER); // update to match the domain you will make the request from
  res.header('Cache-Control', 'no-cache');
  res.sendFile(path.join(path.dirname(__dirname), 'build', 'index.html'));
});

app.use("/", express.static("build"));

app.listen(process.env.PORT || 8080, () => { console.log("server ready listening on port 8080")});


function verifyToken(req, res, next){
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined'){
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      //Set the token
      req.token = bearerToken;
      next();
  }else{
      res.sendStatus(403);
  }
}

function initCronJob() {
	var CronJob = require('cron').CronJob;
	var job = new CronJob('*/1 * * * *', getMessages);
	job.start();
};


const getMessages = async () => {
  console.log("Get messages");
  var currentDate = new Date();
  var rangeDate = new Date();
  rangeDate.setHours(currentDate.getHours() - 2);
  console.log(currentDate, rangeDate);
  let received, sent
  try{
    received = await client.messages.list({
      dateSentAfter: rangeDate,
      to:'whatsapp:+15184130994',
    })
  }catch(err){ console.log(err) }

  if (received && received.length > 0){
    try{
      sent = await client.messages.list({
        dateSentAfter: rangeDate,
        from:'whatsapp:+15184130994',
      })
    }catch(err){ console.log(err) }

    let unanswered = [];

    received && received.forEach(r => {
      let phone = r.from;
      let time = r.dateSent;
      var dif = moment.utc(moment(currentDate,"DD/MM/YYYY HH:mm:ss").diff(moment(time,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss");
      let duration = moment.duration(dif).asHours();
      if (duration > 1){
        let replies = sent.filter(s => s.to == phone && s.dateSent > time);
        if (replies.length == 0){
          
          unanswered[phone] = time;
          
        }
      }
    })
    console.log(unanswered);
    sendAlert(unanswered);
  }
}

const sendAlert =  async (unanswered) => {
  const got = require('got');

  let message = "‼️ Hay mensajes sin responder en Twilio ‼️";
  let body = "Mensajes sin responder en Twilio: \n";
  Object.keys(unanswered).forEach( i => {
    let number = "***"+i.substr(i.length-4, i.length);
    body+="Número: "+number+" ("+unanswered[i]+")\n";
    console.log(unanswered[i], i, body);
  })
  const requestBody = {
    personalizations: [{ to: [{ email: 'andresd.aguilar@gmail.com' }] }],
    from: { email: 'noreply@signpost.ngo' },
    subject: message,
    content: [
          {
            type: 'text/plain',
            value: body
          }
      ]
  };

  got.post('https://api.sendgrid.com/v3/mail/send', {
      headers: {
        Authorization: `Bearer ${process.env.SENDGRID_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
  .then(response => {
    return response
  })
  .catch(err => {
      console.log(err);
      return null
      }
  );
}


function getChatNumbers(req, res){
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header('Cache-Control', 'no-cache');
  const sid = process.env.TWILIO_SID;
  const token = process.env.TWILIO_TOKEN;

  const client = require('twilio')(sid, token);
  let numbers = [];
  client.messages.list({
      dateSentAfter: new Date(Date.UTC(2020, 1, 1, 0, 0, 0)),
      from:'whatsapp:+15184130994',
  }).then(list => {
      //list.forEach(m => console.log(m.body.replace("\n", "").substr(0,30)))
      
      let chats = list.filter(m => m.body.toLowerCase().indexOf("pronto un asistente") > -1);
      chats.forEach(m => numbers.push(m.to));;
      let phoneNumbers = [...new Set(numbers)];
      res.json(phoneNumbers);
  })
}
