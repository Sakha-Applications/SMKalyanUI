// src/components/dashboard/MatchGrid.jsx

const matches = [
  {
    name: "Lakshmi",
    age: 25,
    height: "5’6”",
    location: "Bengaluru",
    image: "https://via.placeholder.com/200x240?text=Profile+1"
  },
  {
    name: "Rukmini",
    age: 24,
    height: "5’4”",
    location: "Hyderabad",
    image: "https://via.placeholder.com/200x240?text=Profile+2"
  },
  {
    name: "Satyadevi",
    age: 26,
    height: "5’7”",
    location: "Chennai",
    image: "https://via.placeholder.com/200x240?text=Profile+3"
  },
  {
    name: "Shanta",
    age: 25,
    height: "5’5”",
    location: "Mysuru",
    image: "https://via.placeholder.com/200x240?text=Profile+4"
  }
];

const MatchGrid = () => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
    {matches.map((match, idx) => (
      <div
        key={idx}
        className="bg-white rounded-lg shadow hover:shadow-lg transition duration-200 text-center p-3"
      >
        <img
          src={match.image}
          alt={match.name}
          className="w-full h-44 object-cover rounded"
        />
        <div className="font-semibold mt-2 text-gray-800">
          {match.name}, {match.age} yrs
        </div>
        <div className="text-sm text-gray-600">
          {match.height} | {match.location}
        </div>
      </div>
    ))}
  </div>
);

export default MatchGrid;
