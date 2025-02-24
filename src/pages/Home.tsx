import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">🎵 Benvenuto in Spotijay! 🎧</h1>
      <div className="space-x-4">
        <Link to="/dj" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounder">
          Accedi come DJ
        </Link>
        <Link to="/public" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounder">
          Accedi come Pubblico
        </Link>
      </div>
    </div>
  );
};

export default Home;
