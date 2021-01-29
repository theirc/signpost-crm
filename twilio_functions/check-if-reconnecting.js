exports.handler = function(context, event, callback) {
  const client = require('twilio')(context.ACCOUNT_SID, context.ACCESS_TOKEN);
  client.messages
    .list({
        limit: 1,
        to: event.phone,
        order: 'desc'
      })
    .then(messages => {
      let msg = messages[0];
      let result = msg && msg.body.indexOf('Por favor responda este mensaje para chatear con un asistente') > -1 || msg.body.indexOf('Please reply this message to chat with an assistant') > -1 ? "flex" : "home";
      callback(null, {"result": result});
    }).catch((err) => callback(null, {"error": err}));

};
