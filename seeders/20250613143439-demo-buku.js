'use strict';

const { DataTypes } = require('sequelize'); // Diperlukan untuk UUIDV4 jika Anda ingin menghasilkan ID baru secara acak (opsional)
const { v4: uuidv4 } = require('uuid'); // Impor uuid untuk menghasilkan UUID

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Ambil beberapa ID pengguna yang sudah ada dari tabel Users
    // Ini adalah cara terbaik untuk memastikan foreign key valid
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM Users LIMIT 2;`, // Ambil 2 ID user pertama, sesuaikan jika perlu
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Pastikan ada pengguna yang ditemukan
    if (users.length === 0) {
      console.warn('Tidak ada pengguna ditemukan di tabel Users. Seeder buku mungkin gagal.');
      return; // Hentikan jika tidak ada user
    }

    const user1Id = users[0].id;
    const user2Id = users.length > 1 ? users[1].id : users[0].id; // Gunakan user pertama jika hanya ada 1

    await queryInterface.bulkInsert('bukus', [{ // Pastikan nama tabel di sini adalah 'bukus' (sesuai tableName di model)
      id: uuidv4(), // Generate UUID baru untuk buku ini
      nama_buku: 'Filosofi Teras',
      penulis_buku: 'Henry Manampiring',
      gambar: 'https://example.com/filosofi-teras.jpg', // Ganti dengan URL gambar asli jika ada
      userId: user1Id, // Gunakan ID user yang sudah ada
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: uuidv4(),
      nama_buku: 'Atomic Habits',
      penulis_buku: 'James Clear',
      gambar: 'https://example.com/atomic-habits.jpg',
      userId: user2Id,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: uuidv4(),
      nama_buku: 'Sapiens: A Brief History of Humankind',
      penulis_buku: 'Yuval Noah Harari',
      gambar: 'https://example.com/sapiens.jpg',
      userId: user1Id, // Bisa menggunakan ID user yang sama
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    // Menghapus data yang telah di-seed
    await queryInterface.bulkDelete('bukus', null, {});
  }
};