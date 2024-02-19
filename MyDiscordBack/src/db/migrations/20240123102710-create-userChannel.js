'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   
    await queryInterface.createTable('userChannel', { 
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      idAccount: {
        allowNull: true,
        type: Sequelize.UUID
      },

      idAnonymous: {
        allowNull: true,
        type: Sequelize.UUID
      },

      idChannel: {
        allowNull: false,
        type: Sequelize.UUID
      },

      nickname: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },

      connectedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      disconnectedAt: {
        allowNull: true,
        type: Sequelize.DATE,
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
    
    await queryInterface.addConstraint('userChannel', {
      fields: ['idAccount'],
      type: 'foreign key',
      name: 'fk_userChannel_account',
      references: {
        table: 'account',
        field: 'id'
      },
    });

    await queryInterface.addConstraint('userChannel', {
      fields: ['idAnonymous'],
      type: 'foreign key',
      name: 'fk_userChannel_anonymous',
      references: {
        table: 'anonymous',
        field: 'id'
      },
    });

    await queryInterface.addConstraint('userChannel', {
      fields: ['idChannel'],
      type: 'foreign key',
      name: 'fk_userChannel_channel',
      references: {
        table: 'channel',
        field: 'id'
      },
    });

  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.dropTable('userChannel');
     
  }
};
