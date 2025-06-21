// src/components/dashboard/TimelineStatsGrid.jsx

const items = [
  { label: "Pending Invitations", value: 5 },
  { label: "Accepted Invitations", value: 10 },
  { label: "Recent Visitors", value: 20 }
];

const TimelineStatsGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
    {items.map(({ label, value }) => (
      <div
        key={label}
        className="bg-white shadow rounded p-4 text-center font-semibold"
      >
        <div className="text-3xl text-indigo-700">{value}</div>
        <div className="text-gray-600">{label}</div>
      </div>
    ))}
  </div>
);

export default TimelineStatsGrid;
