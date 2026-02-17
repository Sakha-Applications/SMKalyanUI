// SMKalyanUI/src/components/admin/AdminDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import getBaseUrl from "../../utils/GetUrl";

const normalizeStatus = (s) => (typeof s === "string" ? s.trim().toUpperCase() : "");

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const token = sessionStorage.getItem("token");

  const logout = () => {
    // ✅ production-safe logout
    sessionStorage.clear();
    navigate("/login");
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, listRes] = await Promise.all([
        fetch(`${getBaseUrl()}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${getBaseUrl()}/api/admin/profiles/payment-submitted`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const statsData = await statsRes.json();
      const listData = await listRes.json();

      if (statsRes.ok) setStats(statsData);
      if (listRes.ok) setProfiles(listData.profiles || []);
    } catch (e) {
      console.error("❌ AdminDashboard fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const approve = async (profileId) => {
    try {
      setActionLoadingId(profileId);

      const res = await fetch(`${getBaseUrl()}/api/admin/profile/${profileId}/approve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data?.message || "Approval failed");
        return;
      }

      // refresh list + stats after approval
      fetchData();
    } catch (e) {
      console.error("❌ approve error:", e);
      alert("Approval failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Derived data for nicer UI ---
  const profileCountsMap = useMemo(() => {
    const map = {};
    const arr = Array.isArray(stats?.profileCounts) ? stats.profileCounts : [];
    arr.forEach((x) => {
      map[normalizeStatus(x.status)] = Number(x.cnt || 0);
    });
    return map;
  }, [stats]);

  const paymentCountsMap = useMemo(() => {
    const map = {};
    const arr = Array.isArray(stats?.offlinePaymentCounts) ? stats.offlinePaymentCounts : [];
    arr.forEach((x) => {
      map[normalizeStatus(x.status)] = Number(x.cnt || 0);
    });
    return map;
  }, [stats]);

  const filteredProfiles = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return profiles;

    return profiles.filter((p) => {
      const id = (p.profile_id || "").toString().toLowerCase();
      const name = (p.name || "").toString().toLowerCase();
      const email = (p.email || "").toString().toLowerCase();
      const phone = (p.phone || "").toString().toLowerCase();
      return id.includes(q) || name.includes(q) || email.includes(q) || phone.includes(q);
    });
  }, [profiles, searchText]);

  const renderCountCards = (title, counts) => {
    const arr = Array.isArray(counts) ? counts : [];
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <span className="text-xs text-gray-500">Live</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {arr.map((x) => (
            <div
              key={x.status}
              className="rounded-lg border border-gray-100 bg-gray-50 p-3"
            >
              <div className="text-[11px] text-gray-500 uppercase tracking-wide">
                {x.status}
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-1">
                {x.cnt}
              </div>
            </div>
          ))}

          {arr.length === 0 && (
            <div className="text-sm text-gray-500">No data.</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="container mx-auto px-4 py-6">
        {/* Top header bar (Dashboard-like) */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-2xl font-bold text-indigo-900">Kalyana Sakha</div>
            <div className="text-sm text-gray-600">Admin Console</div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 shadow-sm"
            >
              Refresh
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-gray-600">
            Loading admin dashboard...
          </div>
        ) : (
          <>
            {/* ✅ Queue FIRST */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    PAYMENT_SUBMITTED Queue
                    <span className="ml-2 text-sm text-gray-500">
                      ({profiles.length})
                    </span>
                  </h2>
                  <p className="text-sm text-gray-600">
                    Review profiles with offline payment submitted and approve.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search by Profile ID / name / email / phone..."
                    className="w-full md:w-96 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
              </div>

              {/* Quick KPI tiles (nice UX) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                <div className="rounded-lg border border-gray-100 bg-blue-50 p-3">
                  <div className="text-[11px] text-gray-600 uppercase tracking-wide">
                    Queue Count
                  </div>
                  <div className="text-2xl font-bold text-blue-900 mt-1">
                    {profiles.length}
                  </div>
                </div>

                <div className="rounded-lg border border-gray-100 bg-green-50 p-3">
                  <div className="text-[11px] text-gray-600 uppercase tracking-wide">
                    Approved
                  </div>
                  <div className="text-2xl font-bold text-green-900 mt-1">
                    {profileCountsMap["APPROVED"] || 0}
                  </div>
                </div>

                <div className="rounded-lg border border-gray-100 bg-yellow-50 p-3">
                  <div className="text-[11px] text-gray-600 uppercase tracking-wide">
                    Submitted
                  </div>
                  <div className="text-2xl font-bold text-yellow-900 mt-1">
                    {profileCountsMap["SUBMITTED"] || 0}
                  </div>
                </div>

                <div className="rounded-lg border border-gray-100 bg-purple-50 p-3">
                  <div className="text-[11px] text-gray-600 uppercase tracking-wide">
                    Payment Submitted
                  </div>
                  <div className="text-2xl font-bold text-purple-900 mt-1">
                    {profileCountsMap["PAYMENT_SUBMITTED"] || 0}
                  </div>
                </div>
              </div>

              <div className="overflow-auto rounded-lg border border-gray-100">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr className="text-left border-b border-gray-100">
                      <th className="p-3 font-semibold text-gray-700">Profile ID</th>
                      <th className="p-3 font-semibold text-gray-700">Name</th>
                      <th className="p-3 font-semibold text-gray-700">Email</th>
                      <th className="p-3 font-semibold text-gray-700">Phone</th>
                      <th className="p-3 font-semibold text-gray-700">Status</th>
                      <th className="p-3 font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProfiles.map((p, idx) => (
                      <tr
                        key={p.profile_id}
                        className={`border-b border-gray-100 ${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-indigo-50 transition`}
                      >
                        <td className="p-3 font-medium text-gray-900">{p.profile_id}</td>
                        <td className="p-3 text-gray-800">{p.name}</td>
                        <td className="p-3 text-gray-800">{p.email}</td>
                        <td className="p-3 text-gray-800">{p.phone}</td>
                        <td className="p-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-900">
                            {p.profile_status}
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => approve(p.profile_id)}
                            disabled={actionLoadingId === p.profile_id}
                            className={`px-3 py-2 rounded-lg text-white text-sm shadow-sm ${
                              actionLoadingId === p.profile_id
                                ? "bg-green-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                          >
                            {actionLoadingId === p.profile_id ? "Approving..." : "Approve"}
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredProfiles.length === 0 && (
                      <tr>
                        <td className="p-4 text-gray-500" colSpan={6}>
                          No PAYMENT_SUBMITTED profiles found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ✅ Stats AFTER queue */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              {renderCountCards("Profile Status Statistics", stats?.profileCounts)}
              {renderCountCards("Offline Payment Status Statistics", stats?.offlinePaymentCounts)}
            </div>

            {/* Optional: small footer note */}
            <div className="text-xs text-gray-500 text-center pb-4">
              Admin actions are audited via backend logs. Please approve only after verification.
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
