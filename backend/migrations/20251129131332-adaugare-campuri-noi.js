'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Utilizatori.descriere
    const utilizatori = await queryInterface.describeTable('Utilizatori');
    if (!utilizatori.descriere) {
      await queryInterface.addColumn('Utilizatori', 'descriere', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }

    // Produse.categorie
    const produse = await queryInterface.describeTable('Produse');
    if (!produse.categorie) {
      await queryInterface.addColumn('Produse', 'categorie', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }

    // Solicitari.nr_bucati
    const solicitari = await queryInterface.describeTable('Solicitari');
    if (!solicitari.nr_bucati) {
      await queryInterface.addColumn('Solicitari', 'nr_bucati', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // down poate rămâne așa, dar recomand tot “safe”:
    const utilizatori = await queryInterface.describeTable('Utilizatori');
    if (utilizatori.descriere) await queryInterface.removeColumn('Utilizatori', 'descriere');

    const produse = await queryInterface.describeTable('Produse');
    if (produse.categorie) await queryInterface.removeColumn('Produse', 'categorie');

    const solicitari = await queryInterface.describeTable('Solicitari');
    if (solicitari.nr_bucati) await queryInterface.removeColumn('Solicitari', 'nr_bucati');
  }
};
