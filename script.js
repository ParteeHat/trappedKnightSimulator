// Calculate number at a certain coordinate
const spiralCell = (x, y) => {
  if (x == y & y == 0) return 1;
  else if (-x < y && y <= x) { // First quadrant
    let n = Math.abs(x);
    return (4 * Math.pow(n, 2)) - (2 * n) + 1 + y - n;
  } else if (-y <= x && x < y) { // Second quadrant
    let n = Math.abs(y);
    return (4 * Math.pow(n, 2)) + 1 - n - x;
  } else if (x <= y && y < -x) { // Third quadrant
    let n = Math.abs(x);
    return (4 * Math.pow(n, 2)) + n + 1 - y;
  } else if (y < x && x <= -y) { // Fourth quadrant
    let n = Math.abs(y);
    return (4 * Math.pow(n, 2)) + (3 * n) + 1 + x;
  }
};

// Draws the grid
const drawGrid = (context, splits, canvasSize) => {
  // Draw vertical lines
  for (var x = 0.5; x < canvasSize + 1; x += boxSize) {
    context.moveTo(x, 0);
    context.lineTo(x, canvasSize);
  }
  context.moveTo(canvasSize - 1, 0);
  context.lineTo(canvasSize - 1, canvasSize);

  // Draw horizontal lines
  for (var y = 0.5; y < canvasSize + 1; y += boxSize) {
    context.moveTo(0, y);
    context.lineTo(canvasSize, y);
  }
  context.moveTo(0, canvasSize - 1);
  context.lineTo(canvasSize, canvasSize - 1);

  context.strokeStyle = gridColor;
  context.closePath()
  context.stroke();
}

// Draws the numbers
const drawNumbers = (context, splits, canvasSize) => {
  context.font = `10px serif`;

  for (let x = 0; x < boxSize; x++) {
    for (let y = 0; y < boxSize; y++) {
      context.fillText(String(spiralCell(x - Math.floor(splits / 2), y - Math.ceil(splits / 2))), x * boxSize + 10, y * boxSize - 10);
    }
  }
}

// Finds the position where the knight can go which has the smallest number
const simulate = (travelX, travelY) => {
  // Places them all in an object
  let possibleSquares = [
    {
      num: spiralCell(knightX + travelX, knightY + travelY),
      x: knightX + travelX,
      y: knightY + travelY
    },
    {
      num: spiralCell(knightX + travelY, knightY + travelX),
      x: knightX + travelY,
      y: knightY + travelX
    },
    {
      num: spiralCell(knightX + travelY, knightY - travelX),
      x: knightX + travelY,
      y: knightY - travelX
    },
    {
      num: spiralCell(knightX + travelX, knightY - travelY),
      x: knightX + travelX,
      y: knightY - travelY
    },
    {
      num: spiralCell(knightX - travelX, knightY - travelY),
      x: knightX - travelX,
      y: knightY - travelY
    },
    {
      num: spiralCell(knightX - travelY, knightY - travelX),
      x: knightX - travelY,
      y: knightY - travelX
    },
    {
      num: spiralCell(knightX - travelY, knightY + travelX),
      x: knightX - travelY,
      y: knightY + travelX
    },
    {
      num: spiralCell(knightX - travelX, knightY + travelY),
      x: knightX - travelX,
      y: knightY + travelY
    }
  ]

  // Sorts them
  var sorted = possibleSquares.sort((a, b) => {
    return (a.num > b.num) ? 1 : ((b.num > a.num) ? -1 : 0)
  });

  // Draws boxes and lines
  trapped = true
  for (let item of sorted) {
    if (!visitedPositions.includes(item.num)) {
      if (showLines) {
        strokeContext.beginPath()
        strokeContext.moveTo((boxSize * (Math.floor(splits / 2) + knightX) + boxSize / 2), (boxSize * (Math.floor(splits / 2) + knightY) + boxSize / 2));

        strokeContext.lineTo((boxSize * (Math.floor(splits / 2) + item.x) + boxSize / 2), (boxSize * (Math.floor(splits / 2) + item.y) + boxSize / 2));
        if (lineType == "static") {
          strokeContext.strokeStyle = strokeColor
        } else if (lineType == "distance") {
          strokeContext.strokeStyle = generateDistanceRainbowColor(item.x, item.y);
        } else if (lineType == "steps") {
          strokeContext.strokeStyle = generateStepsRainbowColor();
        } else {
          console.error("Line type is undefined")
        }
        strokeContext.lineWidth = lineStroke;
        strokeContext.closePath()
        strokeContext.stroke();
      }
      if (showBoxes) {
        if (boxType == "static") {
          context.fillStyle = boxColor
        } else if (boxType == "distance") {
          context.fillStyle = generateDistanceRainbowColor(item.x, item.y)
        } else if (boxType == "steps") {
          context.fillStyle = generateStepsRainbowColor()
        } else {
          console.error("Box type is undefined")
        }
        
        context.fillRect((boxSize * (Math.floor(splits / 2) + item.x)), (boxSize * (Math.floor(splits / 2) + item.y)), boxSize, boxSize);
      }

      visitedPositions.push(item.num)
      knightX = item.x
      knightY = item.y
      document.getElementById("stepCount").innerText = "Step #: " + ++turnCount
      trapped = false
      break;
    }
  }
  if (trapped) {
    endTime = new Date().getTime() - startTime
    alert(`KNIGHT GOT TRAPPED AFTER ${turnCount} STEPS ON #${spiralCell(knightX, knightY)} AT (${knightX}, ${knightY}) AFTER ${endTime/1000} seconds`)
    context.fillStyle = "black"
    context.fillRect((boxSize * (Math.floor(splits / 2) + knightX)), (boxSize * (Math.floor(splits / 2) + knightY)), boxSize, boxSize);
  }
}

// Draws knight and calls simulate
const drawFrame = () => {
  simulate(knightXDistance, knightYDistance)
  knightContext.clearRect(0, 0, canvas.width, canvas.height);
  knightContext.drawImage(img, (boxSize * (Math.floor(splits / 2) + knightX) + boxSize / 4), (boxSize * (Math.floor(splits / 2) + knightY) + boxSize / 4), boxSize / 2, boxSize / 2)
  if (!trapped) {
    if (timeInterval == "0") {
      drawFrame()
    } else if (!isNaN(Number(timeInterval))) {
      setTimeout(() => {
        drawFrame()
      }, timeInterval)
    } else {
      alert("TIME INPUT ISN'T A NUMBER")
    }
  }
}

// Returns a color based on the distance from the center and a multiplier
const generateDistanceRainbowColor = (x, y) => {
  return `hsl(${(stepsPerColorCycle * Math.sqrt(x ** 2 + y ** 2)) % 360}, 100%, 50%)`
}

// Returns a color based on how many steps the knight has taken and a multiplier
const generateStepsRainbowColor = () => {
  return `hsl(${((stepsPerColorCycle / 5) * turnCount) % 360}, 100%, 50%)`
}

// Clears all canvases and resets variables
const reset = () => {
  context.beginPath();
  context.moveTo(0, 0);
  context.closePath();
  context.clearRect(0, 0, canvas.width, canvas.height);
  knightContext.clearRect(0, 0, canvas.width, canvas.height);
  numberContext.clearRect(0, 0, canvas.width, canvas.height);
  strokeContext.beginPath();
  strokeContext.moveTo(0, 0);
  strokeContext.closePath();
  strokeContext.clearRect(0, 0, canvas.width, canvas.height);
  knightX = 0
  knightY = 0
  trapped = false
  visitedPositions = [1]
  turnCount = 1
  document.getElementById("stepCount").innerText = "Step #: 1"
}

// Initialization
const start = () => {
  if (showGrid) {
    drawGrid(context, splits, canvasSize);
  }
  if (renderNumbers) {
    drawNumbers(numberContext, splits, canvasSize);
  }
  context.fillStyle = "black"
  context.fillRect((boxSize * (Math.floor(splits / 2))), (boxSize * (Math.floor(splits / 2))), boxSize, boxSize)
  knightContext.drawImage(img, (boxSize * Math.floor(splits / 2)), (boxSize * Math.floor(splits / 2)), boxSize, boxSize);
  setTimeout(() => {
    drawFrame()
  }, "500")
}

var canvas = document.getElementById('gridCanvas');

var context = canvas.getContext('2d');
var canvasSize = (window.innerHeight > window.innerWidth) ? window.innerWidth : window.innerHeight;
var splits = 57
var boxSize = (canvasSize / splits)
canvas.width = canvasSize
canvas.height = canvasSize

var knightCanvas = document.getElementById('knightCanvas');
var knightContext = knightCanvas.getContext('2d');
knightCanvas.width = canvasSize
knightCanvas.height = canvasSize
var visitedPositions = [1]
var knightX = 0
var knightY = 0
var knightXDistance = 1
var knightYDistance = 2
var timeInterval = "100"
var renderNumbers = true
var trapped = false;
var lineStroke = 0.5
var showBoxes = true
var showLines = true
var showGrid = true
var turnCount = 1;
var stepsPerColorCycle = 15
var gridColor = "#dddddd"
var strokeColor = "#aaaaaa"
var startTime
var endTime
var panelToggled = true
var lineType = "static"
var boxType = "distance"
var boxColor = "#cccccc"

var numberCanvas = document.getElementById('numberCanvas');
var numberContext = numberCanvas.getContext('2d');
numberCanvas.width = canvasSize
numberCanvas.height = canvasSize

var strokeCanvas = document.getElementById('strokeCanvas');
var strokeContext = strokeCanvas.getContext('2d');
strokeCanvas.width = canvasSize
strokeCanvas.height = canvasSize

// Adds settings 
const img = new Image();
img.onload = () => {
  document.getElementById("submitInput").addEventListener('click', () => {
    reset()
    if (document.getElementById("numberInput").checked && Number(document.getElementById("zoomInput").value) < 15) {
      renderNumbers = true
    } else {
      renderNumbers = false
    }
    if (document.getElementById("boxInput").checked) {
      showBoxes = true
    } else {
      showBoxes = false
    }
    if (document.getElementById("lineInput").checked) {
      showLines = true
    } else {
      showLines = false
    }
    if (document.getElementById("gridInput").checked) {
      showGrid = true
    } else {
      showGrid = false
    }
    boxType = document.getElementById("boxType").value
    lineType = document.getElementById("lineType").value
    lineStroke = Number(document.getElementById("strokeInput").value)
    splits = Number(document.getElementById("zoomInput").value) * 2 + 1
    boxSize = (canvasSize / splits)
    timeInterval = document.getElementById("speedInput").value
    knightXDistance = Number(document.getElementById("xInput").value)
    knightYDistance = Number(document.getElementById("yInput").value)
    stepsPerColorCycle = Number(document.getElementById("stepsInput").value)
    boxColor = document.getElementById("boxColorInput").value
    strokeColor = document.getElementById("strokeColorInput").value
    gridColor = document.getElementById("gridColorInput").value
    document.body.style.backgroundColor = document.getElementById("backgroundColorInput").value
    startTime = new Date().getTime()
    
    start()
  })

  document.getElementById('speedInput').addEventListener("change", () => {
    if (document.getElementById("speedInput").value === "0") {
      alert("⚠️ 0 will crash your browser if you dont know what you are doing! ⚠️")
    }
  });
};
img.src = 'knight.png';

// Toggles the setting panel
document.getElementById("showButton").addEventListener("click", () => {
  if (panelToggled) {
    document.getElementById("showButton").innerHTML = "<p id='downArrow'>&#9660;</p>"
    document.getElementById("settingsTable").hidden = true;
  } else {
    document.getElementById("showButton").innerHTML = "<p>&#9650;</p>"
    document.getElementById("settingsTable").hidden = false;
  }
  panelToggled = !panelToggled
})