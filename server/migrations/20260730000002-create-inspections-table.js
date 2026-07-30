'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inspections', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.STRING,
        allowNull: false
      },
      machine_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      defect_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      severity: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'Open'
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      resolution_note: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      resolved_at: {
        type: Sequelize.STRING,
        allowNull: true
      },
      resolved_by: {
        type: Sequelize.STRING,
        allowNull: true
      },
      plant_location: {
        type: Sequelize.STRING,
        defaultValue: 'Naroda Plant, Ahmedabad'
      },
      source: {
        type: Sequelize.STRING,
        defaultValue: 'MANUAL'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('inspections');
  }
};
