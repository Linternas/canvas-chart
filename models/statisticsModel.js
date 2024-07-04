export let originalSurvey = null;
export let originalResponse = null;
export let chartData = null;
export let selectedItems = [];
export let currentBarWidths = {};

export function setOriginalSurvey(data) {
  originalSurvey = data;
}

export function setOriginalResponse(data) {
  originalResponse = data;
}

export function setChartData(data) {
  chartData = data;
}

export function setSelectedItems(items) {
  selectedItems = items;
}

export function setCurrentBarWidths(widths) {
  currentBarWidths = widths;
}

/**
 * 질문 목록을 가져온다.
 *
 * @param {String} eventId
 * @param {String} userId
 * @returns
 */
export async function fetchSurvey(eventId, userId) {
  const response = await fetch(`${env.API}`, {
    method: 'GET',
  });
  const data = await response.json();
  return data.payload.blocks;
}

/**
 * 설문 응답 데이터를 가져온다.
 *
 * @param {String} eventId
 * @returns
 */
export async function fetchSurveyAnswer(eventId) {
  try {
    const response = await fetch(`${env.API}`, {
      method: 'GET',
    });

    const data = await response.json();

    data.payload.forEach((record) => {
      Object.keys(record.value).forEach((key) => {
        let value = record.value[key];
        if (value === null) {
          record.value[key] = [];
        } else {
          if (!Array.isArray(value)) {
            value = [value];
          }

          record.value[key] = value
            .map((v) => {
              if (typeof v === 'string' && !isNaN(v) && !isNaN(parseInt(v, 10))) {
                return parseInt(v, 10);
              }
              return v;
            })
            // 배열 안에 null이 있는 경우 필터링
            .filter((v) => v !== null && Number.isInteger(v));
        }
      });
    });

    return data.payload;
  } catch (error) {
    console.error('fetchSurveyAnswer error:', error);
  }
}

/**
 *
 * 차트를 그리기 위해 질문 목록, 응답 데이터를 하나의 데이터로 정리 후 리턴
 *
 * @param {Object} survey : 질문 목록
 * @param {Array} response : 응답 데이터
 * @returns
 */
export function organizeData(survey, response) {
  const surveyData = survey
    .filter((block) => block.block_type === 'select')
    .map((block) => {
      return {
        id: block.id,
        title: block.option.title,
        items: block.option.items.slice(),
        answers: Array.from({ length: block.option.items.length }).fill(0),
        totalAnswerCount: 0,
      };
    });

  const surveyMap = surveyData.reduce((acc, cur, index) => {
    acc[cur.id] = index;
    return acc;
  }, {});

  response.forEach((res) => {
    Object.keys(res.value).forEach((key) => {
      const index = surveyMap[key];
      if (index !== undefined) {
        res.value[key].forEach((answer) => {
          if (answer <= surveyData[index].answers.length - 1) {
            surveyData[index].answers[answer] += 1;
            surveyData[index].totalAnswerCount += 1;
          }
        });
      }
    });
  });

  return surveyData;
}

