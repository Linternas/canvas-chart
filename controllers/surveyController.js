import { fetchSurvey, setEventId, setUserId, setSurveyData } from '../models/surveyModel.js';
import { renderSurvey } from '../views/surveyView.js';

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
  setEventId(queryString.event_id);
  setUserId(queryString.user_id);

  if (queryString.event_id && queryString.user_id) {
    const survey = await fetchSurvey(queryString.event_id, queryString.user_id);
    setSurveyData(survey);
    renderSurvey(survey);
  }
}

window.addEventListener('DOMContentLoaded', init);
