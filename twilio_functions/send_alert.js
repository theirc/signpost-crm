const got = require('got');

exports.handler = function(context, event, callback) {
    const accountSid = context.ACCOUNT_SID;
    const authToken = context.ACCESS_TOKEN;
    const phone = event.phone;
    
    let message = "📣Nuevo mensaje en Flex!";
    if (phone.indexOf("5493413523631") > -1 || phone.indexOf("2817027983 ") > -1 || phone.indexOf("6464770403  ") > -1 || phone.indexOf("13474193010  ") > -1){
        message = "Tienes un nuevo mensaje en Flex, por favor responda en la plataforma. Gracias";
    }
   
    const client = require('twilio')(accountSid, authToken);
   
    //Send SMS

    client.messages
      .create({
         body: message,
         from: 'whatsapp:+15184130994',
         to: 'whatsapp:+50360077806'
       })
    
    client.messages
      .create({
         body: message,
         from: 'whatsapp:+15184130994',
         to: 'whatsapp:+50372628694'
       })
      
    client.messages
      .create({
         body: message,
         from: 'whatsapp:+15184130994',
         to: 'whatsapp:+50379568852'
       })

    // Send EMAIL
    
    const requestBody = {
        personalizations: [{ to: [{ email: context.EMAIL_ADDRESS }] }],
        from: { email: 'noreply@signpost.ngo' },
        subject: message,
        content: [
              {
                type: 'text/plain',
                value: message
              }
          ]
    };

    got.post('https://api.sendgrid.com/v3/mail/send', {
        headers: {
          Authorization: `Bearer ${context.SENDGRID_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
    .then(response => {
      callback(null, "200");
    })
    .catch(err => {
         callback(null, err);
        }
    );


    requestBody.personalizations= [{ to: [{ email: 'info@signpost.com' }] }];
    got.post('https://api.sendgrid.com/v3/mail/send', {
        headers: {
          Authorization: `Bearer ${context.SENDGRID_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
    .then(response => {
      callback(null, "200");
    })
    .catch(err => {
         callback(null, err);
        }
    );
    
};

