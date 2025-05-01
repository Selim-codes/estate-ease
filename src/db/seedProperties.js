const { faker } = require('@faker-js/faker');
const pool = require('config');
const Property = require('./models/Property');

const seedProperties = async () => {
    try {
        await pool.sync();

        const count = await Property.count();
        if (count > 0) {
            console.log(`ℹ️ Properties table already contains ${count} records. Seeding skipped.`);
            return;
        }

        console.log('🚀 Seeding mock properties...');

        const mockProperties = Array.from({ length: 10 }).map(() => ({
            title: faker.lorem.words(3),
            description: faker.lorem.paragraph(),
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            zipCode: faker.location.zipCode(),
            price: faker.finance.amount(50000, 500000, 2),
            bedrooms: faker.number.int({ min: 1, max: 5 }),
            bathrooms: faker.number.float({ min: 1, max: 3, precision: 0.5 }),
            squareFeet: faker.number.int({ min: 600, max: 3000 }),
            propertyType: faker.helpers.arrayElement(['apartment', 'house', 'condo', 'land', 'commercial']),
            status: faker.helpers.arrayElement(['available', 'pending', 'sold']),
            imageurl: faker.image.urlPicsumPhotos(),
            featured: faker.datatype.boolean(),
        }));

        await Property.bulkCreate(mockProperties);
        console.log('✅ Mock properties inserted.');
    } catch (error) {
        console.error('❌ Error seeding properties:', error);
    } finally {
        await pool.close();
    }
};

seedProperties();