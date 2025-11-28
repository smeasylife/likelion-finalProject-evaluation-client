import React, { useState } from 'react';
import './ResetPage.css';

function ResetPage() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const handleResetClick = () => {
    setShowConfirmation(true);
  };

  const handleNoClick = () => {
    setShowConfirmation(false);
  };

  const handleYesClick = async () => {
    setIsResetting(true);
    setResetMessage('');
    try {
      const response = await fetch('https://likelion-backend-415042403981.asia-northeast3.run.app/api/evaluations', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Handle 204 No Content (successful reset)
      if (response.status === 204) {
        setResetMessage('✅ 모든 채점 데이터가 성공적으로 초기화되었습니다.');
        // Clear local storage as well
        localStorage.clear();
        // Redirect to main page after 2 seconds
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }  else {
        // Try to parse error response, fallback to status text
        let errorMessage = '서버 오류';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || '서버 오류';
        } catch {
          errorMessage = response.statusText || '서버 오류';
        }
        setResetMessage(`❌ 초기화 실패: ${errorMessage}`);
      }
    } catch (error) {
      setResetMessage(`❌ 초기화 실패: 서버와 연결할 수 없습니다`);
    } finally {
      setIsResetting(false);
      setShowConfirmation(false);
    }
  };

  return (
    <div className="reset-page">
      <div className="reset-container">
        <h1>🗑️ 채점 데이터 초기화</h1>

        <div className="reset-description">
          <h2>기능 설명</h2>
          <p>이 페이지는 모든 채점 데이터를 초기화하는 기능을 제공합니다.</p>
          <ul>
            <li>모든 평가자의 채점 기록 삭제</li>
            <li>팀별 점수 및 순위 초기화</li>
            <li>로컬 저장소 데이터 정리</li>
          </ul>
          <div className="warning-box">
            <strong>⚠️ 경고:</strong> 이 작업은 되돌릴 수 없으며, 모든 데이터가 영구적으로 삭제됩니다.
          </div>
        </div>

        <button
          className="reset-button"
          onClick={handleResetClick}
          disabled={isResetting}
        >
          {isResetting ? '초기화 중...' : '🗑️ 채점 데이터 초기화'}
        </button>

        {resetMessage && (
          <div className={`reset-message ${resetMessage.includes('성공') ? 'success' : 'error'}`}>
            {resetMessage}
          </div>
        )}

        <a href="/" className="back-link">← 메인 화면으로 돌아가기</a>

        {showConfirmation && (
          <div className="confirmation-overlay">
            <div className="confirmation-dialog">
              <h3>⚠️ 정말 초기화하시겠습니까?</h3>
              <p>모든 채점 데이터가 영구적으로 삭제됩니다.</p>
              <p>이 작업은 되돌릴 수 없습니다.</p>

              <div className="confirmation-buttons">
                <button
                  className="confirm-yes"
                  onClick={handleYesClick}
                  disabled={isResetting}
                >
                  {isResetting ? '처리 중...' : '예, 초기화합니다'}
                </button>
                <button className="confirm-no" onClick={handleNoClick}>
                  아니요, 취소합니다
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPage;