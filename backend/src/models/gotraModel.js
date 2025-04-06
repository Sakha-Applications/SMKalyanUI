const pool = require("../config/db");

// Fetch Gotra List
const getGotraList = async () => {
    const result = await pool.query("SELECT * FROM tblGotra ORDER BY GotraName ASC");
    console.log("Database Query Execution:", result.rows); // ✅ Debug log
    return result;
};

module.exports = { getGotraList };

