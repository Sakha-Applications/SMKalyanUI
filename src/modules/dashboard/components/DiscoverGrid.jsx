import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dashboardDiscoveryService from "../../../services/dashboardDiscoveryService";
import { designClasses } from "../../../shared/styles/designTokens";

const discoveryItems = [
  {
    type: "RECENT",
    label: "Recently Joined",
    description: "Recently registered eligible profiles",
    path: "/discover/recent",
  },
  {
    type: "SAME_CITY",
    label: "Same City",
    description: "Eligible profiles from your city",
    path: "/discover/same-city",
  },
  {
    type: "SAME_MOTHER_TONGUE",
    label: "Same Mother Tongue",
    description: "Profiles sharing your mother tongue",
    path: "/discover/same-mother-tongue",
  },
  {
    type: "GOTRA",
    label: "Compatible Gotra",
    description: "Profiles from a Gotra different from yours",
    path: "/discover/gotra",
  },
  {
    type: "PROFESSION",
    label: "Profession",
    description: "Browse profiles by profession",
    browseOnly: true,
  },
  {
    type: "INTERNATIONAL",
    label: "International",
    description: "Eligible profiles currently outside India",
    path: "/discover/international",
  },
];

const DiscoverGrid = () => {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const loadDiscoveryCounts = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
  await dashboardDiscoveryService.getDiscoverySummary();

if (!active) return;

setCounts({
  RECENT: Number(
    data?.recentlyJoined ?? 0
  ),

  SAME_CITY: Number(
    data?.sameCity ?? 0
  ),

  SAME_MOTHER_TONGUE: Number(
    data?.sameMotherTongue ?? 0
  ),

  GOTRA: Number(
    data?.compatibleGotra ?? 0
  ),

  INTERNATIONAL: Number(
    data?.international ?? 0
  ),
});
      } catch (err) {
        console.error(
          "[DiscoverGrid] Failed to load discovery counts:",
          err
        );

        if (active) {
          setError(
            "Some discovery information could not be loaded."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDiscoveryCounts();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="mt-4">
      <div className="mb-3">
        <h2
          className={`text-lg font-semibold ${designClasses.textPrimary}`}
        >
          Discover
        </h2>

        <p
          className={`mt-1 text-sm ${designClasses.textSecondary}`}
        >
          Explore profiles that may be relevant to you.
        </p>
      </div>

      {error && (
        <div className="mb-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {discoveryItems.map((item) => (
          <button
  key={item.type}
  type="button"
  onClick={() => {
    if (item.path) {
      navigate(item.path);
    }
  }}
  className={`${designClasses.surface} ${designClasses.border} rounded-xl border px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}
>
  <div className="flex items-center justify-between gap-3">
    <div
      className={`text-sm font-semibold ${designClasses.textPrimary}`}
    >
      {item.label}
    </div>

    <div
      className={`shrink-0 text-lg font-semibold ${designClasses.textPrimary}`}
    >
      {item.browseOnly
        ? "Browse"
        : loading
          ? "—"
          : counts[item.type] ?? 0}
    </div>
  </div>

  <div
    className={`mt-1 text-xs leading-5 ${designClasses.textSecondary}`}
  >
    {item.description}
  </div>
</button>
        ))}
      </div>
    </section>
  );
};

export default DiscoverGrid;