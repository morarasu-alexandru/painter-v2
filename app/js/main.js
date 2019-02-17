// DOM selectors
const $html = document.getElementById('html');
const $application = document.getElementById('application');
const $paintingForm = document.getElementById('paintingForm');
const $widthInput = document.getElementById('widthInput');
const $heightInput = document.getElementById('heightInput');
const $widthInputContainer = document.getElementById('widthInputContainer');
const $heightInputContainer = document.getElementById('heightInputContainer');
const $submitPaintingButton = document.getElementById('submitPaintingButton');
const $getMaxPaintingButton = document.getElementById('getMaxPaintingButton');

let drawColor = 'rgb(0,0,0)';
let widthValue, heightValue;

// Event listeners
$submitPaintingButton.addEventListener('click', (e) => {
  const painterMinWidth = 10;
  const painterMinHeight = 10;
  let canCreatePainter = true;
  const painterMaxWidth = calculatePainterMaxWidth();
  const painterMaxHeight = calculatePainterMaxHeight();

  clearPainterFormErrorMessages();

  if (!(widthValue >= painterMinWidth && widthValue <= painterMaxWidth)) {
    let text = isUndefinedOrNullOrEmptyString(widthValue)
      ? 'Please insert width value'
      : `Please insert a value between ${painterMinWidth} and ${painterMaxWidth}`;

    showErrorMessage($widthInputContainer, text);

    canCreatePainter = false;
  }

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
  }

  e.preventDefault();
});

$getMaxPaintingButton.addEventListener('click', (e) => {
  const painterWidth = calculatePainterMaxWidth();
  const painterHeight = calculatePainterMaxHeight();

  createPainter(painterWidth, painterHeight, $paintingForm);

  e.preventDefault();
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

const calculatePainterMaxWidth = () => {
  const htmlPadding = getElementPadding($html);
  const scrollSafetyDimensions = 17;

  return getWindowWidth() - htmlPadding.left - htmlPadding.right - scrollSafetyDimensions;
};

const calculatePainterMaxHeight = () => {
  const htmlPadding = getElementPadding($html);
  const scrollSafetyDimensions = 17;
  const additionalHeight = 30;
  const appCurrentHeight = getElementHeight($application);

  return getWindowHeight() - htmlPadding.top - htmlPadding.bottom - scrollSafetyDimensions
    - appCurrentHeight - additionalHeight;
};

const getRandomRGBColor = () => `rgb(${generateRandomNumber(0, 255)}, ${generateRandomNumber(0, 255)}, ${generateRandomNumber(0, 255)})`;

const generateRandomNumber = (startNumber, endNumber) => Math.floor(Math.random() * endNumber + startNumber);

const createPainter = (width, height, inserAfterElem) => {
  const numberOfCellsOnRow = Math.floor(width / 10);
  const numberOfCellsOnColumn = Math.floor(height / 10);


  let svgPainter = `<div id="painterContainer" class="painterContainer"><svg id="painter" class="painter" width="${width}" height="${height}" >`;

  for (let i = 0; i < numberOfCellsOnRow; i++) {
    for (let j = 0; j < numberOfCellsOnColumn; j++) {
      svgPainter += `<rect x="${10 * i}" y="${10 * j}" width="10" height="10"
        style="fill:rgb(255,255,255);stroke-width:1;stroke:rgb(50,50,50)"></rect>`;
    }
  }

  svgPainter += "</svg></div>";

  inserAfterElem.insertAdjacentHTML('afterend', svgPainter);

  const $painter = document.getElementById('painter');
  const $painterContainer = document.getElementById('painterContainer');

  let painterMenu = `<div class="painterMenu">
    <div class="painterMenuSection">
      <button class="button" id="colorPickerMenu">Color picker</button>
      <button class="button" id="generateRandomColorButton">Get random color</button>
    </div>
    <div class="painterMenuSection">
      <span class="text">draw color:</span>
      <div id="painterColor" class="painterColor" style="background-color: ${drawColor}"></div>
    </div>
  </div>`;

  $painterContainer.insertAdjacentHTML('beforeend', painterMenu);

  const $generateRandomColorButton = document.getElementById('generateRandomColorButton');
  const $painterColor = document.getElementById('painterColor');

  $painter.addEventListener('mousedown', () => {
    $painter.addEventListener('mousemove', draw)
  });

  $painter.addEventListener('mouseup', () => {
    $painter.removeEventListener('mousemove', draw);
  });

  $generateRandomColorButton.addEventListener('click', (e) => {
    drawColor = getRandomRGBColor();

    $painterColor.style.backgroundColor = drawColor;

    e.preventDefault()
  });

  const draw = (e) => {
    if (e.target.nodeName === "rect" && e.target.style.fill !== drawColor) {
      e.target.style.fill = drawColor;
    }
  }
};

