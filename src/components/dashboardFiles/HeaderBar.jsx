import { useNavigate } from 'react-router-dom';

const HeaderBar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    alert("Are you sure you want to logout?");
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-indigo-800">Kalyana Sakha</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-600">Welcome, User</span>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
      </div>
    </div>
  );
};

export default HeaderBar;
