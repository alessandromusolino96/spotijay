// react
import React from "react";

// react-router-dom
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">🎵 Benvenuto in Spotijay 🎧</h1>
      <div className="w-full space-y-4">
        <Link to="/dj" className="block w-full bg-blue-500 hover:bg-blue-700 text-white text-center py-3 rounded">
          Accedi come DJ
        </Link>
        <Link to="/public" className="block w-full bg-green-500 hover:bg-green-700 text-white text-center py-3 rounded">
          Accedi come Pubblico
        </Link>
      </div>
    </div>
  );
};

export default Home;
