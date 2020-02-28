'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('sessions', 'messageSid', { type: Sequelize.STRING}, { transaction: t }),
        queryInterface.addColumn('sessions', 'messageStatus', { type: Sequelize.STRING}, { transaction: t}),
        queryInterface.renameColumn('sessions', 'followup', 'folloeUp', { transaction: t})
      ])
    })
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
