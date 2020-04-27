const Notifications  = require('./model');

exports.getList = async (req, res, next) => {
  let list = await Notifications.findAll();
  res.send(list);
}
