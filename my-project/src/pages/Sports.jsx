import { Link } from "react-router-dom";
import { sports } from "../data/mockData";

const Sports = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">University Sports</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Explore the wide range of sports programs available at Vav University.
          Whether you're a beginner or a pro, there's a team for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sports.map((sport) => (
          <div key={sport.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="h-64 overflow-hidden">
              <img
                src={sport.image}
                alt={sport.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{sport.name}</h3>
              <p className="text-blue-600 dark:text-blue-400 font-medium mb-4">Head Coach: {sport.coach}</p>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{sport.description}</p>
              <Link
                to={`/sports/${sport.id}`}
                className="block w-full text-center bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                View Team Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sports;
