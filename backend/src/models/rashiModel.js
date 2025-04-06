const pool = require("../config/db");

const getRashiList = async () => {
    console.log("🔍 Fetching Rashi List..."); // Debugging
    try {
        const result = await pool.query("SELECT * FROM tblRashi ORDER BY RashiName ASC");
        console.log("✅ Query Success! Data:", result.rows); // Log result
        return result;
    } catch (err) {
        console.error("❌ Database Query Failed:", err);
        throw err;
    }
};

module.exports = { getRashiList };


