const express = require("express");
const app = express();
const port = process.env.SERVER_PORT || 3000;
const authRoutes = require("./routes/auth");
const sequelize = require("./db/config");
require("dotenv").config();
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const propertyRoutes = require("./routes/propertiesRoutes");
const allowedOrigins = process.env.ALLOWED_ORIGIN_1 || "http://localhost:5173"
// Database Check for Sync


//CORS POLICIES
console.log("👾 Loading CORS policies for Development ");
// Middleware
app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    })
);

app.use(helmet()); // Add security headers
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api", propertyRoutes);
app.use("/api/auth", authRoutes);

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to Estate Ease API");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

(async () => {
  try {
    await sequelize.sync({ alter: true });
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    await sequelize.sync();

    app.listen(port, () => {
      console.log(`🛰️ Server is running on port ${port}`);
    });
  } catch (err) {
    console.error("❌ Error connecting to the database:", err);
    process.exit(1);
  }
})();
