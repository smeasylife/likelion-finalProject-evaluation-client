import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'project_evaluation_data';

const teams = [
  { value: 'team1', name: 'Team 1' },
  { value: 'team2', name: 'Team 2' },
  { value: 'team3', name: 'Team 3' },
  { value: 'team4', name: 'Team 4' }
];

const questions = [
  {
    id: 'design1',
    category: '디자인',
    text: '문제 해결을 적절한 디자인으로 구현했는가?',
    options: [
      { value: 1, label: '1점', description: '매우 미흡' },
      { value: 2, label: '2점', description: '미흡' },
      { value: 3, label: '3점', description: '보통' },
      { value: 4, label: '4점', description: '우수' },
      { value: 5, label: '5점', description: '매우 우수' }
    ]
  },
  {
    id: 'design2',
    category: '디자인',
    text: '디자인의 톤앤매너가 콘셉트와 주제에 부합하는가?',
    options: [
      { value: 1, label: '1점', description: '매우 미흡' },
      { value: 2, label: '2점', description: '미흡' },
      { value: 3, label: '3점', description: '보통' },
      { value: 4, label: '4점', description: '우수' },
      { value: 5, label: '5점', description: '매우 우수' }
    ]
  },
  {
    id: 'design3',
    category: '디자인',
    text: '사용자 친화적인 UI/UX를 설계했는가?',
    options: [
      { value: 1, label: '1점', description: '매우 미흡' },
      { value: 2, label: '2점', description: '미흡' },
      { value: 3, label: '3점', description: '보통' },
      { value: 4, label: '4점', description: '우수' },
      { value: 5, label: '5점', description: '매우 우수' }
    ]
  },
  {
    id: 'design4',
    category: '디자인',
    text: '개발자와 원활한 협업(디자인 전달·QA)을 통해 의도한 디자인이 구현되었는가?',
    options: [
      { value: 1, label: '1점', description: '매우 미흡' },
      { value: 2, label: '2점', description: '미흡' },
      { value: 3, label: '3점', description: '보통' },
      { value: 4, label: '4점', description: '우수' },
      { value: 5, label: '5점', description: '매우 우수' }
    ]
  },
  {
    id: 'design5',
    category: '디자인',
    text: '개발과의 협업이 용이하도록 실용적인 디자인 시스템을 만들었는가?',
    options: [
      { value: 1, label: '1점', description: '매우 미흡' },
      { value: 2, label: '2점', description: '미흡' },
      { value: 3, label: '3점', description: '보통' },
      { value: 4, label: '4점', description: '우수' },
      { value: 5, label: '5점', description: '매우 우수' }
    ]
  },
  {
    id: 'dev1',
    category: '개발',
    text: '실제 서비스가 배포되었는가?',
    options: [
      { value: 1, label: '1점', description: '전혀 배포 안됨' },
      { value: 2, label: '2점', description: '일부만 배포' },
      { value: 3, label: '3점', description: '대부분 배포' },
      { value: 4, label: '4점', description: '완전히 배포' },
      { value: 5, label: '5점', description: '실제 운영 중' }
    ]
  },
  {
    id: 'dev2',
    category: '개발',
    text: '프로젝트 구조를 알맞게 활용하였는가?',
    options: [
      { value: 1, label: '1점', description: '전혀 미흡' },
      { value: 2, label: '2점', description: '미흡' },
      { value: 3, label: '3점', description: '보통' },
      { value: 4, label: '4점', description: '우수' },
      { value: 5, label: '5점', description: '매우 우수' }
    ]
  },
  {
    id: 'dev3',
    category: '개발',
    text: '의도에 맞춰 개발을 진행하였는가?',
    options: [
      { value: 1, label: '1점', description: '매우 미흡' },
      { value: 2, label: '2점', description: '미흡' },
      { value: 3, label: '3점', description: '보통' },
      { value: 4, label: '4점', description: '우수' },
      { value: 5, label: '5점', description: '매우 우수' }
    ]
  },
  {
    id: 'dev4',
    category: '개발',
    text: '협업(파트 간·팀 내) 과정에서 충분한 노력을 기울였는가?',
    options: [
      { value: 1, label: '1점', description: '매우 미흡' },
      { value: 2, label: '2점', description: '미흡' },
      { value: 3, label: '3점', description: '보통' },
      { value: 4, label: '4점', description: '우수' },
      { value: 5, label: '5점', description: '매우 우수' }
    ]
  },
  {
    id: 'dev5',
    category: '개발',
    text: '결과물의 완성도와 안정성은 어떤가?',
    options: [
      { value: 1, label: '1점', description: '매우 미흡' },
      { value: 2, label: '2점', description: '미흡' },
      { value: 3, label: '3점', description: '보통' },
      { value: 4, label: '4점', description: '우수' },
      { value: 5, label: '5점', description: '매우 우수' }
    ]
  },
  {
    id: 'dev6',
    category: '개발',
    text: '코드가 재사용성과 유지보수성을 고려해 작성되었는가?',
    options: [
      { value: 1, label: '1점', description: '매우 미흡' },
      { value: 2, label: '2점', description: '미흡' },
      { value: 3, label: '3점', description: '보통' },
      { value: 4, label: '4점', description: '우수' },
      { value: 5, label: '5점', description: '매우 우수' }
    ]
  },
  {
    id: 'dev7',
    category: '개발',
    text: '과도한 AI 코딩을 사용하지 않았는가?',
    options: [
      { value: 1, label: '1점', description: '과도하게 사용' },
      { value: 2, label: '2점', description: '많이 사용' },
      { value: 3, label: '3점', description: '적절히 사용' },
      { value: 4, label: '4점', description: '최소화 사용' },
      { value: 5, label: '5점', description: '거의 사용 안함' }
    ]
  },
  {
    id: 'plan1',
    category: '공통',
    text: '주제가 참신하고 실제 사용자에게 도움을 줄 수 있는가?',
    options: [
      { value: 1, label: '1점', description: '매우 미흡' },
      { value: 2, label: '2점', description: '미흡' },
      { value: 3, label: '3점', description: '보통' },
      { value: 4, label: '4점', description: '우수' },
      { value: 5, label: '5점', description: '매우 우수' }
    ]
  },
  {
    id: 'present1',
    category: '공통',
    text: '구현 결과와 기획 의도를 효과적으로 연결하여 설명했는가?',
    options: [
      { value: 1, label: '1점', description: '매우 미흡' },
      { value: 2, label: '2점', description: '미흡' },
      { value: 3, label: '3점', description: '보통' },
      { value: 4, label: '4점', description: '우수' },
      { value: 5, label: '5점', description: '매우 우수' }
    ]
  },
  {
    id: 'present2',
    category: '공통',
    text: '아이디어를 명확하고 설득력 있게 발표했는가?',
    options: [
      { value: 1, label: '1점', description: '매우 미흡' },
      { value: 2, label: '2점', description: '미흡' },
      { value: 3, label: '3점', description: '보통' },
      { value: 4, label: '4점', description: '우수' },
      { value: 5, label: '5점', description: '매우 우수' }
    ]
  },
  {
    id: 'present3',
    category: '공통',
    text: '질의응답을 잘 수행했는가?',
    options: [
      { value: 1, label: '1점', description: '매우 미흡' },
      { value: 2, label: '2점', description: '미흡' },
      { value: 3, label: '3점', description: '보통' },
      { value: 4, label: '4점', description: '우수' },
      { value: 5, label: '5점', description: '매우 우수' }
    ]
  }
];

const ModernTeamEvaluation = ({ onComplete }) => {
  const [evaluatorName, setEvaluatorName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [evaluatorType, setEvaluatorType] = useState('');
  const [answers, setAnswers] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  // 진행률 계산 - 팀이 선택되었을 때만 해당 팀의 답변 개수 계산
  const answeredCount = selectedTeam ?
    questions.filter(q => answers[q.id] !== undefined && answers[q.id] !== null).length : 0;
  const totalQuestions = selectedTeam ? questions.length : 0;
  const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  // 알림 표시
  const showAlert = (message, type) => {
    console.log('알림 표시:', message, type); // 디버깅용
    setAlert({ show: true, message, type });

    // 에러 메시지는 더 오래 표시
    const duration = type === 'error' ? 5000 : 3000;

    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, duration);
  };

  // 로컬스토리지에서 불러오기
  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setEvaluatorName(data.evaluatorName || '');
      setSelectedTeam(data.team || '');
      setEvaluatorType(data.evaluatorRole === '심사위원' ? 'judge' : 'member');
      // 명세서에는 scores 구조만 저장되므로 answers는 초기화
      setAnswers({});
    }
  };

  // 점수 계산 함수
  const calculateScores = () => {
    const designQuestions = questions.filter(q => q.category === '디자인');
    const developmentQuestions = questions.filter(q => q.category === '개발');
    const commonQuestions = questions.filter(q => q.category === '공통');

    const designScore = designQuestions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
    const developmentScore = developmentQuestions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
    const commonScore = commonQuestions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);

    return {
      designTotalScore: designScore,
      developmentTotalScore: developmentScore,
      commonTotalScore: commonScore
    };
  };

  // 로컬스토리지 저장
  const saveToLocalStorage = () => {
    const dataToSave = {
      evaluatorName,
      evaluatorRole: evaluatorType === 'judge' ? '심사위원' : '아기사자',
      currentPage: 1, // 1페이지 방식이므로 항상 1
      scores: teams.reduce((acc, team) => {
        if (team.value === selectedTeam) {
          // 현재 선택된 팀의 점수만 계산
          const scores = calculateScores();
          acc[team.value] = {
            design: scores.designTotalScore,
            development: scores.developmentTotalScore,
            common: scores.commonTotalScore
          };
        } else {
          // 다른 팀은 기존 데이터 유지 또는 초기화
          acc[team.value] = {
            design: 0,
            development: 0,
            common: 0
          };
        }
        return acc;
      }, {})
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  };

  // 답변 변경
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: parseInt(value)
    }));

    // 자동 저장
    setTimeout(() => {
      saveToLocalStorage();
    }, 100);
  };

  // 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!evaluatorName.trim()) {
      showAlert('⚠️ 평가자 이름을 입력해주세요!', 'error');
      return;
    }

    if (!selectedTeam) {
      showAlert('⚠️ 팀을 선택해주세요!', 'error');
      return;
    }

    if (!evaluatorType) {
      showAlert('⚠️ 평가자 유형을 선택해주세요!', 'error');
      return;
    }

    if (answeredCount < totalQuestions) {
      showAlert(`⚠️ 모든 항목에 답해주세요! (${answeredCount}/${totalQuestions})`, 'error');
      return;
    }

    if (confirm('정말로 제출하시겠습니까? 제출 후에는 수정할 수 없습니다.')) {
      try {
        const evaluatorRole = evaluatorType === 'judge' ? '심사위원' : '아기사자';
        const teamName = teams.find(t => t.value === selectedTeam)?.name;
        const scores = calculateScores();

        const requestData = {
          teamName: teamName,
          evaluatorRole: evaluatorRole,
          evaluatorName: evaluatorName.trim(),
          designTotalScore: scores.designTotalScore,
          developmentTotalScore: scores.developmentTotalScore,
          commonTotalScore: scores.commonTotalScore
        };

        console.log('제출 데이터:', requestData);

        // API 요청
        console.log('API 요청 시작:', requestData);

        const response = await fetch('https://likelion-backend-415042403981.asia-northeast3.run.app/api/evaluations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData)
        });

        console.log('API 응답 상태:', response.status);

        if (response.ok) {
          const result = await response.json();
          console.log('제출 성공:', result);

          // 제출 성공 후 데이터 초기화
          setEvaluatorName('');
          setSelectedTeam('');
          setEvaluatorType('');
          setAnswers({});

          // 로컬스토리지 정리
          localStorage.removeItem(STORAGE_KEY);

          showAlert('🎉 채점이 성공적으로 제출되었습니다!', 'success');

          // 1.5초 후 결과창으로 이동
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 1500);
        } else {
          let errorMessage = '제출에 실패했습니다.';

          try {
            const errorData = await response.json();
            console.error('서버 에러 응답:', errorData);

            if (response.status === 409) {
              errorMessage = '⚠️ 이미 채점을 완료하셨습니다. 동일한 팀은 중복 평가할 수 없습니다.';
            } else {
              errorMessage = `❌ 제출 실패: ${errorData.message || errorData.error || '서버 오류'}`;
            }
          } catch (jsonError) {
            // JSON 파싱 실패 시 텍스트로 시도
            try {
              const errorText = await response.text();
              console.error('서버 에러 텍스트:', errorText);
              errorMessage = `❌ 서버 오류 (${response.status}): ${errorText}`;
            } catch (textError) {
              console.error('에러 응답 파싱 실패:', textError);
              errorMessage = `❌ 서버 오류 (${response.status}): 응답을 처리할 수 없습니다.`;
            }
          }

          showAlert(errorMessage, 'error');
        }

      } catch (error) {
        console.error('제출 중 오류 발생:', error);
        let errorMessage = '서버와 통신할 수 없습니다. 다시 시도해주세요.';

        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          errorMessage = '백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.';
        } else if (error.message) {
          errorMessage = `오류: ${error.message}`;
        }

        showAlert(`❌ ${errorMessage}`, 'error');
      }
    }
  };

  // 초기 로드
  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  const selectedTeamName = teams.find(t => t.value === selectedTeam)?.name || '';

  return (
    <div className="page-container">
      <div className="header">
        <div className="header-text">
          <h1>🏆 프로젝트 최종 발표 채점</h1>
          <p>각 항목을 신중하게 평가해주세요</p>
        </div>
      </div>

      <div className="content">
        {/* 결과보기 버튼 */}
        <div className="result-view-section">
          <button type="button" className="btn btn-secondary result-view-btn" onClick={onComplete}>
            🏆 현재 결과 확인하기
          </button>
        </div>
        {/* 알림 메시지 */}
        {alert.show && (
          <div className={`alert alert-${alert.type}`}>
            {alert.message}
          </div>
        )}

        {/* 진행률 표시 */}
        <div className="progress-indicator">
          <div className="progress-text">
            진행률: {answeredCount}/{totalQuestions}
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <form id="evaluationForm" onSubmit={handleSubmit}>
          {/* 평가자 정보 선택 */}
          <div className="evaluator-section">
            <h3>📋 평가자 정보</h3>

            <div className="team-selector">
              <label htmlFor="evaluatorName">평가자 이름</label>
              <input
                type="text"
                id="evaluatorName"
                value={evaluatorName}
                onChange={(e) => {
                  setEvaluatorName(e.target.value);
                  saveToLocalStorage();
                }}
                className="form-input"
                placeholder="이름을 입력하세요"
                required
              />
            </div>

            <div className="team-selector">
              <label htmlFor="teamSelect">평가할 팀 선택</label>
              <select
                id="teamSelect"
                value={selectedTeam}
                onChange={(e) => {
                  setSelectedTeam(e.target.value);
                  // 팀이 변경되면 이전 답변 초기화
                  setAnswers({});
                  saveToLocalStorage();
                }}
                required
              >
                <option value="">팀을 선택하세요</option>
                {teams.map((team) => (
                  <option key={team.value} value={team.value}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="evaluator-type">
              <div className="type-option">
                <input
                  type="radio"
                  id="judge"
                  name="evaluatorType"
                  value="judge"
                  checked={evaluatorType === 'judge'}
                  onChange={(e) => {
                    setEvaluatorType(e.target.value);
                    saveToLocalStorage();
                  }}
                  required
                />
                <label htmlFor="judge">
                  ⭐ 심사위원
                </label>
              </div>
              <div className="type-option">
                <input
                  type="radio"
                  id="member"
                  name="evaluatorType"
                  value="member"
                  checked={evaluatorType === 'member'}
                  onChange={(e) => {
                    setEvaluatorType(e.target.value);
                    saveToLocalStorage();
                  }}
                  required
                />
                <label htmlFor="member">
                  👥 아기사자
                </label>
              </div>
            </div>
          </div>

          {/* 선택된 팀 정보 표시 */}
          {selectedTeam && (
            <div className="evaluator-info">
              <p>🎯 평가자: <strong>{evaluatorName || '이름 미입력'}</strong></p>
              <p>🎯 선택된 팀: <strong>{selectedTeamName}</strong></p>
              <p>총 15개 항목에 대해 평가해주세요</p>
            </div>
          )}

          {/* 채점 항목들 - 팀이 선택되었을 때만 표시 */}
          {selectedTeam && (
            <>
              {/* 디자인 분야 */}
              <div className="category-section">
                <h3 className="category-title">🎨 디자인 분야</h3>
                {questions.filter(q => q.category === '디자인').map((question, index) => (
                  <div key={question.id} className="question-section">
                    <div className="question-title">
                      <span className="question-number">{index + 1}</span>
                      <span>{question.text}</span>
                    </div>
                    <div className="score-options">
                      {question.options.map((option) => (
                        <div key={option.value} className="score-option">
                          <input
                            type="radio"
                            id={`q${question.id}_${option.value}`}
                            name={`question${question.id}`}
                            value={option.value}
                            checked={answers[question.id] === option.value}
                            onChange={() => handleAnswerChange(question.id, option.value)}
                            required
                          />
                          <label htmlFor={`q${question.id}_${option.value}`}>
                            {option.label}
                            <br />
                            <small>{option.description}</small>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* 개발 분야 */}
              <div className="category-section">
                <h3 className="category-title">💻 개발 분야</h3>
                {questions.filter(q => q.category === '개발').map((question, index) => (
                  <div key={question.id} className="question-section">
                    <div className="question-title">
                      <span className="question-number">{5 + index + 1}</span>
                      <span>{question.text}</span>
                    </div>
                    <div className="score-options">
                      {question.options.map((option) => (
                        <div key={option.value} className="score-option">
                          <input
                            type="radio"
                            id={`q${question.id}_${option.value}`}
                            name={`question${question.id}`}
                            value={option.value}
                            checked={answers[question.id] === option.value}
                            onChange={() => handleAnswerChange(question.id, option.value)}
                            required
                          />
                          <label htmlFor={`q${question.id}_${option.value}`}>
                            {option.label}
                            <br />
                            <small>{option.description}</small>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* 공통 분야 */}
              <div className="category-section">
                <h3 className="category-title">🌐 공통 분야</h3>
                {questions.filter(q => q.category === '공통').map((question, index) => (
                  <div key={question.id} className="question-section">
                    <div className="question-title">
                      <span className="question-number">{12 + index + 1}</span>
                      <span>{question.text}</span>
                    </div>
                    <div className="score-options">
                      {question.options.map((option) => (
                        <div key={option.value} className="score-option">
                          <input
                            type="radio"
                            id={`q${question.id}_${option.value}`}
                            name={`question${question.id}`}
                            value={option.value}
                            checked={answers[question.id] === option.value}
                            onChange={() => handleAnswerChange(question.id, option.value)}
                            required
                          />
                          <label htmlFor={`q${question.id}_${option.value}`}>
                            {option.label}
                            <br />
                            <small>{option.description}</small>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="button-group">
            <button type="submit" className="btn btn-submit-large" disabled={!selectedTeam}>
              ✅ 최종 제출
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModernTeamEvaluation;