const StatsCard = ({ icon, title, value, color = 'text-indigo-600', subtext }) => (
  <div className="bg-white rounded-lg shadow p-6 text-center">
    <div className={`text-4xl font-bold ${color} mb-2`}>
      <span className="material-icons text-5xl">{icon}</span>
    </div>
    <h3 className="text-lg font-medium text-gray-700">{title}</h3>
    <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
    {subtext && <p className="text-sm text-gray-500">{subtext}</p>}
  </div>
);

export default StatsCard;
