'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fungsi 'up' dijalankan saat migrasi diterapkan
    await queryInterface.createTable('Users', { // Nama tabel 'Users' (jamak)
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      googleId: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      profilePic: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Fungsi 'down' dijalankan saat migrasi di-rollback
    await queryInterface.dropTable('Users');
  }
};
