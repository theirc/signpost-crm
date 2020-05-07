exports.handler = function(context, event, callback) {
  let phone = event.phone;
  token = context.ACCESS_TOKEN;
  sid = context.ACCOUNT_SID;
  const client = require('twilio')(sid, token);
  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.appendHeader('Content-Type', 'application/json');
  
  client.messages
      .list({
         from: 'whatsapp:+'+phone,
         limit: 200,
         order: 'desc'
       })
      .then(messagesFrom => 
            client.messages
            .list({
                to: 'whatsapp:+'+phone,
                limit: 200,
                order: 'desc'
            }).then(messagesTo => {
                response.setBody({result: getChat(messagesFrom, messagesTo)})
                callback(null, response )}
            )
      )
      
};

function getChat(from, to){
    let chat = [...from, ...to].sort(function(a,b){
        return new Date(a.dateCreated) - new Date(b.dateCreated);
    });
    chat = chat.slice(chat.length-50);
    chat = chat.map(c => { return {"date": c.dateCreated, "from": c.from, "to": c.to, "body": c.body}} )
    return chat;
     
}