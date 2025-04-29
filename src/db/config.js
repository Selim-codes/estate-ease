import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

let pool;

if (process.env.ENV === 'development') {
    console.log('USING DATABASE DEVELOPMENT CONFIG ..... 🛟');

    pool = new Pool({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        port: parseInt(process.env.DATABASE_PORT || '5432', 10),
        idleTimeoutMillis: parseInt(process.env.DATABASE_TIMEOUT_INTERVAL || '30000', 10),
        connectionTimeoutMillis: parseInt(process.env.DATABASE_TIMEOUT_INTERVAL || '30000', 10),
    });

} else if (process.env.ENV === 'production') {
    console.log('USING DATABASE PRODUCTION CONFIG');

    pool = new Pool({
        host: process.env.RDS_HOST,
        user: process.env.RDS_USER,
        password: process.env.RDS_PASSWORD,
        database: process.env.RDS_NAME,
        port: parseInt(process.env.RDS_PORT || '5432', 10),
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 30000,
    });

} else {
    console.error("❌ Invalid or missing NODE_ENV. Set ENV=development or ENV=production");
    process.exit(1);
}

export default pool;