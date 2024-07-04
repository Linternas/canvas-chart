import {
  fetchSurvey,
  fetchSurveyAnswer,
  organizeData,
  originalSurvey,
  originalResponse,
  chartData,
  selectedItems,
  currentBarWidths,
  setSelectedItems,
  setChartData,
  setOriginalResponse,
  setOriginalSurvey,
} from '../models/statisticsModel.js';
import { renderStatistics } from '../views/statisticsView.js';

/**
 * event.clientY와 getBoundingClientRect를 이용해 캔버스 내 클릭위치 계산
 * canvas.getBoundingClientRect()는 뷰포트 기준으로 캔버스의 위치와 크기를 반환
 * event.clientY는 뷰포트 기준으로 마우스 클릭 위치를 반환
 *
 * window.devicePixelRatio를 사용해 캔버스의 크기를 보정
 * barHeight가 40이기 때문에 devicePixelRatio를 곱해줌
 */

function handleClick(event, data, ctx) {
  const canvas = event.currentTarget;
  const rect = canvas.getBoundingClientRect();

  const dpr = window.devicePixelRatio || 1;
  const y = (event.clientY - rect.top) * dpr;
  const barHeight = 40 * dpr;

  const clickedIndex = Math.floor(y / barHeight);
  toggleSelection(data, clickedIndex, ctx);
}

/**
 * 클릭시 선택한 항목을 selectedItems에 추가하거나 제거한다.
 */
function toggleSelection(question, index) {
  // 선택된 항목을 고유하게 식별하기 위해 question.id와 index를 결합한 itemKey를 생성합니다.
  const itemKey = `${question.id}:${index}`;

  // 선택된 항목에서 이미 존재하는 경우 제거, 존재하지 않는 경우 추가
  if (selectedItems.includes(itemKey)) {
    setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== itemKey));
  } else {
    selectedItems.push(itemKey);
  }

  // selectedItems를 기반으로 데이터 필터링
  const filtedData = filterDataBySelectedItems();

  // 차트 재렌더링
  renderStatisticsByFilterdData(filtedData);
}

// selectedItems를 기반으로 데이터 필터링
function filterDataBySelectedItems() {
  const selectedQuestions = {};

  // 선택한 항목에 대해서 검사하기 위한 Object 생성
  // 질문 ID별로 선택한 답변에 대한 index를 생성
  selectedItems.forEach((itemKey) => {
    const [questionId, answerIndex] = itemKey.split(':');
    if (!selectedQuestions[questionId]) {
      selectedQuestions[questionId] = [];
    }

    // 10진수로 변환하여 저장
    selectedQuestions[questionId].push(parseInt(answerIndex, 10));
  });

  // originalResponse 배열을 순회하며 선택된 항목과 일치하는 응답만 남김
  const filteredResponse = originalResponse.filter((res) => {
    // selectedQuestions 객체의 모든 질문 ID를 순회
    return Object.keys(selectedQuestions).every((questionId) => {
      // 해당 질문 ID에 대해 선택한 답변 중 하나라도 응답에 포함되어 있으면 true 반환
      return selectedQuestions[questionId].some((answerIndex) => {
        // 응답 데이터에 해당 질문이 존재하고, 선택한 답변이 포함되어 있는지 확인
        return res.value[questionId] && res.value[questionId].includes(answerIndex);
      });
    });
  });

  const filteredSurveyData = organizeData(originalSurvey, filteredResponse);
  console.log(filteredSurveyData)
  return filteredSurveyData;
}

// 필터링 된 데이터로 차트 리렌더링
function renderStatisticsByFilterdData(filtedData) {
  // 선택된 항목이 없는 경우 전체 데이터를 기반으로 차트 렌더링
  if (selectedItems.length === 0) {
    renderStatistics(chartData, selectedItems, currentBarWidths, toggleSelection, handleClick);
    return;
  }

  // 선택된 항목이 있는 경우 필터링된 데이터를 기반으로 차트 렌더링
  renderStatistics(filtedData, selectedItems, currentBarWidths, toggleSelection, handleClick);
}

// url 파라미터 파싱
function parseQueryString() {
  const query = window.location.search.substring(1);
  const pairs = query.split('&');
  const result = {};

  pairs.forEach((pair) => {
    const [key, value] = pair.split('=');
    result[key] = value;
  });

  return result;
}

async function init() {
  const queryString = parseQueryString();

  const survey = await fetchSurvey(queryString.event_id, queryString.event_id);
  const response = await fetchSurveyAnswer(queryString.event_id);

  setOriginalSurvey(survey);
  setOriginalResponse(response);

  let chartData = organizeData(survey, response);

  setChartData(chartData);
  renderStatistics(chartData, selectedItems, currentBarWidths, toggleSelection, handleClick);
}

window.addEventListener('DOMContentLoaded', init);
