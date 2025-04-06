const { createProfile } = require("../models/profileModel");

const addProfile = async (req, res) => {
    try {
        console.log("🟢 Received request to add profile:", req.body);

        const newProfile = await createProfile(req.body);

        console.log("✅ Profile inserted successfully:", newProfile.rows[0]);

        res.status(201).json(newProfile.rows[0]);
    } catch (error) {
        console.error("❌ Error inserting profile:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};
// 🔹 Added missing function
const getAllProfiles = async (req, res) => {
    try {
        console.log("🟢 Received request to get all profiles");

        const profiles = await fetchAllProfiles();

        console.log("✅ Profiles fetched successfully:", profiles.rows);

        res.status(200).json(profiles.rows);
    } catch (error) {
        console.error("❌ Error fetching profiles:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};
module.exports = { addProfile, getAllProfiles };
