exports.handler = function(context, event, callback) {
  let cat = parseInt(event.category)-1;
  const contentful = require("contentful");
  const client = contentful.createClient({
    space: "e17qk44d7f2w",
    accessToken: context.CONTENTFUL_TOKEN
  });
  client
  .getEntries({
                content_type: "phoneTreeMessage",
                "fields.slug": 'el-salvador-twilio-home',
                locale: 'es',
            })
            .then(c => {
                callback(null, c.items[0].fields.options[cat].fields.option1);

            })
            .catch(e => {

                callback(null, "Se ha producido un error al recuperar la lista de artículos y se ha reportado al Administrador");
            });

};


function sendError(error){
    const got = require('got');

    const requestBody = {
        personalizations: [{ to: [{ email: 'leonardo.garcia@rescue.org' }] }],
        from: { email: 'noreply@signpost.ngo' },
        subject: 'ERROR EN GET ARTICLES: '+error,
        content: [
              {
                type: 'text/plain',
                value: 'ERROR EN GET ARTICLES: '+error
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
}