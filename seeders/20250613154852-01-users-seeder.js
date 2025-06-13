'use strict';

const { v4: uuidv4 } = require('uuid'); // Untuk membuat ID unik
const bcrypt = require('bcrypt');     // Untuk enkripsi password. Pastikan sudah di-install.

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    // Siapkan password yang akan di-hash
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Siapkan data pengguna yang akan dimasukkan
    await queryInterface.bulkInsert('Users', [ // Pastikan nama tabel adalah 'Users'
      {
        id: uuidv4(),
        name: 'User Satu', // Menggunakan 'name' sesuai model
        email: 'user1@example.com',
        password: hashedPassword, // TAMBAHKAN KOLOM PASSWORD INI
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'User Dua', // Menggunakan 'name' sesuai model
        email: 'user2@example.com',
        password: hashedPassword, // TAMBAHKAN KOLOM PASSWORD INI
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};