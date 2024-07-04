export function renderStatistics(data, selectedItems, currentBarWidths, toggleSelection, handleClick) {
  const appElement = document.getElementById('app');
  appElement.innerHTML = '';

  const surveyContainerElement = document.createElement('div');
  surveyContainerElement.id = 'statistics-container';

  const headerElement = document.createElement('h2');
  headerElement.textContent = '채용 설문조사';
  headerElement.classList.add('survey-statistics-header');
  surveyContainerElement.appendChild(headerElement);

  data.forEach((item) => {
    const answerContentElement = document.createElement('div');
    answerContentElement.classList.add('answer-content');

    const titleElement = document.createElement('p');
    titleElement.textContent = `Q. ${item.title}`;
    titleElement.classList.add('survey-question-title');

    const chartElement = document.createElement('div');
    chartElement.classList.add('chart');

    const chartCanvasElement = document.createElement('canvas');

    const canvasWidth = 600;
    const canvasHeight = 40 * item.answers.length;

    chartCanvasElement.style.width = `${canvasWidth}px`;
    chartCanvasElement.style.height = `${canvasHeight}px`;

    // canvas의 글자가 흐려지는 형상을 방지하기 위해 devicePixelRatio로 보정
    const dpr = window.devicePixelRatio || 1;

    chartCanvasElement.width = canvasWidth * dpr;
    chartCanvasElement.height = canvasHeight * dpr;

    const ctx = chartCanvasElement.getContext('2d');

    const chartWidth = chartCanvasElement.width;
    const chartHeight = chartCanvasElement.height;
    const barHeight = 40 * dpr;

    // 초기화
    ctx.clearRect(0, 0, chartWidth, chartHeight);

    item.answers.forEach((answer, index) => {
      const percentage = isNaN(answer / item.totalAnswerCount) ? 0 : ((answer / item.totalAnswerCount) * 100).toFixed(2);
      // 퍼센트를 기반으로 바의 width 계산
      const targetBarWidth = chartWidth * (percentage / 100);
      // 바를 그려질 y 좌표
      const y = barHeight * index;

      animateBar(ctx, y, barHeight, targetBarWidth, item.items[index], answer, item.id, index, item.totalAnswerCount, selectedItems, currentBarWidths, dpr);
    });

    chartCanvasElement.removeEventListener('click', handleClick);
    chartCanvasElement.addEventListener('click', (event) => handleClick(event, item, ctx));

    answerContentElement.appendChild(titleElement);
    answerContentElement.appendChild(chartElement);
    chartElement.appendChild(chartCanvasElement);
    surveyContainerElement.appendChild(answerContentElement);
    appElement.appendChild(surveyContainerElement);
  });
}

function animateBar(ctx, y, barHeight, targetBarWidth, itemLabel, answer, questionId, index, totalAnswerCount, selectedItems, currentBarWidths, dpr) {
  const itemKey = `${questionId}:${index}`;
  const startBarWidth = currentBarWidths[itemKey] || 0;
  let barWidth = startBarWidth;
  const animationDuration = 500;
  const startTime = performance.now();

  function draw() {
    const currentTime = performance.now();
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / animationDuration, 1);
    barWidth = startBarWidth + (targetBarWidth - startBarWidth) * progress;

    ctx.clearRect(0, y, ctx.canvas.width, barHeight);

    // 선택된 항목 토글 스타일 적용
    if (selectedItems.includes(itemKey)) {
      ctx.fillStyle = 'rgba(235, 133, 111, 1)';
    } else {
      ctx.fillStyle = 'rgba(75, 192, 192, 0.6)';
    }

    // 퍼센테이지 기반 바
    ctx.fillRect(0, y, barWidth, barHeight - 10);

    if (selectedItems.includes(itemKey)) {
      ctx.fillStyle = 'rgba(207, 207, 207, 1)';
    } else {
      ctx.fillStyle = 'rgba(235, 235, 235, 1)';
    }

    // 배경색
    ctx.fillRect(barWidth, y, ctx.canvas.width - barWidth, barHeight - 10);

    ctx.fillStyle = 'black';
    ctx.font = `${12 * dpr}px Arial`;

    const percentage = isNaN(answer / totalAnswerCount) ? 0 : ((answer / totalAnswerCount) * 100).toFixed(2);
    // 퍼센트, 항목, 수치 표시. dpr을 사용해 보정
    ctx.fillText(`${percentage}%`, 10, y + barHeight / 2);
    ctx.fillText(itemLabel, 100 * dpr, y + barHeight / 2);
    ctx.fillText(answer, ctx.canvas.width - 30 * dpr, y + barHeight / 2);

    if (progress < 1) {
      // 프로세스가 1(완료)가 되지 않았다면 requestAnimationFrame을 계속 호출해 canvas 애니메이션 수행
      requestAnimationFrame(draw);
    } else {
      currentBarWidths[itemKey] = barWidth;
    }
  }

  requestAnimationFrame(draw);
}
