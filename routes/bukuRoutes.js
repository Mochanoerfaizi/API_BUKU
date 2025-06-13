// routes/bukuRoutes.js
const express = require('express');
const {
    getBukus,
    getBukuById,
    createBuku,
    updateBuku,
    deleteBuku
} = require('../controllers/bukuController');
const { protect } = require('../middleware/authMiddleware');

const multer = require('multer'); // Import multer
const path = require('path');
const fs = require('fs'); // Import fs untuk membuat direktori

const router = express.Router();

// --- Konfigurasi Multer untuk penyimpanan file gambar ---
const storage = multer.diskStorage({
    // Fungsi 'destination' menentukan folder tempat file akan disimpan
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../public/uploads');
        // Pastikan direktori 'public/uploads' ada. Jika belum, buatlah.
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath); // null untuk error (tidak ada error), uploadPath sebagai tujuan
    },
    // Fungsi 'filename' menentukan nama file yang akan disimpan
    filename: (req, file, cb) => {
        // Membuat nama file unik menggunakan timestamp dan angka acak
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Menggabungkan fieldname (nama input), uniqueSuffix, dan ekstensi asli file
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }); // Buat instance Multer dengan konfigurasi storage
// --- Akhir dari Konfigurasi Multer ---

router.route('/')
    .get(getBukus)
    // Untuk POST, tambahkan middleware 'upload.single('gambar')' sebelum createBuku
    // 'gambar' adalah nama field di form-data yang berisi file gambar
    .post(protect, upload.single('gambar'), createBuku); // Memerlukan otentikasi dan upload gambar

router.route('/:id')
    .get(getBukuById)
    // Untuk PUT, tambahkan middleware 'upload.single('gambar')' sebelum updateBuku
    .put(protect, upload.single('gambar'), updateBuku)   // Memerlukan otentikasi, kepemilikan, dan upload gambar
    .delete(protect, deleteBuku); // Memerlukan otentikasi dan kepemilikan

module.exports = router;