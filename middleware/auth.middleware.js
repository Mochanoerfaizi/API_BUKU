const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verifikasi token JWT
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findByPk(decoded.id, { attributes: { exclude: ['googleId'] } });
            if (!req.user) {
                return res.status(401).json({ message: 'Tidak diotorisasi, pengguna tidak ditemukan' });
            }
            next();
        } catch (error) {
            console.error('Error saat verifikasi token JWT:', error);
            res.status(401).json({ message: 'Tidak diotorisasi, token gagal' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Tidak diotorisasi, tidak ada token' });
    }
};

const googleAuth = async (req, res, next) => {
    const { id_token } = req.body; // Token ID dari frontend Google Sign-In

    if (!id_token) {
        return res.status(400).json({ message: 'Token ID Google tidak disediakan.' });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture: profilePic } = payload;

        let user = await User.findOne({ where: { googleId } });

        if (!user) {
            // Jika pengguna baru, buat akun baru
            user = await User.create({
                googleId,
                email,
                name,
                profilePic
            });
        }

        // Buat token JWT untuk pengguna ini
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
            token,
        });

    } catch (error) {
        console.error('Error saat verifikasi token Google:', error);
        res.status(401).json({ message: 'Otentikasi Google gagal.' });
    }
};

module.exports = { protect, googleAuth };