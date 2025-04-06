// src/models/uploadSearchModel.js
const pool = require("../config/db");
console.log("✅ uploadSearchModel.js loaded");

const findProfilesForUpload = async (searchCriteria) => {
  let query = `SELECT id, name, current_age, gotra FROM profile WHERE 1=1`;
  let values = [];
  let paramCount = 1;

  if (searchCriteria.profileId) {
    query += ` AND profile_id = $${paramCount++}`;
    values.push(searchCriteria.profileId);
  }

  if (searchCriteria.email) {
    query += ` AND email = $${paramCount++}`;
    values.push(searchCriteria.email);
  }

  if (searchCriteria.phone) {
    query += ` AND phone = $${paramCount++}`;
    values.push(searchCriteria.phone);
  }

  if (values.length === 0) {
    return []; // If no search criteria provided, return empty array
  }

  try {
    const result = await pool.query(query, values);
    console.log("Executing query:", query, "with values:", values);
    return result.rows;
  } catch (error) {
    console.error("Database error searching profiles for upload:", error);
    throw error;
  }
};

module.exports = { findProfilesForUpload };