const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.ENV === 'development') {
    console.log('📡 USING DATABASE DEVELOPMENT CONFIG ');
    console.log('-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-')
    console.log('🤫 DATABASE RUNNING CONFIG SETTING ☭ ');

    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432', 10),
            dialect: 'postgres',
            logging: false,
        }
    );
} else if (process.env.ENV === 'production') {
    console.log('🔮USING DATABASE PRODUCTION CONFIG');
    console.log('-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-')
    console.log('👨🏽‍🦯‍➡️ DATABASE RUNNING CONFIG SETTING ☭ ');

    sequelize = new Sequelize(
        process.env.RDS_NAME,
        process.env.RDS_USER,
        process.env.RDS_PASSWORD,
        {
            host: process.env.RDS_HOST,
            port: parseInt(process.env.RDS_PORT || '3306', 10),
            dialect: 'mysql',
            logging: false,
        }
    );
} else {
    console.error("❌ Invalid ENV. Set ENV=development or ENV=production");
    process.exit(1);
}

module.exports = sequelize;
