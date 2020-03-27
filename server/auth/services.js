const User = require('./model');

exports.getUser = async (username) => {
    User.findOne({where: {username: username}, limit: 1})
    .then((user) => {
        return user;
    })
}