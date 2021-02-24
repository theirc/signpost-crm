exports.handler = function(context, event, callback) {
  let cat = event.category;
  let art = event.article;
  let couldParse = true;
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
                let id = c.items[0].fields.options[cat-1].fields.article_Detail[art-1].sys.id;
                client
                .getEntries({
                    "sys.id": id,
                    locale: 'es',
                })
                .then( a => {
                    entities = a;
                    try{
                       entities = client.parseEntries(a);            
                       r.entities = entities;
                    }catch(e){
                        couldParse = false;
                    }
                    
                    let country = 'el-salvador';
                    let entry = a.items[0];
                    let categorySlug = a && a.items && a.items[0] && a.items[0].fields && a.items[0].fields.category && a.items[0].fields.category.fields && a.items[0].fields.category.fields.slug;
                    
                    let category = categorySlug ? categorySlug : 'category';
                    let article = `Título: ${entry.fields.title}\n Detalle: ${entry.fields.content.substr(0,100)}...\n Link: http://www.cuentanos.org/${country}/${category}/${entry.fields.slug}`;
                    callback(null, article);
                   
                    
                })
                .catch(e => {
                    sendError(e)
                    callback(null, "Se ha producido un error al buscar el Artículo. Se ha informado al Administrador");
                })

            });
};


function sendError(error){
    const got = require('got');

    const requestBody = {
        personalizations: [{ to: [{ email: 'andresd.aguilar@gmail.com' }] }],
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