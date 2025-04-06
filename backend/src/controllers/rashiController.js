const { getRashiList } = require("../models/rashiModel");

exports.getRashis = async (req, res) => {
    try {
        const result = await getRashiList();
        console.log("Database Query Result:", result.rows); // ✅ Debug log
        res.json(result.rows); // Send fetched data as JSON response
    } catch (err) {
        console.error("Error fetching Rashi list:", err);
        res.status(500).json({ message: "Error fetching Rashi list" });
    }
};
