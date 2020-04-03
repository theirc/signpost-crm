const jwt = require('jsonwebtoken');
const contentful = require('contentful');
const request = require('request');
const roles = require('../config/roles');
const Subscription  = require('./model');
const Notification  = require('../notifications/model');
require('dotenv').config();

exports.ping = (req, res, next) => {
    res.send("pong");
}
/*
Add a new inactive subscription into the Database. Send a verification code to phone number.
*/
exports.addSubscription = async (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    const { phone, categorySlug } = req.body;
    //Validate phone number 
    console.error("REQUEST:", phone, categorySlug);

    let validPhone = validatePhone(phone);
    //Verify there's no previous subscription
    let existing;
    try{
        existing = await Subscription.findAll({
            limit :1,
            where: { phone: validPhone, categorySlug: categorySlug},
            order: [ [ 'id', 'DESC' ]]})
    }catch(err){
        res.status(500).send(err);
    }
    
    
    existing = existing.length > 0 ? existing[0] : [];
    console.error("EXISTING:", existing)
    if (existing && existing.active){
        res.status(400).send("Already Exists");
    }else{
        let category = await getCategoryBySlug(categorySlug);
        let code = Math.floor(1000 + Math.random() * 9000);  //4 digit Verification code

        if (existing.length === 0){
            let subscription = Subscription.build({
                phone: validPhone,
                category: category.name,
                categoryId: category.id,
                categorySlug: categorySlug,
                code: code,
                active: false,
            })
            await subscription.save();
        }else{
            await Subscription.update(
                { 
                code: code,
                },
                { where: {id: existing.id}}
            )
            console.log("Already exist inactive")
        }
        try{
            sendCode(validPhone, code, category.name);
            res.status(200).send({code: code, message: "OK"});
        }catch(err){
            res.status(500).send(err);
        }
    }
    
    
    
};

/*
Send a whatsapp message using a template to verify the phone number
*/

exports.verifyCode = async (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    const { phone, code } = req.body;
    let validPhone = validatePhone(phone);
    let existingSubscription = await  Subscription.count({
        where: { phone: validPhone, code: code }
    })

    if (existingSubscription > 0){
        Subscription.update(
            {
                active: true
            },
            { where: {phone: validPhone, code :code}}
        )
        res.status(200);
        res.send("OK");
    }else{
        res.status(400);
        res.send("Invalid phone or code");
    }
}

exports.triggerNotifications = async (req, res, next) =>{
    res.header("Access-Control-Allow-Origin", "*");
    const { sys } = req.body;
    const{ id } = sys;
    let article = await getArticleCategorybyId(id);
    let category = await getCategoryById(article.categoryId);
    
    let subscriptions = await Subscription.findAll({
        where: { categoryId: category.id, active: true }
    });
    subscriptions.forEach( s => {
        sendNotification(s.phone, category.name);
        saveNotification(s.phone, id, category);
    })

    res.status(200).send(`${subscriptions.length} notifications sent`);
}

exports.lookUpNotifications = async(req, res, nect) => {
    res.header("Access-Control-Allow-Origin", "*");
    let { phone } = req.body;
    phone = phone.replace("whatsapp:+", "");
    console.error(phone);
    let result = await Notification.findAll({
        limit :1,
            where: { phone: phone, status: "sent"},
            order: [ [ 'id', 'DESC' ]]})
    if (result.length > 0){
        let articleId = result[0].articleId;
        let article = await getArticleById(articleId);
        console.log(article);
        let text = `*${article.title}*\n"${article.content.substr(0,200)}..."\nLink: https://cuentanos.org/${article.country}/${result[0].categorySlug}/${article.slug}`;
        res.status(200).send(text);
        Notification.update({
            status: "done",
            },
            {where: { id: result[0].id }}
        )
    }else{
        res.status(400).send("NO");
    }
}

const getArticleById = async (id) =>{
    const client =  contentful.createClient({
        space: "e17qk44d7f2w",
        accessToken: process.env.CONTENTFUL_KEY 
    })
    let entry = await client.getEntry(id);
    return {title: entry.fields.title, lead: entry.fields.lead, content: entry.fields.content, country: entry.fields.country.fields.slug, slug: entry.fields.slug};
}

const getCategoryById = async (id) => {
    const client =  contentful.createClient({
        space: "e17qk44d7f2w",
        accessToken: process.env.CONTENTFUL_KEY 
    })
    let entry = await client.getEntry(id);
    let result = {name: entry.fields.name, slug: entry.fields.slug, id: id}
    return result
    
}

const getCategoryBySlug = async (slug) => {
    const client =  contentful.createClient({
        space: "e17qk44d7f2w",
        accessToken: process.env.CONTENTFUL_KEY 
    })
    let entries = await client.getEntries({
                    content_type: "category",
                    "fields.slug": slug
                });
    let result = entries.items[0].fields;
    let category = {id: entries.items[0].sys.id, name: result.name, slug: slug}

    return category
}

const getArticleCategorybyId = async (articleId) => {
    const client =  contentful.createClient({
        space: "e17qk44d7f2w",
        accessToken: process.env.CONTENTFUL_KEY 
    })
    let entry = await client.getEntry(articleId);
    let result = {slug: entry.fields.slug, categoryId: entry.fields.category.sys.id}
    return result
}

const sendCode = (phone, code, category) => {

    //Send template with Code
    let msg = `Hemos recibido su solicitud para subscribirse a las notificaciones de la categoría _*${category}*_. Su código de confirmación es *${code}*.`;
    const accountSid = process.env.TWILIO_SID;
    const authToken = process.env.TWILIO_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    client.messages.create({
        body: msg,
        from: 'whatsapp:+15184130994',
        to: `whatsapp:${phone}`,
    })
}

const saveNotification = (phone, article, category) => {
    let notification = Notification.build({
        phone: phone,
        articleId: article,
        category: category.name,
        categoryId: category.id,
        categorySlug: category.slug,
        active: false,
        status: 'sent'
    })
    notification.save();
}

const sendNotification = (phone, category) => {
    let msg = `¡Hola! Tenemos nueva información sobre *${category}*. Envía la palabra "INFO" para recibir mas detalles.`;
    const accountSid = process.env.TWILIO_SID;
    const authToken = process.env.TWILIO_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    client.messages.create({
        body: msg,
        from: 'whatsapp:+15184130994',
        to: `whatsapp:${phone}`,
    })
}

const validatePhone = (phone) => {
    return phone.replace("+", "").replace("(" ,"").replace(")", "").replace(" ", "").replace("-", "");
}