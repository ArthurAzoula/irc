"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class userChannel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      userChannel.belongsTo(models.account, {
        foreignKey: "idAccount",
        as: "account",
      });
      userChannel.belongsTo(models.anonymous, {
        foreignKey: "id",
        as: "anonymous",
      });
      userChannel.belongsTo(models.channel, {
        foreignKey: "id",
        as: "channel",
      });
      userChannel.hasMany(models.message, {
        foreignKey: "id",
        as: "message",
      });
    }
  }
  userChannel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      idAccount: {
        allowNull: true,
        type: DataTypes.UUID,
      },

      idAnonymous: {
        allowNull: true,
        type: DataTypes.UUID,
      },

      idChannel: {
        allowNull: false,
        type: DataTypes.UUID,
      },

      nickname: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },

      isAdmin: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      connectedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },

      disconnectedAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "userChannel",
      freezeTableName: true,
      paranoid: true,
    }
  );
  return userChannel;
};
