const { getGotraList } = require("../models/gotraModel");

exports.getGotras = async (req, res) => {
    try {
        const result = await getGotraList();
        console.log("Database Query Result:", result.rows); // ✅ Debug log
        res.json(result.rows); // Send fetched data as JSON response
    } catch (err) {
        console.error("Error fetching Gotra list:", err);
        res.status(500).json({ message: "Error fetching Gotra list" });
    }
};
