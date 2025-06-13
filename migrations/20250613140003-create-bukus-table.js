'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fungsi 'up' dijalankan saat migrasi diterapkan
    await queryInterface.createTable('bukus', { // Nama tabel 'bukus' (jamak)
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      nama_buku: {
        type: Sequelize.STRING,
        allowNull: false
      },
      penulis_buku: {
        type: Sequelize.STRING,
        allowNull: false
      },
      gambar: {
        type: Sequelize.STRING,
        allowNull: true
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users', // Nama tabel yang direferensikan (penting: harus cocok dengan nama tabel di migrasi Users)
          key: 'id'
        },
        onUpdate: 'CASCADE', // Jika ID user di tabel Users berubah, update di sini
        onDelete: 'CASCADE'  // Jika user dihapus, hapus juga semua buku miliknya
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
    await queryInterface.dropTable('bukus');
  }
};