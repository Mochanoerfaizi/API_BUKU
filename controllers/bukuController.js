const Buku = require('../models/Buku');
const path = require('path');
const fs = require('fs');

// Fungsi generateUniqueFilename tidak lagi diperlukan di sini
// karena Multer akan menangani penamaan file melalui konfigurasi storage di routes/bukuRoutes.js
// const generateUniqueFilename = (filename) => {
//     const ext = path.extname(filename);
//     const name = path.basename(filename, ext);
//     return `${name}-${Date.now()}${ext}`;
// };

// @desc    Get all buku
// @route   GET /api/buku
// @access  Public (bisa diubah menjadi private jika diinginkan)
exports.getBukus = async (req, res) => {
    try {
        const bukus = await Buku.findAll();
        res.status(200).json(bukus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single buku
// @route   GET /api/buku/:id
// @access  Public (bisa diubah menjadi private jika diinginkan)
exports.getBukuById = async (req, res) => {
    try {
        const buku = await Buku.findByPk(req.params.id);
        if (!buku) {
            return res.status(404).json({ message: 'Buku tidak ditemukan' });
        }
        res.status(200).json(buku);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new buku
// @route   POST /api/buku
// @access  Private (hanya user yang terautentikasi)
exports.createBuku = async (req, res) => {
    const { nama_buku, penulis_buku } = req.body;
    const userId = req.user.id; // Diambil dari token JWT

    // Multer akan melampirkan file yang diunggah ke req.file
    if (!req.file) { // Cek req.file, bukan req.files
        return res.status(400).json({ message: 'Tidak ada file gambar yang diunggah.' });
    }

    // path gambar akan diambil langsung dari req.file.filename yang dibuat oleh Multer
    const gambarPath = `/uploads/${req.file.filename}`;

    try {
        // Direktori uploads sudah dipastikan ada di app.js atau routes/bukuRoutes.js (di Multer)
        // Jadi, fs.existsSync dan fs.mkdirSync tidak diperlukan di sini

        // Multer sudah memindahkan file, tidak perlu gambarFile.mv(uploadPath);

        const buku = await Buku.create({
            nama_buku,
            penulis_buku,
            gambar: gambarPath, // Simpan path relatif di database
            userId
        });
        res.status(201).json(buku);
    } catch (error) {
        console.error('Error saat membuat buku:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update buku
// @route   PUT /api/buku/:id
// @access  Private (hanya user yang terautentikasi dan pemilik buku)
exports.updateBuku = async (req, res) => {
    const { nama_buku, penulis_buku } = req.body;
    const userId = req.user.id;

    try {
        let buku = await Buku.findByPk(req.params.id);
        if (!buku) {
            return res.status(404).json({ message: 'Buku tidak ditemukan' });
        }

        // Pastikan user adalah pemilik buku
        if (buku.userId !== userId) {
            return res.status(403).json({ message: 'Anda tidak diizinkan untuk mengedit buku ini' });
        }

        let currentGambarPath = buku.gambar; // Defaultnya tetap gambar lama

        // Cek apakah ada file baru yang diunggah melalui Multer (req.file)
        if (req.file) {
            // Hapus gambar lama jika ada
            if (currentGambarPath && fs.existsSync(path.join(__dirname, '..', currentGambarPath))) {
                fs.unlinkSync(path.join(__dirname, '..', currentGambarPath));
            }
            currentGambarPath = `/uploads/${req.file.filename}`; // Update dengan nama file baru dari Multer
        }

        buku.nama_buku = nama_buku || buku.nama_buku;
        buku.penulis_buku = penulis_buku || buku.penulis_buku;
        buku.gambar = currentGambarPath; // Gunakan path gambar yang sudah diperbarui

        await buku.save();
        res.status(200).json(buku);
    } catch (error) {
        console.error('Error saat memperbarui buku:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete buku
// @route   DELETE /api/buku/:id
// @access  Private (hanya user yang terautentikasi dan pemilik buku)
exports.deleteBuku = async (req, res) => {
    const userId = req.user.id;

    try {
        const buku = await Buku.findByPk(req.params.id);
        if (!buku) {
            return res.status(404).json({ message: 'Buku tidak ditemukan' });
        }

        // Pastikan user adalah pemilik buku
        if (buku.userId !== userId) {
            return res.status(403).json({ message: 'Anda tidak diizinkan untuk menghapus buku ini' });
        }

        // Hapus file gambar dari server
        if (buku.gambar && fs.existsSync(path.join(__dirname, '..', buku.gambar))) {
            fs.unlinkSync(path.join(__dirname, '..', buku.gambar));
        }

        await buku.destroy();
        res.status(200).json({ message: 'Buku berhasil dihapus' });
    } catch (error) {
        console.error('Error saat menghapus buku:', error);
        res.status(500).json({ message: error.message });
    }
};