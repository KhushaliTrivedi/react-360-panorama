import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Panorama from "./components/Panorama";

const App: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Panorama />}
      />
    </Routes>
  );
};

export default App;
