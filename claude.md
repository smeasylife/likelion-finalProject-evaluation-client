# 멋사 13기 프로젝트 최종 발표 채점 시스템

## 1. 시스템 개요

4개 팀의 프로젝트를 디자인/개발/공통 3개 분야로 평가하는 시스템

## 2. 채점 구조

### 2.1 평가 분야
1. **디자인 분야** - UI/UX, 디자인 완성도
2. **개발 분야** - 코드 품질, 기술 구현
3. **공통 분야** - 프로젝트 완성도, 발표력

### 2.2 평가자 구분
- **심사위원**
- **아기사자** (일반 동아리원)

## 3. 화면 구성

### 3.1 초기 정보 입력 페이지

```
┌─────────────────────────────────┐
│  멋사 13기 최종 발표 채점       │
├─────────────────────────────────┤
│                                  │
│  이름: [_________]              │
│                                  │
│  역할:                           │
│  ○ 심사위원                      │
│  ○ 아기사자                      │
│                                  │
│  [다음 →]                        │
└─────────────────────────────────┘
```

### 3.2 디자인 분야 채점 페이지

```
┌─────────────────────────────────┐
│  디자인 분야 채점 (1/3)         │
│  평가자: 홍길동 (심사위원)      │
├─────────────────────────────────┤
│                                  │
│  1팀 - TimeWizard               │
│  [1] [2] [3] [4] [5]            │
│                                  │
│  2팀 - Grocering                │
│  [1] [2] [3] [4] [5]            │
│                                  │
│  3팀 - StudyHub                 │
│  [1] [2] [3] [4] [5]            │
│                                  │
│  4팀 - CodeShare                │
│  [1] [2] [3] [4] [5]            │
│                                  │
│  [← 이전]      [다음 →]         │
└─────────────────────────────────┘
```

### 3.3 개발 분야 채점 페이지

```
┌─────────────────────────────────┐
│  개발 분야 채점 (2/3)           │
│  평가자: 홍길동 (심사위원)      │
├─────────────────────────────────┤
│                                  │
│  1팀 - TimeWizard               │
│  [1] [2] [3] [4] [5]            │
│                                  │
│  2팀 - Grocering                │
│  [1] [2] [3] [4] [5]            │
│                                  │
│  3팀 - StudyHub                 │
│  [1] [2] [3] [4] [5]            │
│                                  │
│  4팀 - CodeShare                │
│  [1] [2] [3] [4] [5]            │
│                                  │
│  [← 이전]      [다음 →]         │
└─────────────────────────────────┘
```

### 3.4 공통 분야 채점 페이지

```
┌─────────────────────────────────┐
│  공통 분야 채점 (3/3)           │
│  평가자: 홍길동 (심사위원)      │
├─────────────────────────────────┤
│                                  │
│  1팀 - TimeWizard               │
│  [1] [2] [3] [4] [5]            │
│                                  │
│  2팀 - Grocering                │
│  [1] [2] [3] [4] [5]            │
│                                  │
│  3팀 - StudyHub                 │
│  [1] [2] [3] [4] [5]            │
│                                  │
│  4팀 - CodeShare                │
│  [1] [2] [3] [4] [5]            │
│                                  │
│  [← 이전]      [최종 제출]      │
└─────────────────────────────────┘
```

### 3.5 결과 공개 페이지

```
┌─────────────────────────────────────────────────┐
│  최종 발표 채점 결과                            │
├─────────────────────────────────────────────────┤
│                                                  │
│  1위 🏆 2팀 - Grocering                         │
│  ├ 심사위원 점수: 42점                          │
│  ├ 아기사자 점수: 38점                          │
│  └ 총점: 80점                                   │
│    • 디자인: 28점 (심사 14 + 아기사자 14)       │
│    • 개발: 26점 (심사 13 + 아기사자 13)         │
│    • 공통: 26점 (심사 13 + 아기사자 13)         │
│                                                  │
│  2위 🥈 1팀 - TimeWizard                        │
│  ├ 심사위원 점수: 40점                          │
│  ├ 아기사자 점수: 36점                          │
│  └ 총점: 76점                                   │
│    • 디자인: 25점 (심사 13 + 아기사자 12)       │
│    • 개발: 26점 (심사 14 + 아기사자 12)         │
│    • 공통: 25점 (심사 13 + 아기사자 12)         │
│                                                  │
│  3위 🥉 3팀 - StudyHub                          │
│  ...                                             │
│                                                  │
└─────────────────────────────────────────────────┘
```

## 4. 데이터 구조

### 4.1 프론트엔드 → 백엔드 (채점 제출)

```json
{
  "evaluatorName": "홍길동",
  "evaluatorRole": "심사위원",
  "scores": {
    "team1": {
      "design": 5,
      "development": 4,
      "common": 5
    },
    "team2": {
      "design": 4,
      "development": 5,
      "common": 4
    },
    "team3": {
      "design": 3,
      "development": 4,
      "common": 4
    },
    "team4": {
      "design": 4,
      "development": 3,
      "common": 4
    }
  }
}
```

### 4.2 백엔드 → 프론트엔드 (결과 조회)

```json
{
  "results": [
    {
      "rank": 1,
      "teamId": "team2",
      "teamName": "Grocering",
      "judgeTotal": 42,
      "memberTotal": 38,
      "grandTotal": 80,
      "breakdown": {
        "design": {
          "judgeScore": 14,
          "memberScore": 14,
          "total": 28
        },
        "development": {
          "judgeScore": 13,
          "memberScore": 13,
          "total": 26
        },
        "common": {
          "judgeScore": 13,
          "memberScore": 13,
          "total": 26
        }
      }
    },
    {
      "rank": 2,
      "teamId": "team1",
      "teamName": "TimeWizard",
      "judgeTotal": 40,
      "memberTotal": 36,
      "grandTotal": 76,
      "breakdown": {
        "design": {
          "judgeScore": 13,
          "memberScore": 12,
          "total": 25
        },
        "development": {
          "judgeScore": 14,
          "memberScore": 12,
          "total": 26
        },
        "common": {
          "judgeScore": 13,
          "memberScore": 12,
          "total": 25
        }
      }
    }
  ]
}
```

## 5. 데이터베이스 스키마

### 5.1 팀 정보 테이블

```sql
CREATE TABLE teams (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    team_id VARCHAR(50) NOT NULL UNIQUE,
    team_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO teams (team_id, team_name) VALUES
('team1', 'TimeWizard'),
('team2', 'Grocering'),
('team3', 'StudyHub'),
('team4', 'CodeShare');
```

### 5.2 채점 데이터 테이블

```sql
CREATE TABLE evaluations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    evaluator_name VARCHAR(100) NOT NULL,
    evaluator_role VARCHAR(50) NOT NULL,  -- '심사위원' or '아기사자'
    
    team_id VARCHAR(50) NOT NULL,
    design_score INT NOT NULL CHECK (design_score BETWEEN 1 AND 5),
    development_score INT NOT NULL CHECK (development_score BETWEEN 1 AND 5),
    common_score INT NOT NULL CHECK (common_score BETWEEN 1 AND 5),
    total_score INT NOT NULL,  -- design + development + common
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_team_id (team_id),
    INDEX idx_evaluator_role (evaluator_role),
    
    -- 같은 사람이 같은 팀을 중복 채점하지 못하도록
    UNIQUE KEY uk_evaluator_team (evaluator_name, team_id)
);
```

## 6. API 명세

### 6.1 채점 제출

```
POST /api/evaluations

Request:
{
  "evaluatorName": "홍길동",
  "evaluatorRole": "심사위원",
  "scores": {
    "team1": {
      "design": 5,
      "development": 4,
      "common": 5
    },
    "team2": {
      "design": 4,
      "development": 5,
      "common": 4
    },
    "team3": {
      "design": 3,
      "development": 4,
      "common": 4
    },
    "team4": {
      "design": 4,
      "development": 3,
      "common": 4
    }
  }
}

Response (200 OK):
{
  "message": "채점이 성공적으로 제출되었습니다.",
  "evaluationCount": 4,
  "submittedAt": "2024-11-21T10:30:00Z"
}

Error Response (409 Conflict):
{
  "error": "DUPLICATE_EVALUATION",
  "message": "이미 채점을 완료하셨습니다."
}
```

### 6.2 결과 조회

```
GET /api/results

Response (200 OK):
{
  "lastUpdated": "2024-11-21T10:30:00Z",
  "totalEvaluations": 24,
  "judgeCount": 6,
  "memberCount": 18,
  "results": [
    {
      "rank": 1,
      "teamId": "team2",
      "teamName": "Grocering",
      "judgeTotal": 42,
      "memberTotal": 38,
      "grandTotal": 80,
      "breakdown": {
        "design": {
          "judgeScore": 14,
          "memberScore": 14,
          "total": 28
        },
        "development": {
          "judgeScore": 13,
          "memberScore": 13,
          "total": 26
        },
        "common": {
          "judgeScore": 13,
          "memberScore": 13,
          "total": 26
        }
      }
    }
  ]
}
```

## 7. 백엔드 로직

### 7.1 채점 저장 Service

```java
@Service
public class EvaluationService {
    
    @Transactional
    public void saveEvaluation(EvaluationRequest request) {
        String evaluatorName = request.getEvaluatorName();
        String evaluatorRole = request.getEvaluatorRole();
        
        // 각 팀별로 데이터 저장
        for (Map.Entry<String, TeamScores> entry : 
             request.getScores().entrySet()) {
            
            String teamId = entry.getKey();
            TeamScores scores = entry.getValue();
            
            // 중복 체크
            if (evaluationRepository.existsByEvaluatorNameAndTeamId(
                evaluatorName, teamId)) {
                throw new DuplicateEvaluationException(
                    "이미 채점을 완료하셨습니다."
                );
            }
            
            // 엔티티 생성 및 저장
            Evaluation evaluation = Evaluation.builder()
                .evaluatorName(evaluatorName)
                .evaluatorRole(evaluatorRole)
                .teamId(teamId)
                .designScore(scores.getDesign())
                .developmentScore(scores.getDevelopment())
                .commonScore(scores.getCommon())
                .totalScore(
                    scores.getDesign() + 
                    scores.getDevelopment() + 
                    scores.getCommon()
                )
                .build();
            
            evaluationRepository.save(evaluation);
        }
    }
}
```

### 7.2 결과 조회 Service

```java
@Service
public class ResultService {
    
    public ResultResponse getResults() {
        List<Team> teams = teamRepository.findAll();
        List<ResultDto> results = new ArrayList<>();
        
        for (Team team : teams) {
            // 해당 팀의 모든 채점 데이터 조회
            List<Evaluation> evals = 
                evaluationRepository.findByTeamId(team.getTeamId());
            
            // 심사위원과 아기사자로 분리
            List<Evaluation> judgeEvals = evals.stream()
                .filter(e -> "심사위원".equals(e.getEvaluatorRole()))
                .collect(Collectors.toList());
            
            List<Evaluation> memberEvals = evals.stream()
                .filter(e -> "아기사자".equals(e.getEvaluatorRole()))
                .collect(Collectors.toList());
            
            // 점수 합산
            int judgeDesign = sumScores(judgeEvals, Evaluation::getDesignScore);
            int judgeDevelo = sumScores(judgeEvals, Evaluation::getDevelopmentScore);
            int judgeCommon = sumScores(judgeEvals, Evaluation::getCommonScore);
            int judgeTotal = judgeDesign + judgeDevelo + judgeCommon;
            
            int memberDesign = sumScores(memberEvals, Evaluation::getDesignScore);
            int memberDevelo = sumScores(memberEvals, Evaluation::getDevelopmentScore);
            int memberCommon = sumScores(memberEvals, Evaluation::getCommonScore);
            int memberTotal = memberDesign + memberDevelo + memberCommon;
            
            // DTO 생성
            ResultDto result = ResultDto.builder()
                .teamId(team.getTeamId())
                .teamName(team.getTeamName())
                .judgeTotal(judgeTotal)
                .memberTotal(memberTotal)
                .grandTotal(judgeTotal + memberTotal)
                .breakdown(BreakdownDto.builder()
                    .design(new ScoreBreakdown(
                        judgeDesign, memberDesign, judgeDesign + memberDesign))
                    .development(new ScoreBreakdown(
                        judgeDevelo, memberDevelo, judgeDevelo + memberDevelo))
                    .common(new ScoreBreakdown(
                        judgeCommon, memberCommon, judgeCommon + memberCommon))
                    .build())
                .build();
            
            results.add(result);
        }
        
        // 총점 기준 내림차순 정렬
        results.sort((a, b) -> 
            Integer.compare(b.getGrandTotal(), a.getGrandTotal()));
        
        // 순위 부여
        for (int i = 0; i < results.size(); i++) {
            results.get(i).setRank(i + 1);
        }
        
        return ResultResponse.builder()
            .lastUpdated(LocalDateTime.now())
            .totalEvaluations(evals.size())
            .judgeCount(countJudges())
            .memberCount(countMembers())
            .results(results)
            .build();
    }
    
    private int sumScores(
        List<Evaluation> evals, 
        ToIntFunction<Evaluation> scoreExtractor
    ) {
        return evals.stream()
            .mapToInt(scoreExtractor)
            .sum();
    }
}
```

### 7.3 DTO 클래스

```java
// Request DTO
@Data
public class EvaluationRequest {
    @NotBlank
    private String evaluatorName;
    
    @NotBlank
    private String evaluatorRole;  // "심사위원" or "아기사자"
    
    @NotNull
    private Map<String, TeamScores> scores;
}

@Data
public class TeamScores {
    @Min(1) @Max(5)
    private Integer design;
    
    @Min(1) @Max(5)
    private Integer development;
    
    @Min(1) @Max(5)
    private Integer common;
}

// Response DTO
@Data
@Builder
public class ResultDto {
    private Integer rank;
    private String teamId;
    private String teamName;
    private Integer judgeTotal;
    private Integer memberTotal;
    private Integer grandTotal;
    private BreakdownDto breakdown;
}

@Data
@Builder
public class BreakdownDto {
    private ScoreBreakdown design;
    private ScoreBreakdown development;
    private ScoreBreakdown common;
}

@Data
@AllArgsConstructor
public class ScoreBreakdown {
    private Integer judgeScore;
    private Integer memberScore;
    private Integer total;
}
```

## 8. 프론트엔드 로직

### 8.1 로컬스토리지 구조

```javascript
// 저장되는 데이터 구조
{
  "evaluatorName": "홍길동",
  "evaluatorRole": "심사위원",
  "currentPage": 2,  // 1: 디자인, 2: 개발, 3: 공통
  "scores": {
    "team1": { "design": 5, "development": 4, "common": null },
    "team2": { "design": 4, "development": 5, "common": null },
    "team3": { "design": 3, "development": 4, "common": null },
    "team4": { "design": 4, "development": 3, "common": null }
  }
}
```

### 8.2 페이지 전환 로직

```javascript
function nextPage() {
  const currentPage = getCurrentPage();
  
  // 현재 페이지 점수 검증
  if (!validateCurrentPage(currentPage)) {
    alert('모든 팀에 점수를 입력해주세요!');
    return;
  }
  
  // 로컬스토리지에 저장
  saveToLocalStorage();
  
  if (currentPage === 3) {
    // 최종 제출
    submitEvaluation();
  } else {
    // 다음 페이지로
    showPage(currentPage + 1);
  }
}

function validateCurrentPage(page) {
  const category = ['design', 'development', 'common'][page - 1];
  const scores = getScoresFromForm();
  
  return Object.values(scores).every(
    teamScore => teamScore[category] !== null
  );
}
```

## 9. 개발 체크리스트

### Phase 1 - 기본 기능
- [ ] 4개 화면 UI 구현 (정보입력 + 3개 분야)
- [ ] 로컬스토리지 자동 저장
- [ ] 페이지 전환 로직
- [ ] 백엔드 API 구현
- [ ] DB 테이블 생성

### Phase 2 - 핵심 기능
- [ ] 채점 제출 로직
- [ ] 중복 제출 방지
- [ ] 결과 조회 API
- [ ] 결과 페이지 UI

### Phase 3 - 마무리
- [ ] 에러 처리
- [ ] 유효성 검증
- [ ] 반응형 디자인
- [ ] 테스트

## 10. 주요 특징

✅ **간단한 구조**
- 가중치 계산 없이 단순 합산
- 심사위원 점수 + 아기사자 점수 = 총점

✅ **3개 페이지 분리**
- 디자인 / 개발 / 공통 각각 별도 페이지
- 페이지 이동하면서 순차적으로 채점

✅ **명확한 결과 표시**
- 심사위원 총점과 아기사자 총점 분리 표시
- 분야별 세부 점수도 모두 공개

✅ **자동 저장**
- 페이지 이동할 때마다 로컬스토리지에 저장
- 실수로 새로고침해도 데이터 유지
