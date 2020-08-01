let board; // 2D array storing current generation
let nextBoard; // stores next generation after calculations are done
let rows; // number of rows (dynamically adjusted)
let columns; // number of columns (dynamically adjusted)
let sideLength = 20; // length of a cell
let canvasSize = 600; // canvas is square with given length

function setup() {
  createCanvas(canvasSize, canvasSize);
	stroke("#D6D6D6");
	// strokeWeight(0.5);
  frameRate(10);
	background("#6AD2F7");
	noLoop();
	// number rows and columns is calculated dynamically
	rows = floor(height / sideLength);
	columns = floor(width / sideLength);
  board = createArray(rows, columns);
	// load the buttons
	addControls();

}

// create 2d array as a board for the Game of life
function createArray(rows, columns) {
  let array = new Array(rows);
  for(var i = 0; i < rows; i++) {
    array[i] = new Array(columns);
		for(var j = 0; j < columns; j++) {
			array[i][j] = 0;
		}
  }
  return array;
}

function chooseRandomConditions() {
	noLoop();
	// initialize the array with 0's and 1's randomly
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < columns; j++) {
      board[i][j] = floor(random(2));
    }
  }
	drawCurrentGeneration();
}

function mousePressed() {
	// if mouse is pressed inside the canvas
	if(0 <= mouseX && mouseX <= width && 0 <= mouseY && mouseY <= height) {
		// stop looping
		noLoop();
		// find correct square
		var i = floor(floor(mouseX) / sideLength);
		var j = floor(floor(mouseY) / sideLength);
		// change its color to the opposite one
		if(board[i][j] === 0) {
			board[i][j] = 1;
		} else {
			board[i][j] = 0;
		}
		// update the board
		drawCurrentGeneration();
	}
}

// override the board with zeroes
function clearBoard() {
	board = createArray(rows, columns);
	drawCurrentGeneration();
}


function draw() {
  drawCurrentGeneration();
  nextBoard = createArray(rows, columns);
  calculateNextGeneration();
  board = nextBoard;
}

function drawCurrentGeneration() {
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < columns; j++) {
      // if a square is 1 then we count it as living
      if (board[i][j] === 1) {
        fill("#2980B9");
      } else {
        fill("#DCDCDC");
      }
      var lengthX = width / columns;
      var lengthY = height / rows;
      // render the board
      rect(i * lengthX, j * lengthY, lengthX, lengthY);
    }
  }
}

function calculateNextGeneration() {
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < columns; j++) {
      // count the number of neighbours for each square
      var neighbours = countNeighbours(i, j);
      // apply the rules to find the next generation
      findNextGeneration(i, j, neighbours);
      neighbours = 0;
    }
  }
}

function countNeighbours(i, j) {
  // initialize neighbour count
  var neighbours = 0;
  // if square "i - 1" exists
  if (i - 1 >= 0) {
    // check all squares with first coordinate "i - 1"
    if (board[i - 1][j] === 1) {
      neighbours++;
    } if (j - 1 >= 0 && board[i - 1][j - 1] === 1) {
      neighbours++;
    } if (j + 1 < columns && board[i - 1][j + 1] === 1) {
      neighbours++;
    }
    // check square with second coordinate "j - 1"
  } if (j - 1 >= 0 && board[i][j - 1] === 1) {
    neighbours++;
    // check square with second coordinate "j + 1"
  } if (j + 1 < columns && board[i][j + 1] === 1) {
    neighbours++;
    // if square "i + 1" exists
  } if (i + 1 < rows) {
    // check all squares with first coordinate "i + 1"
    if (board[i + 1][j] === 1) {
      neighbours++;
    } if (j - 1 >= 0 && board[i + 1][j - 1] === 1) {
      neighbours++;
    } if (j + 1 < columns && board[i + 1][j + 1] === 1) {
      neighbours++;
    }
  }
  return neighbours;
}

function findNextGeneration(i, j, neighbours) {
  // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
  if (board[i][j] === 1 && neighbours < 2) {
    nextBoard[i][j] = 0;
    // Any live cell with two or three live neighbours lives on to the next generation.
  } else if (board[i][j] === 1 && (neighbours === 2 || neighbours === 3)) {
    nextBoard[i][j] = 1;
    // Any live cell with more than three live neighbours dies, as if by overpopulation.
  } else if (board[i][j] === 1 && neighbours > 3) {
    nextBoard[i][j] = 0;
    // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
  } else if (board[i][j] === 0 && neighbours === 3) {
    nextBoard[i][j] = 1;
    // else nothing changes between the generations
  } else {
    nextBoard[i][j] = board[i][j];
  }
}

function addControls() {
	// choose first generation randomly
	randomize = createButton("Randomize");
	randomize.style("width", "90px")
	randomize.mousePressed(chooseRandomConditions);
	// start drawing
	start = createButton("Start");
	start.style("width", "90px");
	start.mousePressed(function() { loop(); });
	// stop drawing
	stop = createButton("Stop");
	stop.style("width", "90px");
	stop.mousePressed(function() { noLoop(); });
	// clear the board
	clr = createButton("Clear");
	clr.style("width", "90px");
	clr.mousePressed(clearBoard);
	// change size of the cells
	changeLengthInput = createInput();
	changeLengthInput.attribute("type", "number")
									 .attribute("placeholder", "Change cell size")
									 .style("text-align", "center")
									 .style("width", "142px");
	// update size of the cells
	changeLengthButton = createButton("Update cells");
	changeLengthButton.style("width", "90px");
	changeLengthButton.mousePressed(updateSideLength);
}

function updateSideLength() {
	// override side length with input value
	sideLength = changeLengthInput.value();
	// minimum 10
	if (sideLength < 10) {
		sideLength = 10;
	}
	// maximum 100
	if(sideLength > 100) {
		sideLength = 100;
	}
	// update board
	rows = floor(height / sideLength);
	columns = floor(width / sideLength);
  board = createArray(rows, columns);
	// draw new board
	drawCurrentGeneration();
}
	
