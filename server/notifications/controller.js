const Notifications  = require('./model');

exports.getList = async (req, res, next) => {
  let list = await Notifications.findAll({order: [['createdAt', 'DESC']]});
  res.send(list);
}
