const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // <-- Perubahan di sini!
const User = require('./User');

const Buku = sequelize.define('Buku', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  nama_buku: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  penulis_buku: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gambar: {
    type: DataTypes.STRING, // Path atau URL gambar
    allowNull: true,
  },
  userId: { // Ini akan menjadi foreign key ke tabel User
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: false,
  },
}, {
  timestamps: true, // createdat dan updatedat otomatis
  tableName: 'bukus', // Nama tabel di database
});

// Definisikan relasi
User.hasMany(Buku, { foreignKey: 'userId', as: 'bukus' });
Buku.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Buku;