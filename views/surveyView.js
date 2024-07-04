import { postSurvey, surveySelected, setSurveySelected } from '../models/surveyModel.js';

export function renderSurvey(survey) {
  const bodyElement = document.getElementsByTagName('body')[0];
  bodyElement.style.backgroundColor = survey.background_color;

  const appElement = document.getElementById('app');

  const surveyContainerElement = document.createElement('div');
  surveyContainerElement.id = 'survey-container';

  const headerElement = document.createElement('header');
  const headerImgElement = document.createElement('img');
  headerImgElement.src = survey.header_img;
  headerImgElement.classList.add('img-survey-header');
  headerElement.appendChild(headerImgElement);
  surveyContainerElement.appendChild(headerElement);

  // render blocks
  survey.blocks.forEach((block) => {
    if (block.block_type === 'select') {
      const option = block.option;

      const surveyBlockElement = document.createElement('div');
      surveyBlockElement.classList.add('survey-block');
      surveyBlockElement.style.marginBottom = option.paddingBottom + 'px';

      const titleElement = document.createElement('p');
      titleElement.textContent = option.title;

      const surveyDividerElement = document.createElement('div');
      surveyDividerElement.classList.add('survey-divider');

      surveyBlockElement.appendChild(titleElement);
      surveyBlockElement.appendChild(surveyDividerElement);

      // 최대 선택 가능한 항목이 1개인 경우 radio
      const surveyFormElement = document.createElement('form');
      surveyFormElement.classList.add('survey-form');

      option.items.forEach((item, index) => {
        const labelElement = document.createElement('label');
        const inputElement = document.createElement('input');
        inputElement.type = Number(option.limit) <= 1 ? 'radio' : 'checkbox';
        inputElement.name = block.id;
        inputElement.value = index;
        labelElement.appendChild(inputElement);
        labelElement.appendChild(document.createTextNode(item));
        surveyFormElement.appendChild(labelElement);

        if (Number(option.limit) <= 1) {
          // 라디오 버튼 이벤트 추가
          inputElement.addEventListener('change', (event) => {
            surveySelected[block.id] = [Number(event.target.value)];
            setSurveySelected(surveySelected);
          });
        } else {
          // 최대 선택 가능한 항목이 2개 이상인 경우 checkbox
          // 체크박스 버튼 이벤트 추가
          inputElement.addEventListener('change', (event) => {
            const checkedBoxes = surveyFormElement.querySelectorAll('input[type="checkbox"]:checked');
            if (checkedBoxes.length > Number(option.limit)) {
              event.target.checked = false;
              alert(`최대 ${option.limit}개까지 선택 가능합니다.`);
            } else {
              surveySelected[block.id] = Array.from(checkedBoxes).map((checkbox) => Number(checkbox.value));
            }
          });
        }
      });

      surveyBlockElement.appendChild(surveyFormElement);
      surveyContainerElement.appendChild(surveyBlockElement);
    } else if (block.block_type === 'image') {
      const imageElement = document.createElement('img');

      imageElement.src = block.option.src;
      imageElement.style.width = block.option.width + '%';
      imageElement.style.marginBottom = block.option.paddingBottom + 'px';
      imageElement.classList.add('survey-image');
      surveyContainerElement.appendChild(imageElement);
    } else if (block.block_type === 'submit') {
      // 설문 완료하기 버튼
      const submitImgElement = document.createElement('img');

      submitImgElement.src = block.option.btnImg;
      submitImgElement.style.width = block.option.width + '%';
      submitImgElement.style.marginBottom = block.option.paddingBottom + 'px';
      submitImgElement.classList.add('btn-survey-submit');
      surveyContainerElement.appendChild(submitImgElement);

      // 클릭 이벤트 추가
      submitImgElement.addEventListener('click', () => {
        postSurvey();
      });
    }
  });

  appElement.appendChild(surveyContainerElement);
}

export function renderSurveyDone() {
  const surveyHeader = document.getElementsByTagName('header')[0];

  const surveyContainerElement = document.getElementById('survey-container');
  surveyContainerElement.innerHTML = '';

  const surveyDoneElement = document.createElement('div');
  surveyDoneElement.classList.add('survey-done-content');
  surveyDoneElement.classList.add('survey-block');

  const surveyDoneTitle = document.createElement('h2');
  surveyDoneTitle.textContent = '설문이 완료되었습니다.';

  const surveyDoneText = document.createElement('p');
  surveyDoneText.textContent = '설문에 참여해주셔서 감사합니다.';

  surveyDoneElement.appendChild(surveyDoneTitle);
  surveyDoneElement.appendChild(surveyDoneText);

  surveyContainerElement.appendChild(surveyHeader);
  surveyContainerElement.appendChild(surveyDoneElement);
}
