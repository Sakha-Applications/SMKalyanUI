const pool = require("../config/db");

console.log("✅ profilesearchController.js loaded");

const searchProfiles = async (req, res) => {
  console.log("🔍 searchProfiles function is being called");
  try {
      const { profileFor, minAge, maxAge, gotra } = req.query;
      let query = `SELECT * FROM profile WHERE 1=1`;
      let values = [];

      if (profileFor) {
          query += ` AND profile_for ILIKE $${values.length + 1}`;
          values.push(`%${profileFor}%`);
      }

      if (minAge && maxAge) {
          query += ` AND current_age BETWEEN $${values.length + 1} AND $${values.length + 2}`;
          values.push(minAge, maxAge);
      }

      if (gotra) {
          query += ` AND gotra != $${values.length + 1}`;
          values.push(gotra);
      }

      query += " ORDER BY current_age ASC"; // Sorting by age (optional)

      console.log("Executing query:", query, "with values:", values);
      const { rows } = await pool.query(query, values);
      res.json(rows);
  } catch (error) {
      console.error("❌ Error searching profiles:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = { searchProfiles };
