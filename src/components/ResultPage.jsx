import React, { useState, useEffect } from 'react';

const ResultPage = ({ userInfo, onViewResults }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 결과 다시 조회 함수
  const refreshResults = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('결과 재조회 시도...');
      const response = await fetch('https://likelion-backend-415042403981.asia-northeast3.run.app:8080/api/results', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('재조회 응답 상태:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('재조회 성공:', data);
        setResults(data || []);
      } else {
        const errorText = await response.text();
        console.error('재조회 서버 응답 오류:', response.status, errorText);
        setError(`결과를 다시 불러오는데 실패했습니다. (상태: ${response.status})`);
      }
    } catch (err) {
      console.error('재조회 네트워크 오류:', err);
      let errorMessage = '서버와 통신할 수 없습니다.';

      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        errorMessage = '백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.';
      } else if (err.message) {
        errorMessage = `네트워크 오류: ${err.message}`;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchResults = async () => {
      try {
        console.log('결과 조회 시도...');
        const response = await fetch('https://likelion-backend-415042403981.asia-northeast3.run.app:8080/api/results', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        console.log('응답 상태:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('결과 데이터:', data);
          setResults(data || []);
        } else {
          const errorText = await response.text();
          console.error('서버 응답 오류:', response.status, errorText);
          setError(`결과를 불러오는데 실패했습니다. (상태: ${response.status})`);
        }
      } catch (err) {
        console.error('네트워크 오류:', err);
        let errorMessage = '서버와 통신할 수 없습니다.';

        if (err.name === 'TypeError' && err.message.includes('fetch')) {
          errorMessage = '백엔드 서버에 연결할 수 없습니다. (http://localhost:8080) 서버가 실행 중인지 확인해주세요.';
        } else if (err.message) {
          errorMessage = `네트워크 오류: ${err.message}`;
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  // 가중치 총점 계산 및 정렬
  const getResultsWithRank = () => {
    const resultsWithTotal = results.map(result => {
      const judgeScore = result.judgeTotalScore || 0;
      const menteeScore = result.menteeTotalScore || 0;

      // 가중치 적용: 심사위원 70%, 아기사자 30%
      const weightedTotal = (judgeScore * 0.7) + (menteeScore * 0.3);

      return {
        ...result,
        grandTotalScore: Math.round(weightedTotal * 10) / 10  // 소수점 첫째자리까지 반올림
      };
    });

    return resultsWithTotal.sort((a, b) => b.grandTotalScore - a.grandTotalScore);
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
          <h2>❌ 결과 조회 오류</h2>
          <p>{error}</p>
          <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
            <p>💡 해결 방법:</p>
            <ul style={{ textAlign: 'left', marginLeft: '20px' }}>
              <li>Spring Boot 백엔드 서버가 실행 중인지 확인해주세요</li>
              <li>서버 주소: 서버가 실행 중인지 확인해주세요</li>
              <li>브라우저 개발자 도구(F12)의 콘솔에서 자세한 오류를 확인할 수 있습니다</li>
            </ul>
          </div>
          <button onClick={onViewResults} className="btn btn-submit" style={{ marginTop: '20px' }}>
            🔄 다시 시도
          </button>
        </div>
      </div>
    );
  }

  const rankedResults = getResultsWithRank();

  return (
    <div className="page-container">
      <div className="header">
        <h1>🏆 최종 발표 채점 결과</h1>
        <p>4개 팀의 최종 순위와 점수를 확인하세요</p>
      </div>

      <div className="content">
        {error && (
          <div className="alert alert-info" style={{ marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {/* 결과 테이블 */}
        <div className="results-table">
          <table>
            <thead>
              <tr>
                <th>순위</th>
                <th>팀 이름</th>
                <th>심사위원 점수</th>
                <th>아기사자 점수</th>
                <th>최종 점수 (70:30)</th>
                <th>평가 참여</th>
              </tr>
            </thead>
            <tbody>
              {rankedResults.map((result, index) => (
                <tr key={result.teamId} className={`rank-${index + 1}`}>
                  <td className="rank-cell">
                    <span className="rank-emoji">{getRankEmoji(index + 1)}</span>
                    <span className="rank-number">{index + 1}위</span>
                  </td>
                  <td className="team-name-cell">
                    <strong>{result.teamName}</strong>
                  </td>
                  <td className="score-cell">
                    <span className="judge-score">{result.judgeTotalScore || 0}점</span>
                    <small>({result.judgeEvaluationCount || 0}명)</small>
                  </td>
                  <td className="score-cell">
                    <span className="mentee-score">{result.menteeTotalScore || 0}점</span>
                    <small>({result.menteeEvaluationCount || 0}명)</small>
                  </td>
                  <td className="total-score-cell">
                    <strong>{result.grandTotalScore}점</strong>
                  </td>
                  <td className="participants-cell">
                    <div className="participant-info">
                      <span>심사 {result.judgeEvaluationCount || 0}</span>
                      <span>아기 {result.menteeEvaluationCount || 0}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 요약 카드 */}
        <div className="summary-cards">
          <div className="summary-card">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <h3>가중치 적용 최종 점수</h3>
              <p>심사위원 70% + 아기사자 30%</p>
            </div>
          </div>

          <div className="summary-card winner">
            <div className="card-icon">🏆</div>
            <div className="card-content">
              <h3>1위 팀</h3>
              <p>{rankedResults[0]?.teamName} ({rankedResults[0]?.grandTotalScore}점)</p>
            </div>
          </div>
        </div>

        <div className="button-group">
          <button onClick={refreshResults} disabled={loading} className="btn btn-submit">
            {loading ? '🔄 새로고침 중...' : '🔄 결과 새로고침'}
          </button>
          <button onClick={() => window.location.href = '/'} className="btn btn-secondary">
            📝 채점하러 가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;