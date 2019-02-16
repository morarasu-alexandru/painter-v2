// DOM selectors
const $html = document.getElementById('html');
const $application = document.getElementById('application');
const $paintingForm = document.getElementById('paintingForm');
const $widthInput = document.getElementById('widthInput');
const $heightInput = document.getElementById('heightInput');
const $widthInputContainer = document.getElementById('widthInputContainer');
const $heightInputContainer = document.getElementById('heightInputContainer');
const $paintingSubmitButton = document.getElementById('paintingSubmitButton');

const timer = 5000;


let widthValue, heightValue;

// Event listeners
$paintingSubmitButton.addEventListener('click', (e) => {
  const htmlPadding = getElementPadding($html);
  const painterMinWidth = 10;
  const painterMinHeight = 10;
  const scrollSafetyDimensions = 20;
  let canCreatePainter = true;

  clearPainterFormErrorMessages();

  const painterMaxWidth = getWindowWidth() - htmlPadding.left -  htmlPadding.right - scrollSafetyDimensions;

  if (!(widthValue >= painterMinWidth && widthValue <= painterMaxWidth)) {
    let text = isUndefinedOrNullOrEmptyString(widthValue)
      ? 'Please insert width value'
      : `Please insert a value between ${painterMinWidth} and ${painterMaxWidth}`;

    showErrorMessage($widthInputContainer, text);

    canCreatePainter = false;
  }

  const appCurrentHeight = getElementHeight($application);
  const painterMaxHeight = getWindowHeight() - htmlPadding.top - htmlPadding.bottom - scrollSafetyDimensions
    - appCurrentHeight;

  if (!(heightValue >= painterMinHeight && heightValue <= painterMaxHeight)) {
    let text = isUndefinedOrNullOrEmptyString(heightValue)
      ? 'Please insert height value'
      : `Please insert a value between ${painterMinHeight} and ${painterMaxHeight}`;

    showErrorMessage($heightInputContainer, text);

    canCreatePainter = false;
  }

  if (canCreatePainter) {
    const widthValuePainter = widthValue;
    const heightValuePainter = heightValue;

    clearPainterForm();
    createPainter(widthValuePainter, heightValuePainter, $paintingForm);

    console.log('Submit');
  }


  e.preventDefault()
});

$widthInput.addEventListener('change', (e) => {
  widthValue = e.currentTarget.value;
});

$heightInput.addEventListener('change', (e) => {
  heightValue = e.currentTarget.value;
});

// Functions
const getWindowWidth = () => window.innerWidth;

const getWindowHeight = () => window.innerHeight;

const getElementPadding = (element) => {
  const computedStyle = window.getComputedStyle(element);

  return {
    top: parseInt(computedStyle.getPropertyValue('padding-top').slice(0, -2)),
    right: parseInt(computedStyle.getPropertyValue('padding-right').slice(0, -2)),
    bottom: parseInt(computedStyle.getPropertyValue('padding-bottom').slice(0, -2)),
    left: parseInt(computedStyle.getPropertyValue('padding-left').slice(0, -2)),
  };
};

const getElementWidth = (element) => parseInt(window.getComputedStyle(element).getPropertyValue('width').slice(0, -2));

const getElementHeight = (element) => parseInt(window.getComputedStyle(element).getPropertyValue('height').slice(0, -2));

const isUndefinedOrNullOrEmptyString = (inputVar) => typeof (inputVar) == 'undefined' || inputVar == null || inputVar === '';

const showErrorMessage = (element, text) => {
  element.insertAdjacentHTML('beforeend', `<span class="error">${text}</span>`);
};

const clearPainterFormErrorMessages = () => {
  document.querySelectorAll('#paintingForm .error').forEach((elem) => {
    elem.remove();
  })
};

const clearPainterForm = () => {
    widthValue = null;
    heightValue = null;

    $widthInput.value = '';
    $heightInput.value = '';

    clearPainterFormErrorMessages();
};

const createPainter = (width, height, inserAfterElem) => {
  const numberOfCells = width * height;
  let painterElement = `<div id="painter" class="painter" style="width: ${width}px; height: ${height}px">`;

  for (let i = 0; i <= numberOfCells; i++) {
    painterElement += '<div style="background-color: #fff"></div>'
  }

  painterElement += '</div>';

  console.log('numberOfCells: ', numberOfCells);

  inserAfterElem.insertAdjacentHTML('afterend', painterElement);

  document.getElementById('painter').addEventListener('click', (e) => {
    if (!e.target.id) {
      console.log(e.target.style.backgroundColor);
      e.target.style.backgroundColor = 'rgba(0,0,0)';
    }
  })
};