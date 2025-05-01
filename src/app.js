
const express = require('express');
const app = express();
const port = process.env.SERVER_PORT || 3000;
const authRoutes = require('./routes/auth');
const sequelize = require('./db/config');
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const propertyRoutes = require('./routes/propertiesRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api', propertyRoutes);
app.use('/api/auth', authRoutes);

if (process.env.NODE_ENV !== 'production') {
    console.log('Development Cors Loaded 🪛')
    app.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }));
} else {
    console.log('Production Cors Loaded 🪄')
    app.use(cors({
        origin: process.env["EC2_INSTANCE_SERVER_IP"],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }));
}

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