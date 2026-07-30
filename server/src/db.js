const { sequelize, User, Inspection, Sequelize } = require('../models');
const { Op } = Sequelize;

async function initDB() {
  try {
    await sequelize.authenticate();
    console.log('Connected to Database via Sequelize ORM.');
  } catch (err) {
    console.warn(`Database Connection Warning: ${err.message}`);
  }
}

module.exports = {
  sequelize,
  User,
  Inspection,
  initDB,
  Op
};
