import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FlightOperations from './pages/FlightOperations';

/**
 * Root Application Router
 * 
 * Handles routing to the Flight Operations module.
 * Directs /flight-operations to FlightOperations.jsx.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main route specified by requirements */}
        <Route path="/flight-operations" element={<FlightOperations />} />

        {/* Default route redirect */}
        <Route path="/" element={<Navigate to="/flight-operations" replace />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/flight-operations" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
