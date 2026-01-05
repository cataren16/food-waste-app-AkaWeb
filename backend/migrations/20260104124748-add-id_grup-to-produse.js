'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Produse', 'id_grup', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addIndex('Produse', ['id_grup']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Produse', ['id_grup']);
    await queryInterface.removeColumn('Produse', 'id_grup');
  }
};
