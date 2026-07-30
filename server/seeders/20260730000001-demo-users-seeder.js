'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hash = await bcrypt.hash('arvind123', 10);
    const now = new Date();

    await queryInterface.bulkInsert('users', [
      {
        username: 'supervisor',
        password_hash: hash,
        name: 'Rajesh Patel (Shop-floor Lead)',
        role: 'supervisor',
        plant: 'Naroda Plant, Gujarat',
        createdAt: now,
        updatedAt: now
      },
      {
        username: 'quality_mgr',
        password_hash: hash,
        name: 'Sanjay Kulkarni (Quality Manager)',
        role: 'manager',
        plant: 'Nagpur Plant, Maharashtra',
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
