import React, { useEffect, useState } from "react";

import MemberLayout from "../../shared/layouts/MemberLayout";
import CollapsibleSection from "../../shared/components/CollapsibleSection";
import { designClasses } from "../../shared/styles/designTokens";

import profileService from "../../services/profileService";
import profileSections from "./config/profileSections";
import PersonalDetailsSection from "./components/PersonalDetailsSection";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [activeSection, setActiveSection] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await profileService.getMyProfile();

setProfileData({
  ...data,
  profileId:
    sessionStorage.getItem("profileId") ||
    data?.profileId ||
    data?.profile_id,
  name:
    sessionStorage.getItem("name") ||
    data?.name,
  userId:
    sessionStorage.getItem("userEmail") ||
    sessionStorage.getItem("email") ||
    data?.userId ||
    data?.user_id,
});
      } catch (err) {
        console.error("Failed to load profile", err);

        setError(
          err?.response?.data?.message ||
            "Unable to load your profile. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSectionToggle = (sectionId) => {
    setActiveSection((current) =>
      current === sectionId ? null : sectionId
    );
  };

  if (loading) {
    return (
      <MemberLayout>
        <div className={`min-h-screen ${designClasses.page}`}>
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <div
              className={`rounded-2xl border p-8 text-center ${designClasses.surface} ${designClasses.border}`}
            >
              <p className={designClasses.textSecondary}>
                Loading your profile...
              </p>
            </div>
          </div>
        </div>
      </MemberLayout>
    );
  }

  if (error) {
    return (
      <MemberLayout>
        <div className={`min-h-screen ${designClasses.page}`}>
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <div
              className={`rounded-2xl border p-8 ${designClasses.surface} ${designClasses.border}`}
            >
              <h1
                className={`text-xl font-semibold ${designClasses.textPrimary}`}
              >
                My Profile
              </h1>

              <p className="mt-3 text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </MemberLayout>
    );
  }

  return (
    <MemberLayout>
      <div className={`min-h-screen ${designClasses.page}`}>
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <div
            className={`mb-6 rounded-2xl border p-5 sm:p-6 ${designClasses.surface} ${designClasses.border}`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1
                  className={`text-2xl font-bold ${designClasses.textPrimary}`}
                >
                  My Profile
                </h1>

                <p className={`mt-1 text-sm ${designClasses.textSecondary}`}>
                  Review and maintain your personal, family and profile
                  information.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                <div>
                  <div className={designClasses.textSecondary}>
                    Profile ID
                  </div>

                  <div
                    className={`font-semibold ${designClasses.textPrimary}`}
                  >
                    {profileData?.profile_id ||
                      profileData?.profileId ||
                      "-"}
                  </div>
                </div>

                <div>
                  <div className={designClasses.textSecondary}>
                    Name
                  </div>

                  <div
                    className={`font-semibold ${designClasses.textPrimary}`}
                  >
                    {profileData?.name || "-"}
                  </div>
                </div>

                <div>
                  <div className={designClasses.textSecondary}>
                    Login ID
                  </div>

                  <div
                    className={`font-semibold ${designClasses.textPrimary}`}
                  >
                    {profileData?.userId ||
                      profileData?.user_id ||
                      "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {profileSections.map((section) => (
              <CollapsibleSection
                key={section.id}
                number={section.number}
                title={section.title}
                description={section.description}
                isOpen={activeSection === section.id}
                onToggle={() =>
                  handleSectionToggle(section.id)
                }
              >
                <div className="py-2">
                  {section.id === "personal" ? (
  <PersonalDetailsSection
    profileData={profileData}
  />
) : (
  <p
    className={`text-sm ${designClasses.textSecondary}`}
  >
    {section.title} content will be connected in the
    next step.
  </p>
)}
                </div>
              </CollapsibleSection>
            ))}
          </div>
        </div>
      </div>
    </MemberLayout>
  );
};

export default ProfilePage;