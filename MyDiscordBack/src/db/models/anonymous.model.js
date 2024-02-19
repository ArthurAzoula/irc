"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class anonymousModel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      anonymousModel.hasMany(models.userChannel, { foreignKey: "id", as: "userChannel" });
    }
  }
  anonymousModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      nickname: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      
    },
    {
      sequelize,
      modelName: "anonymous",
      freezeTableName: true,
      paranoid: true,
    }
  );
  return anonymousModel;
};
