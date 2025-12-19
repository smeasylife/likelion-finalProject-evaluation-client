import React, { useState, useEffect } from 'react';
import ModernTeamEvaluation from './components/ModernTeamEvaluation';
import ResultPage from './components/ResultPage';
import ResetPage from './components/ResetPage';
import './App.css';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Routing logic
  if (currentPath === '/reset-admin-2024') {
    return <ResetPage />;
  }

  // Results page - only accessible via direct path
  if (currentPath === '/results') {
    return <ResultPage userInfo={null} onViewResults={() => window.history.pushState({}, '', '/')} />;
  }

  return (
    <div className="App">
      <ModernTeamEvaluation />
    </div>
  );
}

export default App;