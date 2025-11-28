import React, { useState, useEffect } from 'react';
import ModernTeamEvaluation from './components/ModernTeamEvaluation';
import ResultPage from './components/ResultPage';
import ResetPage from './components/ResetPage';
import './App.css';

function App() {
  const [showResults, setShowResults] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleEvaluationComplete = () => {
    setShowResults(true);
    window.history.pushState({}, '', '/');
  };

  const handleViewEvaluation = () => {
    setShowResults(false);
    window.history.pushState({}, '', '/');
  };

  // Routing logic
  if (currentPath === '/reset-admin-2024') {
    return <ResetPage />;
  }

  return (
    <div className="App">
      {showResults ? (
        <ResultPage userInfo={null} onViewResults={handleViewEvaluation} />
      ) : (
        <ModernTeamEvaluation onComplete={handleEvaluationComplete} />
      )}
    </div>
  );
}

export default App;