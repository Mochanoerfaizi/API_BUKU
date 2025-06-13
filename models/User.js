'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association here
      // A User can have many Bukus (books)
      this.hasMany(models.Buku, {
        foreignKey: 'userId',
        as: 'bukus',
      });
    }
  }

  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }
    // ... other user fields
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users', // Ensure this matches your database table name
    timestamps: true,
  });

  return User;
};