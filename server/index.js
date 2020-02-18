const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const compress = require("compression");
const cors = require("cors");
const helmet = require("helmet");
const twilio = require('twilio');
const jwt = require('jsonwebtoken');

const request = require('request');
const routes = require('./routes');

app.use(cors({"origin": "*"}));
app.use(compress());
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'build'))); //  "public" off of current is root

app.use(express.static(__dirname+"/build"));
app.use(express.static('build'));


app.use(function(req, res, next) {
  console.log("DEFAULT");
  //res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  res.header("Access-Control-Allow-Origin", "localhost"); 
  next();
});

app.use('/api', routes);

app.get('/api/ping', function (req, res) {
  console.log("pong");
 return res.send('pong'); 
});

// app.post('/api/login', function (req, res) {
//   //console.log(req);
//   //TO DO: validate user and password
//   res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//   res.header('Cache-Control', 'no-cache');
  
//   console.log(req.body.username, req.body.password);
//   if (validateUserAndPassword(req.body)){
//     var formData = { username: req.body.username, password: req.body.password};
//     request.post({url: 'https://auth.rescue.org/SimpleAuthenticationRESTService.aspx', formData: formData},
//       function(error, response, body){
//           if (!error && response.statusCode == 200){
//               res.send(true);
//           }
//       })
//   }else{
//     res.send({})
//   }
// })

app.use("/chatnumbers", getChatNumbers);

app.get('/', function (req, res) {
  console.log("*** / ***");
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header('Cache-Control', 'no-cache');
  res.sendFile(path.join(path.dirname(__dirname), 'build', 'index.html'));
});
app.get('*', function (req, res) {
  console.log("*** / ***");
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header('Cache-Control', 'no-cache');
  res.sendFile(path.join(path.dirname(__dirname), 'build', 'index.html'));
});

app.use("/", express.static("build"));




app.listen(process.env.PORT || 8080, () => { console.log("server ready listening on port 8080")});

const validateUserAndPassword= (body) => {
  if(body.username && body.password){
    mysql_pool.getConnection(function(err, connection) {
      if (err) {
        connection.release();
          console.log(' Error getting mysql_pool connection: ' + err);
          throw err;
        }
        connection.query('Select username, name, lastname, initials, country, role from users;', function(err2, rows, fields) {	
          if (err2) {
            var data = { "Time":"", "DatabaseStatus":"" };
            data["Time"] = (new Date()).getTime();
            data["DatabaseStatus"] = "Down";
            return data; 
          } else {
            var dbretval = rows[0].SettingValue;
            if (dbretval == 1 ) {
              var data = { "Time":"", "DatabaseStatus":"" };
              data["Time"] = (new Date()).getTime();
              data["DatabaseStatus"] = "Up";
              return data;
              res.json(data); 
            } else {
              var data = { "Time":"", "DatabaseStatus":"" };
              data["Time"] = (new Date()).getTime();
              data["DatabaseStatus"] = "Down";
              return data;
              res.json(data); 
            }
          }
        console.log(' mysql_pool.release()');
        connection.release();
        });
    });
  }else{
     return false;
  }

}


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
  console.log("GET Numbers");
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header('Cache-Control', 'no-cache');
  const sid = 'AC56ec5750accda2f3abe42a2b90a865ab';
  const token = '79de8d2ebdb61e6f3fe3c74b1d355c17';

  const client = require('twilio')(sid, token);
  let numbers = [];
  client.messages.list({
      dateSentAfter: new Date(Date.UTC(2020, 1, 1, 0, 0, 0)),
      from:'whatsapp:+15184130994',
  }).then(list => {
      console.log(list.length);
      //list.forEach(m => console.log(m.body.replace("\n", "").substr(0,30)))
      
      let chats = list.filter(m => m.body.toLowerCase().indexOf("pronto un asistente") > -1);
      //console.log(chats.length);
      chats.forEach(m => numbers.push(m.to));;
      let phoneNumbers = [...new Set(numbers)];
      res.json(phoneNumbers);
  })
}