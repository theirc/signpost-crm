const Notifications  = require('./model');

exports.getList = async (req, res, next) => {
  let list = Notifications.findAll();
  res.send(list);
}
