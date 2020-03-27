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

app.use(cors({"origin": process.env.FLEX_ORIGIN_HEADER}));
app.use(compress());
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'build'))); //  "public" off of current is root

app.use(express.static(__dirname+"/build"));
app.use(express.static('build'));


app.use(function(req, res, next) {
  //res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  res.header("Access-Control-Allow-Origin", process.env.FLEX_ORIGIN_HEADER); 
  next();
});

app.use('/api', routes);

app.use("/chatnumbers", getChatNumbers);

app.get('/api/ping', function (req, res) {
  console.log("pong");
  return res.send('pong'+process.env.API_URL+" "+process.env.JWT_SECRET); 
});


app.get('/', function (req, res) {
  console.log("*** / ***");
  res.header("Access-Control-Allow-Origin", process.env.FLEX_ORIGIN_HEADER); // update to match the domain you will make the request from
  res.header('Cache-Control', 'no-cache');
  res.sendFile(path.join(path.dirname(__dirname), 'build', 'index.html'));
});
app.get('*', function (req, res) {
  console.log("*** / ***");
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