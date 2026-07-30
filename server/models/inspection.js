'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Inspection extends Model {
    static associate(models) {
      // define associations here if needed
    }
  }
  Inspection.init({
    date: {
      type: DataTypes.STRING,
      allowNull: false
    },
    machine_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    defect_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    severity: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Open'
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    resolution_note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    resolved_at: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resolved_by: {
      type: DataTypes.STRING,
      allowNull: true
    },
    plant_location: {
      type: DataTypes.STRING,
      defaultValue: 'Naroda Plant, Ahmedabad'
    },
    source: {
      type: DataTypes.STRING,
      defaultValue: 'MANUAL'
    }
  }, {
    sequelize,
    modelName: 'Inspection',
    tableName: 'inspections'
  });
  return Inspection;
};
