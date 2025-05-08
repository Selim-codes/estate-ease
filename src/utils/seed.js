const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const pool = require('../db/config');

const CSV_PATH = path.join(__dirname, '../data/properties.csv');

async function seedFromCSV(client) {
    return new Promise((resolve, reject) => {
        const rows = [];
        fs.createReadStream(CSV_PATH)
            .pipe(csv())
            .on('data', (row) => {
                rows.push(row);
            })
            .on('end', async () => {
                if (rows.length === 0) {
                    console.log('⚠️ CSV is empty. Falling back to mock data...');
                    return resolve(false);
                }

                console.log(`📄 Seeding ${rows.length} entries from CSV...`);

                for (let prop of rows) {
                    await client.query(`
            INSERT INTO properties (title, description, address, city, state, zipCode, price, bedrooms, bathrooms, squareFeet, propertyType, status, imageurl, featured)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
                        [
                            prop.title,
                            prop.description,
                            prop.address,
                            prop.city,
                            prop.state,
                            prop.zipCode,
                            parseFloat(prop.price),
                            parseInt(prop.bedrooms),
                            parseFloat(prop.bathrooms),
                            parseInt(prop.squareFeet),
                            prop.propertyType,
                            prop.status || 'available',
                            prop.imageurl,
                            prop.featured === 'true'
                        ]
                    );
                }

                console.log('✅ CSV data seeded.');
                resolve(true);
            })
            .on('error', reject);
    });
}

async function seedFallback(client) {
    console.log('🌱 Seeding mock fallback data...');
    await client.query(`
    INSERT INTO properties (title, description, address, city, state, zipCode, price, bedrooms, bathrooms, squareFeet, propertyType, imageurl)
    VALUES 
    ('Fallback Apartment', 'Nice fallback property', 'Fallback Street', 'TestCity', 'TS', '00000', 100000.00, 2, 1.5, 900, 'apartment', 'https://fallback.com/image.jpg');
  `);
}

(async () => {
    const client = await pool.connect();
    try {
        await client.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        address VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        zipCode VARCHAR(20) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        bedrooms INT,
        bathrooms FLOAT,
        squareFeet INT,
        propertyType VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'available',
        imageurl TEXT,
        featured BOOLEAN DEFAULT false
      );
    `);

        const { rows } = await client.query('SELECT COUNT(*) FROM properties');
        if (parseInt(rows[0].count) === 0) {
            if (!(await seedFromCSV(client))) {
                await seedFallback(client);
            }
        } else {
            console.log('📦 Table already seeded. Skipping...');
        }
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        client.release();
    }
})();