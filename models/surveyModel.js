import { renderSurveyDone } from '../views/surveyView.js';

export let eventId = null;
export let userId = null;
export let surveyData = null;
export let surveySelected = {};

export function setEventId(id) {
  eventId = id;
}

export function setUserId(id) {
  userId = id;
}

export function setSurveyData(data) {
  surveyData = data;
}

export function setSurveySelected(selected) {
  surveySelected = selected;
}

export async function fetchSurvey(eventId, userId) {
  try {
    const response = await fetch(`${env.API}`, {
      method: 'GET',
    });
    const data = await response.json();

    surveySelected = Object.keys(data.payload.blocks).reduce((acc, key) => {
      const block = data.payload.blocks[key];
      if (block.block_type === 'select') {
        acc[block.id] = [];
      }
      return acc;
    }, {});

    return data.payload;
  } catch (error) {
    console.error('fetchSurvey error:', error);
  }
}

export async function postSurvey() {
  if (!validateSurvey(surveyData, surveySelected)) {
    return;
  }

  try {
    const response = await fetch(`${env.API}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        value: surveySelected,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      alert('설문이 완료되었습니다.');
      renderSurveyDone();
    } else {
      if (data.description) {
        alert(data.description);
      }
    }
  } catch (error) {
    alert('제출 중 오류가 발생했습니다.');
    console.error('postSurvey error:', error);
  }
}

export function validateSurvey(surveyData, surveySelected) {
  for (const block of surveyData.blocks) {
    if (block.block_type === 'select') {
      const option = block.option;
      const selectedItems = surveySelected[block.id];

      if (selectedItems.length === 0) {
        alert(`선택하지 않은 항목이 있습니다.\n\n[${option.title}]`);
        return false;
      }

      if (selectedItems.length > Number(option.limit)) {
        alert(`최대 ${option.limit}개까지 선택 가능합니다.\n\n[${option.title}]`);
        return false;
      }
    }
  }

  return true;
}
