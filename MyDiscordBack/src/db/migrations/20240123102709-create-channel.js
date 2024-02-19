'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('channel', { 
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      name: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },

      category: {
        type: Sequelize.ENUM("private", "public", "group"),
        allowNull: false,
      },

      image: {
        allowNull: true,
        type: Sequelize.STRING(255),
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },

      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    
    });

  },

  async down (queryInterface, Sequelize) {
   
    await queryInterface.dropTable('channel');
     
  }
};
