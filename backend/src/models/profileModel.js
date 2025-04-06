const pool = require("../config/db");

const createProfile = async (formData) => {
    const {
        profileId, name, profileCreatedFor, profileFor, motherTongue,
        nativePlace, currentLocation, profileStatus, marriedStatus, gotra, guruMatha,
        dob, timeOfBirth, currentAge, subCaste, rashi, height,
        nakshatra, charanaPada, email, phone, alternatePhone,
        communicationAddress, residenceAddress, fatherName, fatherProfession,
        motherName, motherProfession, expectations, siblings,
        workingStatus, education, profession, designation,
        currentCompany, annualIncome
    } = formData;

    console.log("🟡 Preparing to insert profile data into database:", formData);

    const query = `
    INSERT INTO profile (profile_id, name, profile_created_for, profile_for, mother_tongue,
     native_place, current_location, profile_status, married_status, gotra, guru_matha,
     dob, time_of_birth, current_age, sub_caste, rashi, height,
     nakshatra, charana_pada, email, phone, alternate_phone,
     communication_address, residence_address, father_name, father_profession,
     mother_name, mother_profession, expectations, siblings,
     working_status, education, profession, designation,
     current_company, annual_income, created_at) 
    VALUES 
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 
     $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, 
     $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, 
     $31, $32, $33, $34, $35, $36, NOW()) 
    RETURNING *`;

    console.log("🔵 Executing SQL Query:", query);

    try {
        const result = await pool.query(query, [
            profileId, name, profileCreatedFor, profileFor, motherTongue,
            nativePlace, currentLocation, profileStatus, marriedStatus, gotra, guruMatha,
            dob, timeOfBirth, currentAge, subCaste, rashi, height,
            nakshatra, charanaPada, email, phone, alternatePhone,
            communicationAddress, residenceAddress, fatherName, fatherProfession,
            motherName, motherProfession, expectations, siblings,
            workingStatus, education, profession, designation,
            currentCompany, annualIncome
        ]);

        console.log("✅ Query executed successfully, inserted data:", result.rows[0]);

        return result;
    } catch (error) {
        console.error("❌ Database error while inserting profile:", error);
        throw error;    
    }
};

module.exports = { createProfile };
