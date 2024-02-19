"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class messageModel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      messageModel.belongsTo(models.userChannel, { foreignKey: "idUserChannel", as: "userChannel" })
      messageModel.hasOne(models.channel, { foreignKey: "id", as: "channel" });
    }
  }
  messageModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      idUserChannel: {
        allowNull: false,
        type: DataTypes.UUID,
      },

      idChannel: {
        allowNull: false,
        type: DataTypes.UUID,
      },

      content: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },

      image: {
        allowNull: true,
        type: DataTypes.STRING(255),
      },
    },
    {
      sequelize,
      modelName: "message",
      freezeTableName: true,
      paranoid: true,
    }
  );
  return messageModel;
};
