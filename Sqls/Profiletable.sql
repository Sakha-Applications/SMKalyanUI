select * from profile
ALTER TABLE profile RENAME TO old_profile;

CREATE TABLE profile (
    id SERIAL PRIMARY KEY,  -- Auto-generated ID
    profile_id VARCHAR(50) UNIQUE NOT NULL,  -- Unique Profile ID

    -- Basic Information
    name VARCHAR(255),  
    profile_created_for VARCHAR(100),  
    profile_for VARCHAR(100),  
    mother_tongue VARCHAR(100),  
    native_place VARCHAR(255),  
    current_location VARCHAR(255),  
    profile_status VARCHAR(50),  
    gotra VARCHAR(100),  
    guru_matha VARCHAR(255),  

    -- Birth Details
    dob DATE,  
    time_of_birth TIME,  
    current_age INT,  -- Age will be calculated in frontend and stored here

    -- Personal Details
    sub_caste VARCHAR(100),  
    rashi VARCHAR(100),  
    height DECIMAL(5,2),  
    nakshatra VARCHAR(100),  
    charana_pada VARCHAR(100),  

    -- Contact Information
    email VARCHAR(255) UNIQUE,  
    phone VARCHAR(10) UNIQUE CHECK (phone ~ '^\d{10}$'),  
    alternate_phone VARCHAR(10) CHECK (alternate_phone ~ '^\d{10}$'),  

    -- Addresses
    communication_address TEXT,  
    residence_address TEXT,  

    -- Family Information
    father_name VARCHAR(255),  
    father_profession VARCHAR(255),  
    mother_name VARCHAR(255),  
    mother_profession VARCHAR(255),  

    -- Additional Details
    expectations TEXT,  
    siblings TEXT,  

    -- Professional Details
    working_status VARCHAR(100) NOT NULL,  
    education VARCHAR(255) NOT NULL,  
    profession VARCHAR(255),  
    designation VARCHAR(255),  
    current_company VARCHAR(255),  
    annual_income DECIMAL(15,2) CHECK (annual_income >= 0)  
);