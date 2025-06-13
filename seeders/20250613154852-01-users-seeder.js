'use strict';

const { v4: uuidv4 } = require('uuid'); // Untuk membuat ID unik
const bcrypt = require('bcrypt');     // Untuk enkripsi password

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Fungsi `up` akan dijalankan saat Anda menjalankan seeder
  async up (queryInterface, Sequelize) {
    
    // 1. Siapkan password yang akan di-hash
    const password = 'password123';
    const saltRounds = 10; // Tingkat kekuatan enkripsi
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 2. Siapkan data pengguna yang akan dimasukkan
    await queryInterface.bulkInsert('Users', [ // Pastikan nama tabel adalah 'Users'
      {
        id: uuidv4(),
        nama: 'User Satu',
        email: 'user1@example.com',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        nama: 'User Dua',
        email: 'user2@example.com',
        password: hashedPassword, // Bisa menggunakan password yang sama untuk data dummy
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  // Fungsi `down` akan dijalankan jika Anda perlu meng-undo seeder
  async down (queryInterface, Sequelize) {
    // Menghapus semua data dari tabel Users
    await queryInterface.bulkDelete('Users', null, {});
  }
};