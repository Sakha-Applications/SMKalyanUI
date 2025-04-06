const { getNakshatraList } = require("../models/nakshatraModel");

exports.getNakshatras = async (req, res) => {
    try {
        const result = await getNakshatraList();
        console.log("Database Query Result:", result.rows); // ✅ Debug log
        res.json(result.rows); // Send fetched data as JSON response
    } catch (err) {
        console.error("Error fetching Nakshatra list:", err);
        res.status(500).json({ message: "Error fetching Nakshatra list" });
    }
};
