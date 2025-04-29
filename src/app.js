const express = require('express');
const app = express();
const port = process.env.SERVER_PORT || 3000;
const pool = require('./db/config'); // Adjust the path as needed

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to DB and start server
(async () => {
    try {
        const client = await pool.connect();
        await client.query(); // simple test query
        client.release();

        console.log('✅ Database connected successfully.');

        app.listen(port, () => {
            console.log(`🛰️ Server listening on port ${port}`);
        });
    } catch (err) {
        console.error('❌ Error connecting to the database:', err);
        process.exit(1);
    }
})();