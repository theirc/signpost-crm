//const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const services = require('./services');
const { getList } = services;
const request = require('request');
const roles = require('../config/roles');
const Session = require('./model');
const Category = require('../categories/model');
require('dotenv').config();

Session.belongsTo(Category);
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
            {model: Category}
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
    Session.build({
        phone: req.body.phone,
        categoryId: req.body.category,
        notes: req.body.notes,
        tags: req.body.tags,
        user: user.id,
        followUp: req.body.followUp
    }).save();
    res.send(true);
}

exports.updateSession = async (req, res, next) =>{

}

exports.deleteSession = async (req, res, next) =>{

}

exports.sendMessage = async (req, res, next) => {
    // Send message and remove Follow-Up Flag
    const { id, phone } = req.body;
    
    let msg = '¡Hola! tenemos información relacionada a su consulta sobre Salud. Por favor responda este mensaje para chatear con un asistente';
    const accountSid = process.env.TWILIO_SID;
    const authToken = process.env.TWILIO_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    client.messages.create({
        body: msg,
        from: 'whatsapp:+15184130994',
        to: `whatsapp:+${phone}`,
    }).then(m => {
        updateFlag(id, m.sid, m.status)
        res.json({status: m.status, sid: m.sid})}
    ).catch((error) => {
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
    ).catch(function(err) {
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
