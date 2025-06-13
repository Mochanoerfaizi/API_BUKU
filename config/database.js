// config/database.js
const { Sequelize } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('./config')[env];

let sequelize;

if (config.use_env_variable) {
  // Pastikan process.env[config.use_env_variable] (yaitu process.env.DATABASE_URL) ada dan bertipe string
  if (!process.env[config.use_env_variable]) {
    console.error('Error: DATABASE_URL environment variable is not set for production environment.');
    process.exit(1); // Keluar dari aplikasi jika variabel penting tidak ada
  }
  sequelize = new Sequelize(process.env[config.use_env_variable], {
    dialect: config.dialect,
    dialectOptions: config.dialectOptions || {},
    logging: false, // Matikan logging SQL di production
  });
} else {
  // Untuk development lokal
  // Pastikan variabel lingkungan DB_USER, DB_PASSWORD, DB_NAME, DB_HOST terdefinisi di .env lokal
  if (!config.database || !config.username || !config.host) {
    console.error('Error: Database configuration (DB_NAME, DB_USER, DB_HOST) is incomplete for development.');
    process.exit(1);
  }
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    logging: false,
  });
}

// Definisikan fungsi connectDB di sini
async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('Koneksi database berhasil.');
    // Catatan: sequelize.sync() harus dilakukan dengan hati-hati.
    // Di production, gunakan migrasi (db:migrate).
    // Jika Anda masih ingin sync di development untuk testing cepat, bisa ditambahkan di sini:
    // await sequelize.sync({ force: false }); // force: true akan menghapus tabel setiap kali
    // console.log('Semua model disinkronkan!');
  } catch (error) {
    console.error('Koneksi database gagal:', error);
    // Penting: Melempar error agar aplikasi berhenti jika koneksi DB gagal
    throw error;
  }
}

module.exports = {
  sequelize,
  Sequelize,
  connectDB, // <--- BARIS PENTING INI HARUS ADA UNTUK MENGEKSPOR connectDB
};