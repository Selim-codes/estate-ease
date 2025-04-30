
const express = require('express');
const app = express();
const port = process.env.SERVER_PORT || 3000;
const sequelize = require('./db/config');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

(async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully');

        await sequelize.sync();

        app.listen(port, () => {
            console.log(`🛰️ Server is running on port ${port}`);
        });
    } catch (err) {
        console.error('❌ Error connecting to the database:', err);
        process.exit(1);
    }
})();