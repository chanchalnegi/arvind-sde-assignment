const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const dialect = process.env.DB_DIALECT || 'sqlite';

let dbConfig;

if (dialect === 'postgres') {
  dbConfig = {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'arvind_quality_db',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    logging: false
  };
} else {
  // SQLite (Zero-config local file storage)
  const dbDir = path.resolve(__dirname, '../data');
  const fs = require('fs');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  dbConfig = {
    dialect: 'sqlite',
    storage: path.join(dbDir, 'quality_tracker.sqlite'),
    logging: false
  };
}

module.exports = {
  development: dbConfig,
  dev: dbConfig,
  staging: dbConfig,
  stage: dbConfig,
  production: dbConfig,
  prod: dbConfig
};
