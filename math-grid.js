const canvas = document.getElementById('mathGrid');
const ctx = canvas.getContext('2d');
const cellSize = 20; // size of each grid cell
const gridWidth = canvas.width / cellSize;
const gridHeight = canvas.height / cellSize;
const area = document.getElementById('area');
const perimeter = document.getElementById('perimeter');
const hideAreaBtn = document.getElementById('hideArea');
const hidePerimeterBtn = document.getElementById('hidePerimeter');
const clearGridBtn = document.getElementById('clearGrid');

let currentColor = 'green';
let shapes = [];
let showArea = true;
let showPerimeter = true;

// Draw the grid
function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  for (let x = 0; x <= gridWidth; x++) {
    ctx.moveTo(x * cellSize, 0);
    ctx.lineTo(x * cellSize, canvas.height);
  }
  for (let y = 0; y <= gridHeight; y++) {
    ctx.moveTo(0, y * cellSize);
    ctx.lineTo(canvas.width, y * cellSize);
  }
  ctx.strokeStyle = 'lightgray';
  ctx.stroke();
  drawShapes();
}

// Draw the shapes on the grid
function drawShapes() {
  shapes.forEach((shape) => {
    ctx.fillStyle = shape.color;
    shape.cells.forEach((cell) => {
      ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
    });
  });
  updateAreaAndPerimeter();
}

// Calculate and update the area and perimeter
function updateAreaAndPerimeter() {
  let totalArea = 0;
  let totalPerimeter = 0;
  shapes.forEach((shape) => {
    const cells = new Set(shape.cells.map(({ x, y }) => `${x},${y}`));
    let shapeArea = cells.size;
    let shapePerimeter = 0;
    const edges = new Set();
    cells.forEach((cell) => {
      const [x, y] = cell.split(',').map(Number);
      if (!cells.has(`${x - 1},${y}`)) edges.add(`${x},${y},left`);
      if (!cells.has(`${x + 1},${y}`)) edges.add(`${x + 1},${y},right`);
      if (!cells.has(`${x},${y - 1}`)) edges.add(`${x},${y},top`);
      if (!cells.has(`${x},${y + 1}`)) edges.add(`${x},${y + 1},bottom`);
    });
    shapePerimeter = edges.size;
    totalArea += shapeArea;
    totalPerimeter += shapePerimeter;
  });
  if (showArea) area.textContent = totalArea;
  else area.textContent = '';
  if (showPerimeter) perimeter.textContent = totalPerimeter;
  else perimeter.textContent = '';
}

// Handle color selection
const colorDivs = document.querySelectorAll('.color');
colorDivs.forEach((div) => {
  div.addEventListener('click', () => {
    currentColor = div.style.backgroundColor;
  });
});

// Handle canvas click
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / cellSize);
  const y = Math.floor((e.clientY - rect.top) / cellSize);
  const cell = { x, y };
  const shape = shapes.find((s) => s.cells.some(({ x, y }) => x === cell.x && y === cell.y));
  if (shape) {
    shape.cells = shape.cells.filter(({ x, y }) => x !== cell.x || y !== cell.y);
  } else {
    const newShape = { color: currentColor, cells: [cell] };
    shapes.push(newShape);
  }
  drawGrid();
});

// Handle control buttons
hideAreaBtn.addEventListener('click', () => {
  showArea = !showArea;
  updateAreaAndPerimeter();
});

hidePerimeterBtn.addEventListener('click', () => {
  showPerimeter = !showPerimeter;
  updateAreaAndPerimeter();
});

clearGridBtn.addEventListener('click', () => {
  shapes = [];
  drawGrid();
});

// Initial grid setup
drawGrid();