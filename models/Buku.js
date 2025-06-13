'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Buku extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association here
      // A Buku (book) belongs to one User
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }

  Buku.init({
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
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: { // This is the foreign key
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users', // Note: It's common practice to reference the table name here
        key: 'id',
      }
    }
  }, {
    sequelize,
    modelName: 'Buku',
    tableName: 'bukus', // Ensure this matches your database table name
    timestamps: true,
  });

  return Buku;
};