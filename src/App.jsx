import React, { useState } from 'react';
import ModernTeamEvaluation from './components/ModernTeamEvaluation';
import ResultPage from './components/ResultPage';
import './App.css';

function App() {
  const [showResults, setShowResults] = useState(false);

  const handleEvaluationComplete = () => {
    setShowResults(true);
  };

  const handleViewEvaluation = () => {
    setShowResults(false);
  };

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