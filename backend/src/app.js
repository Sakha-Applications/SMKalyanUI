        const express = require("express");
        const cors = require("cors");
        const bodyParser = require("body-parser");
        const userRoutes = require("./routes/userRoutes");
        const profileRoutes = require("./routes/profileRoutes"); // Import profile routes
        const gotraRoutes = require("./routes/gotraRoutes");
        const rashiRoutes = require("./routes/rashiRoutes");
        const nakshatraRoutes = require("./routes/nakshatraRoutes");
        const profilesearchRoutes = require("./routes/profilesearchRoutes"); // Import profile search routes
        const uploadSearchRoutes = require("./routes/uploadSearchRoute");

        require("dotenv").config();

        const app = express();

        // Middleware
        app.use(cors());
        app.use(bodyParser.json());

        // Routes
        app.use("/api", userRoutes);
        app.use("/api", profileRoutes); // Add profile routes
        // Register Routes
        app.use("/api", gotraRoutes);
        app.use("/api", rashiRoutes);
        app.use("/api", nakshatraRoutes);
        app.use("/api", profilesearchRoutes); // Add profile search routes
        app.use("/api", uploadSearchRoutes);
        console.log("⚙️ Mounting uploadSearchRoutes under /api"); // Ensure this kind of log exists

        module.exports = app;   
