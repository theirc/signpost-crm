//const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const services = require('./services');
const { getList, getCategoriesStats } = services;
const request = require('request');
const roles = require('../config/roles');
const Session = require('./model');
const Category = require('../categories/model');
require('dotenv').config();

//Session.belongsTo(Category);
Session.belongsToMany(Category, { through: 'Session_Categories' });
Category.belongsToMany(Session, { through: 'Session_Categories' });

exports.sessionsList = async (req, res, next) => {
    const { user } = req;
    const { phone } = req.query;
    let where = phone ? { phone: phone} : {};
    if (user && user.role == roles.MODERATOR){
        where.user = user.id;
    }
    Session.findAndCountAll({
        where: where,
        include: [
            {
                model: Category
            }
        ],
        order: [['createdAt', 'DESC']],
        limit: 20
    }).then(sessions => res.send(sessions))
    
  };

exports.getSession = async (req, res, next) =>{
    const { user } = req;
    
}

exports.newSession = async (req, res, next) => {
    const {user} = req;
    let catList = req.body.categories && req.body.categories.map(c => c.value)
    let session = Session.build({
        phone: req.body.phone,
        categories: req.body.categories,
        notes: req.body.notes,
        tags: req.body.tags,
        user: user.id,
        followUp: req.body.followUp
    })
    session.save()
    .then((session) => {
        session.save().then((session) =>{
            session.addCategory(catList);
            //Save again after add category to get the record updated before the stats lookup
            session.save().then(async (s) => {
                getCategoriesStats();
                res.send(s)
            })
            
        })
        .catch((err) => res.send(err));;
    }
    )
}

exports.sendMessage = async (req, res, next) => {
    // Send message and remove Follow-Up Flag
    const { id, phone } = req.body;
    
    let msg = '¡Hola! tenemos información relacionada a su consulta sobre CuentaNos. Por favor responda este mensaje para chatear con un asistente';
    const accountSid = process.env.TWILIO_SID;
    const authToken = process.env.TWILIO_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    client.messages.create({
        body: msg,
        from: 'whatsapp:+15184130994',
        to: `whatsapp:+${phone}`,
    }).then(m => {
        (async function UpdateFlag(){
            const result = await updateFlag(id, m.sid, m.status);
            res.json({status: m.status, sid: m.sid})
        })();
    }).catch((error) => {
        res.json(error);
    });
      
}

exports.sendMessageMessenger = async (req, res, next) => {
    // Send message and remove Follow-Up Flag
    const { id, phone, text } = req.body;
    console.log(id, phone, text);
    
    const accountSid = process.env.TWILIO_SID;
    const authToken = process.env.TWILIO_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    client.messages.create({
        body: text,
        from: 'Messenger:2039927102928299',
        to: `Messenger:${phone}`,
    }).then(m => {
        (async function UpdateFlag(){
            const result = await updateFlag(id, m.sid, m.status);
            res.json({status: m.status, sid: m.sid})
        })();
    }).catch((error) => {
        res.json(error);
    });
      
}

exports.checkStatus = async (req, res, next) => {
  const { sid, id } = req.body;
  const accountSid = process.env.TWILIO_SID;
  const authToken = process.env.TWILIO_TOKEN;
  const client = require('twilio')(accountSid, authToken);
  client.messages(sid).fetch().then(m => {
    Session.update(
        {
            messageStatus: m.status
        },
        { where: {id: id}}
    )
    res.json(m.status)
  }).catch((err) => 
    console.log(err)
  );
}

exports.isReconnecting = async (req, res, next) => {
    const { phone } = req.body;
    const isMessenger = phone.match(/\d{16}/) ? true : false;
    if (isMessenger){
        Session.findAll({
            limit :1,
            where: { phone: phone, followUpCompleted: false, messageSent: true },
            order: [ [ 'id', 'DESC' ]]
        }).then(async (sessions) => {
            if (sessions && sessions.length > 0) {
                let result = await sessions[0] && sessions[0].update(
                    { followUpCompleted : true }
                )
                res.send("flex") 
            }
            else{
                res.send("home") 
            }
        })
    }else{
        const accountSid = process.env.TWILIO_SID;
        const authToken = process.env.TWILIO_TOKEN;
        const client = require('twilio')(accountSid, authToken);
        client.messages
        .list({
            limit: 1,
            to: phone,
            order: 'desc'
        })
        .then(messages => {
            let msg = messages[0];
            let result = msg && msg.body.indexOf('Por favor responda este mensaje para chatear con un asistente') > -1 ? "flex" : "home";

            res.send(result);
        }).catch((err) => callback(null, {"error": err}));  
    }

}

//Remove Follow up flag
async function updateFlag(id, sid, status){
    const result = await Session.update(
        { 
          followUp: false,
          messageSent: true,
          messageSid: sid,
          messageStatus: status
        },
        { where: {id: id}}
    ).then(r => {
        return r;
    })
    .catch(function(err) {
        return err
    })
}

async function updateStatus(id, status){
    const result = await Session.update(
        {
            messageStatus: status
        },
        { where: {id: id}}
    )
}
