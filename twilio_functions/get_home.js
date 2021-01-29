exports.handler = function(context, event, callback) {
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
      callback(null, c.items[0].fields.initial_message.trim());

  })
  .catch(e => {
      callback(null, { error:e });
  });

};
