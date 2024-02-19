"use strict";
const bcrypt = require("bcrypt");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class accountModel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      accountModel.hasMany(models.userChannel, { foreignKey: "id", as: "userChannel" });
    }
  }
  accountModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      firstName: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      lastName: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING(255),
        unique: true,
        // Verification de l'email
        validate: {
          isEmail: true,
        },
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING(300),
        set(value) {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(value, salt);
          this.setDataValue("password", hash);
        },
        get() {
          return this.getDataValue("password");
        },
      },
      image: {
        allowNull: true,
        type: DataTypes.STRING(255),
      },

      nickname: {
        allowNull: false,
        type: DataTypes.STRING(255),
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "account",
      "tableName": "account",
      freezeTableName: true,
      paranoid: true,
    }
  );
  return accountModel;
};
