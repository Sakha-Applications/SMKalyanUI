// components/ModifyProfile/PartnerPreferences/sections/ContactDetails.jsx
import React from "react";

const DataRow = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <p className="text-gray-700">
      <span className="font-semibold">{label}:</span> {value || '-'}
    </p>
  </div>
);


const ContactDetails = ({ profileData }) => (
  <section className="mb-8">
    <h2 className="text-xl font-semibold text-indigo-600 mb-4 border-b pb-2 border-indigo-200">
      Contact Details
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <DataRow label="Email ID" value={profileData?.email} />
      <DataRow label="Phone Number" value={`${profileData?.phoneCountryCode || ''} ${profileData?.phoneNumber || profileData?.phone}`} />
      <DataRow label="Date of Birth" value={profileData?.dob} />
    </div>
  </section>
);

export default ContactDetails;
