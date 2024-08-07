#### 순수 자바스크립트를 사용하여 MVC(Model-View-Controller) 디자인 패턴을 구현한 예제입니다.

### 주요 기능

- 원격 서버에서 설문 질문을 가져와서 표시
- 설문 응답 수집 및 검증
- 응답 데이터를 바 차트 형식으로 시각화
- 애니메이션이 적용된 인터랙티브 차트
- 다양한 화면 크기에 대응하는 반응형 디자인
- 바 차트를 클릭하여 특정 통계를 필터링하고 확인할 수 있습니다.
  

### 코드 구조
MVC 패턴
이 애플리케이션은 MVC(Model-View-Controller) 패턴을 따릅니다:

모델(Model): 데이터와 비즈니스 로직을 관리 (surveyModel.js, statisticsModel.js).  
뷰(View): UI와 프레젠테이션 로직을 관리 (surveyView.js, statisticsView.js).  
컨트롤러(Controller): 모델과 뷰 간의 통신을 관리하고, 사용자 입력을 처리 (surveyController.js, statisticsController.js).  

survey.html: 통계 페이지를 실행하는 html 파일.  
surveyController.js: 사용자 상호작용을 처리하고 모델과 뷰 간의 데이터 흐름을 관리하는 로직을 포함.  
surveyModel.js: 데이터 가져오기 및 처리 로직을 포함.  
surveyView.js: UI를 렌더링하고 DOM을 업데이트하는 로직을 포함.  
survey.css: 애플리케이션 스타일을 정의하는 메인 CSS 파일.  

statistics.html: 통계 페이지를 실행하는 html 파일.  
statisticsController.js: 통계 뷰를 관리하는 로직.  
statisticsModel.js: 통계 데이터를 처리하는 로직.  
statisticsView.js: 통계 UI를 렌더링하는 로직.  
statistics.css: 애플리케이션 스타일을 정의하는 메인 CSS 파일.
