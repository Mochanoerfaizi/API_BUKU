'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // definisikan asosiasi di sini jika ada
      User.hasMany(models.buku, { foreignKey: 'userId' }); // Contoh jika ada relasi ke buku
    }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    googleId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true
    },
    name: { // Menggunakan 'name' bukan 'nama'
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    profilePic: {
      type: DataTypes.STRING,
      allowNull: true
    }
    // Tidak ada kolom password di sini
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users' // Eksplisit menyatakan nama tabel
  });
  return User;
};