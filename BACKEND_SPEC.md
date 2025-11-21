# 멋사 13기 프로젝트 최종 발표 채점 시스템 - 백엔드 명세서

## 1. 시스템 개요

본 백엔드 시스템은 멋사 13기 4개 팀의 최종 발표 채점을 위한 API 서비스입니다. 심사위원과 아기사자들이 각 팀을 15개 항목(디자인 5개, 개발 7개, 공통 3개)에 대해 1-5점으로 평가하며, 평가 결과를 집계하여 순위를 산출합니다.

## 2. 기술 스택

- **언어**: Java 17+
- **프레임워크**: Spring Boot 3.x
- **데이터베이스**: MySQL 8.0+
- **ORM**: Spring Data JPA
- **검증**: Spring Validation
- **예외 처리**: Spring Boot Exception Handling

## 3. 데이터베이스 설계

### 3.1 팀 정보 테이블 (teams)

```sql
CREATE TABLE teams (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    team_id VARCHAR(50) NOT NULL UNIQUE,
    team_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 초기 데이터
INSERT INTO teams (team_id, team_name) VALUES
('team1', '1팀 - TimeWizard'),
('team2', '2팀 - Grocering'),
('team3', '3팀 - StudyHub'),
('team4', '4팀 - CodeShare');
```

### 3.2 평가 항목 테이블 (questions)

```sql
CREATE TABLE questions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    question_id VARCHAR(50) NOT NULL UNIQUE,
    category VARCHAR(20) NOT NULL,  -- '디자인', '개발', '공통'
    question_text TEXT NOT NULL,
    display_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 초기 데이터 (15개 항목)
INSERT INTO questions (question_id, category, question_text, display_order) VALUES
-- 디자인 분야 (5개)
('design1', '디자인', '문제 해결을 적절한 디자인으로 구현했는가?', 1),
('design2', '디자인', '디자인의 톤앤매너가 콘셉트와 주제에 부합하는가?', 2),
('design3', '디자인', '사용자 친화적인 UI/UX를 설계했는가?', 3),
('design4', '디자인', '개발자와 원활한 협업(디자인 전달·QA)을 통해 의도한 디자인이 구현되었는가?', 4),
('design5', '디자인', '개발과의 협업이 용이하도록 실용적인 디자인 시스템을 만들었는가?', 5),

-- 개발 분야 (7개)
('dev1', '개발', '실제 서비스가 배포되었는가?', 6),
('dev2', '개발', '프로젝트 구조를 알맞게 활용하였는가?', 7),
('dev3', '개발', '의도에 맞춰 개발을 진행하였는가?', 8),
('dev4', '개발', '협업(파트 간·팀 내) 과정에서 충분한 노력을 기울였는가?', 9),
('dev5', '개발', '결과물의 완성도와 안정성은 어떤가?', 10),
('dev6', '개발', '코드가 재사용성과 유지보수성을 고려해 작성되었는가?', 11),
('dev7', '개발', '과도한 AI 코딩을 사용하지 않았는가?', 12),

-- 공통 분야 (3개)
('plan1', '공통', '주제가 참신하고 실제 사용자에게 도움을 줄 수 있는가?', 13),
('present1', '공통', '구현 결과와 기획 의도를 효과적으로 연결하여 설명했는가?', 14),
('present2', '공통', '아이디어를 명확하고 설득력 있게 발표했는가?', 15);
```

### 3.3 평가 데이터 테이블 (evaluations)

```sql
CREATE TABLE evaluations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    evaluator_name VARCHAR(100) NOT NULL,
    evaluator_role VARCHAR(50) NOT NULL COMMENT '심사위원 or 아기사자',
    team_id VARCHAR(50) NOT NULL,

    -- 15개 항목별 점수 (1-5점)
    design1_score INT NOT NULL CHECK (design1_score BETWEEN 1 AND 5),
    design2_score INT NOT NULL CHECK (design2_score BETWEEN 1 AND 5),
    design3_score INT NOT NULL CHECK (design3_score BETWEEN 1 AND 5),
    design4_score INT NOT NULL CHECK (design4_score BETWEEN 1 AND 5),
    design5_score INT NOT NULL CHECK (design5_score BETWEEN 1 AND 5),

    dev1_score INT NOT NULL CHECK (dev1_score BETWEEN 1 AND 5),
    dev2_score INT NOT NULL CHECK (dev2_score BETWEEN 1 AND 5),
    dev3_score INT NOT NULL CHECK (dev3_score BETWEEN 1 AND 5),
    dev4_score INT NOT NULL CHECK (dev4_score BETWEEN 1 AND 5),
    dev5_score INT NOT NULL CHECK (dev5_score BETWEEN 1 AND 5),
    dev6_score INT NOT NULL CHECK (dev6_score BETWEEN 1 AND 5),
    dev7_score INT NOT NULL CHECK (dev7_score BETWEEN 1 AND 5),

    plan1_score INT NOT NULL CHECK (plan1_score BETWEEN 1 AND 5),
    present1_score INT NOT NULL CHECK (present1_score BETWEEN 1 AND 5),
    present2_score INT NOT NULL CHECK (present2_score BETWEEN 1 AND 5),

    -- 카테고리별 총점
    design_total INT NOT NULL GENERATED ALWAYS AS (
        design1_score + design2_score + design3_score + design4_score + design5_score
    ) STORED,

    development_total INT NOT NULL GENERATED ALWAYS AS (
        dev1_score + dev2_score + dev3_score + dev4_score + dev5_score + dev6_score + dev7_score
    ) STORED,

    common_total INT NOT NULL GENERATED ALWAYS AS (
        plan1_score + present1_score + present2_score
    ) STORED,

    grand_total INT NOT NULL GENERATED ALWAYS AS (
        design_total + development_total + common_total
    ) STORED,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- 외래키 제약조건
    FOREIGN KEY (team_id) REFERENCES teams(team_id),

    -- 인덱스
    INDEX idx_team_id (team_id),
    INDEX idx_evaluator_role (evaluator_role),
    INDEX idx_evaluator_name (evaluator_name),

    -- 중복 평가 방지 (같은 사람이 같은 팀을 중복 평가 불가)
    UNIQUE KEY uk_evaluator_team (evaluator_name, team_id)
);
```

## 4. API 명세

### 4.1 평가 제출 API

**엔드포인트**: `POST /api/evaluations`

**설명**: 프론트엔드의 `handleSubmit` 함수에서 호출되는 API로, 평가자가 4개 팀에 대해 평가한 15개 항목의 점수를 저장합니다.

**Request Body**:
```json
{
  "evaluatorName": "홍길동",
  "evaluatorRole": "심사위원",
  "team": "team1",
  "answers": {
    "design1": 5,
    "design2": 4,
    "design3": 5,
    "design4": 4,
    "design5": 4,
    "dev1": 5,
    "dev2": 4,
    "dev3": 5,
    "dev4": 4,
    "dev5": 4,
    "dev6": 4,
    "dev7": 5,
    "plan1": 5,
    "present1": 4,
    "present2": 5
  }
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "채점이 성공적으로 제출되었습니다.",
  "evaluationId": 123,
  "submittedAt": "2024-11-21T10:30:00Z"
}
```

**Error Responses**:

- 409 Conflict (중복 평가):
```json
{
  "success": false,
  "error": "DUPLICATE_EVALUATION",
  "message": "이미 해당 팀에 대한 채점을 완료하셨습니다."
}
```

- 400 Bad Request (잘못된 데이터):
```json
{
  "success": false,
  "error": "INVALID_INPUT",
  "message": "입력값이 올바르지 않습니다.",
  "details": {
    "field": "design1",
    "reason": "1에서 5 사이의 값이어야 합니다."
  }
}
```

### 4.2 결과 조회 API

**엔드포인트**: `GET /api/results`

**설명**: `ResultPage.jsx`에서 호출되는 API로, 모든 팀의 평가 결과를 집계하여 순위별로 조회합니다.

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "lastUpdated": "2024-11-21T10:30:00Z",
    "totalEvaluations": 48,
    "judgeCount": 12,
    "memberCount": 36,
    "results": [
      {
        "rank": 1,
        "teamId": "team2",
        "teamName": "2팀 - Grocering",
        "judgeTotal": 168,
        "memberTotal": 152,
        "grandTotal": 320,
        "breakdown": {
          "design": {
            "judgeScore": 56,
            "memberScore": 48,
            "total": 104
          },
          "development": {
            "judgeScore": 56,
            "memberScore": 52,
            "total": 108
          },
          "common": {
            "judgeScore": 56,
            "memberScore": 52,
            "total": 108
          }
        }
      },
      {
        "rank": 2,
        "teamId": "team1",
        "teamName": "1팀 - TimeWizard",
        "judgeTotal": 160,
        "memberTotal": 144,
        "grandTotal": 304,
        "breakdown": {
          "design": {
            "judgeScore": 52,
            "memberScore": 48,
            "total": 100
          },
          "development": {
            "judgeScore": 56,
            "memberScore": 48,
            "total": 104
          },
          "common": {
            "judgeScore": 52,
            "memberScore": 48,
            "total": 100
          }
        }
      }
    ]
  }
}
```

**Error Response** (500 Internal Server Error):
```json
{
  "success": false,
  "error": "SERVER_ERROR",
  "message": "서버 오류가 발생했습니다."
}
```

## 5. 백엔드 구현 요구사항

### 5.1 Controller Layer

```java
@RestController
@RequestMapping("/api")
@Slf4j
public class EvaluationController {

    private final EvaluationService evaluationService;
    private final ResultService resultService;

    @PostMapping("/evaluations")
    public ResponseEntity<ApiResponse<EvaluationResponse>> submitEvaluation(
            @Valid @RequestBody EvaluationRequest request) {
        try {
            EvaluationResponse response = evaluationService.submitEvaluation(request);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (DuplicateEvaluationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error("DUPLICATE_EVALUATION", e.getMessage()));
        } catch (ValidationException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("INVALID_INPUT", e.getMessage()));
        }
    }

    @GetMapping("/results")
    public ResponseEntity<ApiResponse<ResultResponse>> getResults() {
        try {
            ResultResponse response = resultService.getResults();
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (Exception e) {
            log.error("Failed to get results", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("SERVER_ERROR", "서버 오류가 발생했습니다."));
        }
    }
}
```

### 5.2 Service Layer

```java
@Service
@Transactional
@Slf4j
public class EvaluationService {

    private final EvaluationRepository evaluationRepository;
    private final TeamRepository teamRepository;

    public EvaluationResponse submitEvaluation(EvaluationRequest request) {
        // 1. 팀 존재 여부 확인
        Team team = teamRepository.findByTeamId(request.getTeam())
                .orElseThrow(() -> new ValidationException("존재하지 않는 팀입니다."));

        // 2. 중복 평가 확인
        if (evaluationRepository.existsByEvaluatorNameAndTeamId(
                request.getEvaluatorName(), request.getTeam())) {
            throw new DuplicateEvaluationException("이미 해당 팀에 대한 채점을 완료하셨습니다.");
        }

        // 3. 평가 데이터 생성
        Evaluation evaluation = Evaluation.builder()
                .evaluatorName(request.getEvaluatorName())
                .evaluatorRole(request.getEvaluatorRole())
                .team(team)
                // 15개 항목 점수 매핑
                .design1Score(request.getAnswers().get("design1"))
                .design2Score(request.getAnswers().get("design2"))
                .design3Score(request.getAnswers().get("design3"))
                .design4Score(request.getAnswers().get("design4"))
                .design5Score(request.getAnswers().get("design5"))
                .dev1Score(request.getAnswers().get("dev1"))
                .dev2Score(request.getAnswers().get("dev2"))
                .dev3Score(request.getAnswers().get("dev3"))
                .dev4Score(request.getAnswers().get("dev4"))
                .dev5Score(request.getAnswers().get("dev5"))
                .dev6Score(request.getAnswers().get("dev6"))
                .dev7Score(request.getAnswers().get("dev7"))
                .plan1Score(request.getAnswers().get("plan1"))
                .present1Score(request.getAnswers().get("present1"))
                .present2Score(request.getAnswers().get("present2"))
                .build();

        // 4. 저장
        Evaluation savedEvaluation = evaluationRepository.save(evaluation);

        log.info("Evaluation submitted: {} evaluated {} with role {}",
                request.getEvaluatorName(), request.getTeam(), request.getEvaluatorRole());

        return EvaluationResponse.builder()
                .evaluationId(savedEvaluation.getId())
                .submittedAt(savedEvaluation.getCreatedAt())
                .build();
    }
}

@Service
@Transactional(readOnly = true)
@Slf4j
public class ResultService {

    private final EvaluationRepository evaluationRepository;
    private final TeamRepository teamRepository;

    public ResultResponse getResults() {
        // 1. 모든 팀 조회
        List<Team> teams = teamRepository.findAllByOrderByTeamId();
        List<TeamResult> teamResults = new ArrayList<>();

        // 2. 각 팀별 결과 계산
        for (Team team : teams) {
            TeamResult result = calculateTeamResult(team);
            teamResults.add(result);
        }

        // 3. 총점 기준 내림차순 정렬 및 순위 부여
        teamResults.sort((a, b) -> b.getGrandTotal().compareTo(a.getGrandTotal()));
        assignRanks(teamResults);

        // 4. 통계 정보 계산
        EvaluationStatistics statistics = calculateStatistics();

        return ResultResponse.builder()
                .lastUpdated(LocalDateTime.now())
                .totalEvaluations(statistics.getTotalEvaluations())
                .judgeCount(statistics.getJudgeCount())
                .memberCount(statistics.getMemberCount())
                .results(teamResults)
                .build();
    }

    private TeamResult calculateTeamResult(Team team) {
        // 해당 팀의 모든 평가 데이터 조회
        List<Evaluation> evaluations = evaluationRepository.findByTeamIdOrderByCreatedAt(team.getTeamId());

        // 심사위원과 아기사자로 분리
        List<Evaluation> judgeEvaluations = evaluations.stream()
                .filter(e -> "심사위원".equals(e.getEvaluatorRole()))
                .collect(Collectors.toList());

        List<Evaluation> memberEvaluations = evaluations.stream()
                .filter(e -> "아기사자".equals(e.getEvaluatorRole()))
                .collect(Collectors.toList());

        // 카테고리별 점수 합산
        int judgeDesignTotal = judgeEvaluations.stream()
                .mapToInt(Evaluation::getDesignTotal)
                .sum();
        int judgeDevelopmentTotal = judgeEvaluations.stream()
                .mapToInt(Evaluation::getDevelopmentTotal)
                .sum();
        int judgeCommonTotal = judgeEvaluations.stream()
                .mapToInt(Evaluation::getCommonTotal)
                .sum();

        int memberDesignTotal = memberEvaluations.stream()
                .mapToInt(Evaluation::getDesignTotal)
                .sum();
        int memberDevelopmentTotal = memberEvaluations.stream()
                .mapToInt(Evaluation::getDevelopmentTotal)
                .sum();
        int memberCommonTotal = memberEvaluations.stream()
                .mapToInt(Evaluation::getCommonTotal)
                .sum();

        return TeamResult.builder()
                .teamId(team.getTeamId())
                .teamName(team.getTeamName())
                .judgeTotal(judgeDesignTotal + judgeDevelopmentTotal + judgeCommonTotal)
                .memberTotal(memberDesignTotal + memberDevelopmentTotal + memberCommonTotal)
                .grandTotal(judgeDesignTotal + judgeDevelopmentTotal + judgeCommonTotal +
                           memberDesignTotal + memberDevelopmentTotal + memberCommonTotal)
                .breakdown(ScoreBreakdown.builder()
                        .design(CategoryScore.builder()
                                .judgeScore(judgeDesignTotal)
                                .memberScore(memberDesignTotal)
                                .total(judgeDesignTotal + memberDesignTotal)
                                .build())
                        .development(CategoryScore.builder()
                                .judgeScore(judgeDevelopmentTotal)
                                .memberScore(memberDevelopmentTotal)
                                .total(judgeDevelopmentTotal + memberDevelopmentTotal)
                                .build())
                        .common(CategoryScore.builder()
                                .judgeScore(judgeCommonTotal)
                                .memberScore(memberCommonTotal)
                                .total(judgeCommonTotal + memberCommonTotal)
                                .build())
                        .build())
                .build();
    }
}
```

### 5.3 DTO Classes

```java
// Request DTO
@Data
@Builder
public class EvaluationRequest {
    @NotBlank(message = "평가자 이름은 필수입니다.")
    private String evaluatorName;

    @NotBlank(message = "평가자 유형은 필수입니다.")
    private String evaluatorRole;

    @NotBlank(message = "팀 선택은 필수입니다.")
    private String team;

    @Valid
    @NotNull(message = "평가 답변은 필수입니다.")
    private Map<String, @Min(1) @Max(5) Integer> answers;
}

// Response DTOs
@Data
@Builder
public class EvaluationResponse {
    private Long evaluationId;
    private LocalDateTime submittedAt;
}

@Data
@Builder
public class ResultResponse {
    private LocalDateTime lastUpdated;
    private Integer totalEvaluations;
    private Integer judgeCount;
    private Integer memberCount;
    private List<TeamResult> results;
}

@Data
@Builder
public class TeamResult {
    private Integer rank;
    private String teamId;
    private String teamName;
    private Integer judgeTotal;
    private Integer memberTotal;
    private Integer grandTotal;
    private ScoreBreakdown breakdown;
}

@Data
@Builder
public class ScoreBreakdown {
    private CategoryScore design;
    private CategoryScore development;
    private CategoryScore common;
}

@Data
@Builder
public class CategoryScore {
    private Integer judgeScore;
    private Integer memberScore;
    private Integer total;
}

// Common API Response
@Data
@Builder
public class ApiResponse<T> {
    private Boolean success;
    private String error;
    private String message;
    private T data;

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .build();
    }

    public static <T> ApiResponse<T> error(String error, String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .error(error)
                .message(message)
                .build();
    }
}
```

### 5.4 Exception Handling

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(DuplicateEvaluationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDuplicateEvaluation(DuplicateEvaluationException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.error("DUPLICATE_EVALUATION", e.getMessage()));
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(ValidationException e) {
        return ResponseEntity.badRequest()
                .body(ApiResponse.error("INVALID_INPUT", e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationErrors(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));

        return ResponseEntity.badRequest()
                .body(ApiResponse.error("VALIDATION_ERROR", message));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneralException(Exception e) {
        log.error("Unexpected error occurred", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("SERVER_ERROR", "서버 오류가 발생했습니다."));
    }
}
```

## 6. 배포 및 실행 요구사항

### 6.1 환경 설정

```yaml
# application.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/evaluation_system
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD:password}
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.MySQLDialect

server:
  port: 8080

logging:
  level:
    com.example.evaluation: DEBUG
```

### 6.2 초기 데이터 설정

```sql
-- 애플리케이션 시작 시 실행될 초기 데이터 SQL
-- teams 테이블 데이터와 questions 테이블 데이터가 자동으로 삽입되어야 함
```

### 6.3 CORS 설정

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")  // Vite 개발 서버
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

## 7. 테스트 요구사항

### 7.1 단위 테스트

- EvaluationService 테스트 (정상 제출, 중복 제출, 유효성 검사)
- ResultService 테스트 (결과 계산, 순위 부여)
- Repository 테스트 (데이터 저장, 조회)

### 7.2 통합 테스트

- API 엔드포인트 테스트 (/api/evaluations, /api/results)
- 데이터베이스 연동 테스트
- 예외 처리 테스트

### 7.3 테스트 데이터

```java
@SpringBootTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
class EvaluationServiceTest {

    @Test
    void 중복_평가_예외_처리() {
        // given
        EvaluationRequest request = createTestRequest();
        evaluationService.submitEvaluation(request);

        // when & then
        assertThatThrownBy(() -> evaluationService.submitEvaluation(request))
                .isInstanceOf(DuplicateEvaluationException.class)
                .hasMessage("이미 해당 팀에 대한 채점을 완료하셨습니다.");
    }
}
```

## 8. 프론트엔드 연동 포인트

### 8.1 현재 프론트엔드 코드와의 연동

1. **ModernTeamEvaluation.jsx handleSubmit 함수**:
   - 현재 주석 처리된 부분을 실제 API 호출로 변경
   - `POST /api/evaluations` 엔드포인트로 데이터 전송
   - 성공 시 결과 페이지로 이동, 실패 시 에러 메시지 표시

2. **ResultPage.jsx useEffect 함수**:
   - `GET /api/results` 엔드포인트로 데이터 요청
   - 받은 데이터를 현재 UI 형식에 맞게 표시

### 8.2 데이터 형식 매핑

- 프론트엔드의 `answers` 객체 → 백엔드의 15개 개별 점수 필드
- 프론트엔드의 평가자 유형 → 백엔드의 evaluator_role 필드
- 백엔드의 집계 결과 → 프론트엔드의 result-item UI 형식

이 백엔드 명세서는 현재 구현된 프론트엔드 코드를 기반으로 작성되었으며, 주석 처리된 API 호출 부분을 실제 동작하도록 구현하는 데 필요한 모든 정보를 포함하고 있습니다.