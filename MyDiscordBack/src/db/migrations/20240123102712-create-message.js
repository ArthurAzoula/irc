'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  
    await queryInterface.createTable('message', { 
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      idUserChannel: {
        allowNull: false,
        type: Sequelize.UUID
      },

      idChannel: {
        allowNull: false,
        type: Sequelize.UUID
      },

      content: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },

      image: {
        allowNull: true,
        type: Sequelize.STRING(255)
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

    await queryInterface.addConstraint('message', {
      fields: ['idUserChannel'],
      type: 'foreign key',
      name: 'fk_message_userChannel',
      references: {
        table: 'userChannel',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });

    await queryInterface.addConstraint('message', {
      fields: ['idChannel'],
      type: 'foreign key',
      name: 'fk_message_channel',
      references: {
        table: 'channel',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.dropTable('message');
     
  }
};
