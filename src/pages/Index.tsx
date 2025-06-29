
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from '../components/WelcomePage';
import EmployeeForm from '../components/EmployeeForm';
import ScenarioPage from '../components/ScenarioPage';
import ResultsPage from '../components/ResultsPage';
import AdminPanel from '../components/AdminPanel';
import { GameProvider } from '../context/GameContext';

const Index = () => {
  return (
    <GameProvider>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/employee-form" element={<EmployeeForm />} />
          <Route path="/scenario/:id" element={<ScenarioPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </GameProvider>
  );
};

export default Index;
