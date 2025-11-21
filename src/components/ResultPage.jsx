import React, { useState, useEffect } from 'react';

const ResultPage = ({ userInfo, onViewResults }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('/api/results');
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        } else {
          setError('결과를 불러오는데 실패했습니다.');
        }
      } catch (err) {
        setError('서버와 통신할 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('ko-KR');
  };

  const getRankEmoji = (rank) => {
    switch (rank) {
      case 1: return '🏆';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>결과를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-container">
          <h2>오류 발생</h2>
          <p>{error}</p>
          <button onClick={onViewResults} className="btn btn-submit">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="header">
        <h1>🏆 최종 발표 채점 결과</h1>
        <p>모든 팀의 순위와 점수를 확인하세요</p>
      </div>

      <div className="content">
        {results && (
          <div className="result-summary">
            <div className="summary-info">
              <span>총 참여자: {results.totalEvaluations}명</span>
              <span>심사위원: {results.judgeCount}명</span>
              <span>아기사자: {results.memberCount}명</span>
            </div>
            <div className="last-updated">
              최종 업데이트: {formatDateTime(results.lastUpdated)}
            </div>
          </div>
        )}

        <div className="results-list">
          {results?.results?.map((result) => (
            <div key={result.teamId} className="result-item">
              <div className="rank-header">
                <span className="rank">
                  {getRankEmoji(result.rank)} {result.rank}위
                </span>
                <h3 className="team-name">{result.teamName}</h3>
              </div>

              <div className="scores-summary">
                <div className="score-row">
                  <span className="score-label">심사위원 점수:</span>
                  <span className="score-value">{result.judgeTotal}점</span>
                </div>
                <div className="score-row">
                  <span className="score-label">아기사자 점수:</span>
                  <span className="score-value">{result.memberTotal}점</span>
                </div>
                <div className="score-row total">
                  <span className="score-label">총점:</span>
                  <span className="score-value total-score">{result.grandTotal}점</span>
                </div>
              </div>

              <div className="breakdown">
                <div className="breakdown-item">
                  <span className="category">디자인:</span>
                  <span className="breakdown-score">
                    {result.breakdown.design.total}점
                    <span className="detail">
                      (심사 {result.breakdown.design.judgeScore} + 아기사자 {result.breakdown.design.memberScore})
                    </span>
                  </span>
                </div>
                <div className="breakdown-item">
                  <span className="category">개발:</span>
                  <span className="breakdown-score">
                    {result.breakdown.development.total}점
                    <span className="detail">
                      (심사 {result.breakdown.development.judgeScore} + 아기사자 {result.breakdown.development.memberScore})
                    </span>
                  </span>
                </div>
                <div className="breakdown-item">
                  <span className="category">공통:</span>
                  <span className="breakdown-score">
                    {result.breakdown.common.total}점
                    <span className="detail">
                      (심사 {result.breakdown.common.judgeScore} + 아기사자 {result.breakdown.common.memberScore})
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="button-group">
          <button onClick={onViewResults} className="btn btn-submit">
            🔄 결과 새로고침
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;