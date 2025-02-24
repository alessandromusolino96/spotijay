import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TrackProvider } from "./context/TrackContext";
import Home from "./pages/Home";
import DJPage from "./pages/DJPage";
import PublicPage from "./pages/PublicPage";

const App: React.FC = () => {
  return (
    <TrackProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dj" element={<DJPage />} />
          <Route path="/public" element={<PublicPage />} />
        </Routes>
      </Router>
    </TrackProvider>
  );
};

export default App;
