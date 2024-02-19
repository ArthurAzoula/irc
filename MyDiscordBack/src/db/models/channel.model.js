"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class channelModel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      channelModel.hasMany(models.userChannel, {
        foreignKey: "id",
        as: "userChannel",
      });
      channelModel.hasMany(models.message, { foreignKey: "id", as: "message" });
    }
  }
  channelModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      name: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },

      category: {
        type: DataTypes.ENUM("private", "public", "group"),
        allowNull: false,
      },

      image: {
        allowNull: true,
        type: DataTypes.STRING(255),
      },
    },
    {
      sequelize,
      modelName: "channel",
      freezeTableName: true,
      paranoid: true,
    }
  );
  return channelModel;
};
