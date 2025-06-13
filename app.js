// app.js
require('dotenv').config(); // Pastikan ini di bagian paling atas
const express = require('express');
const { connectDB, sequelize } = require('./config/database');
const User = require('./models/User'); // Import model User
const Buku = require('./models/Buku'); // Import model Buku
const authRoutes = require('./routes/authRoutes');
const bukuRoutes = require('./routes/bukuRoutes');

// Menggunakan Multer untuk upload file (sesuai package.json)
// Hapus 'express-fileupload' dan ganti dengan 'multer'
// const fileUpload = require('express-fileupload'); // Hapus baris ini

const path = require('path');
const fs = require('fs'); // Untuk membuat direktori jika belum ada

const app = express();
const PORT = process.env.PORT || 5000;

// Hubungkan ke Database
connectDB();

// --- PENTING: HAPUS sequelize.sync() KARENA KITA MENGGUNAKAN MIGRASI ---
// sequelize.sync({ alter: true })
//     .then(() => {
//         console.log('Model disinkronkan dengan database.');
//     })
//     .catch((error) => {
//         console.error('Gagal sinkronisasi model:', error);
//     });
// --- AKHIR DARI BAGIAN YANG DIHAPUS ---

// Middleware
app.use(express.json()); // Body parser untuk JSON
app.use(express.urlencoded({ extended: true })); // Body parser untuk form data

// --- Multer tidak perlu diinisialisasi di sini sebagai middleware global
// --- karena akan digunakan langsung di route (bukuRoutes.js)
// app.use(fileUpload()); // Hapus baris ini karena kita menggunakan Multer

// Pastikan direktori public/uploads ada
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir)); // Sajikan file statis dari folder uploads

// Routes
app.use('/api/auth', authRoutes);
// Route buku sekarang akan mengelola Multer secara internal di bukuRoutes.js
app.use('/api/buku', bukuRoutes);

// Route Default
app.get('/', (req, res) => {
    res.send('API Buku berjalan!');
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
