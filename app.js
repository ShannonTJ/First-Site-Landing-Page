const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");

context.scale(20, 20);

//in milliseconds
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

const colors = [
  null,
  "#ff0d72",
  "#0dc2ff",
  "#0dff72",
  "#f538ff",
  "#ff8e0d",
  "#ffe138",
  "#3877ff",
];

const grid = createMatrix(12, 20);

const player = {
  position: { x: 0, y: 0 },
  matrix: null,
  score: 0,
};

function collide(grid, player) {
  const [m, o] = [player.matrix, player.position];
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      //check row by row
      if (m[y][x] !== 0 && (grid[y + o.y] && grid[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

function createMatrix(width, height) {
  //create matrix array
  //all values in the arry will be 0 (empty grid to start)
  const matrix = [];
  while (height > 0) {
    matrix.push(new Array(width).fill(0));
    height--;
  }
  return matrix;
}

//Create all tetris blocks and store in matrices
//the numbers represent different block colors
function createPiece(type) {
  if (type === "T") {
    return [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ];
  } else if (type === "O") {
    return [
      [2, 2],
      [2, 2],
    ];
  } else if (type === "L") {
    return [
      [0, 3, 0],
      [0, 3, 0],
      [0, 3, 3],
    ];
  } else if (type === "J") {
    return [
      [0, 4, 0],
      [0, 4, 0],
      [4, 4, 0],
    ];
  } else if (type === "I") {
    return [
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
    ];
  } else if (type === "S") {
    return [
      [0, 6, 6],
      [6, 6, 0],
      [0, 0, 0],
    ];
  } else if (type === "Z") {
    return [
      [7, 7, 0],
      [0, 7, 7],
      [0, 0, 0],
    ];
  }
}

function draw() {
  //draw the black grid area
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  //draw the inactive blocks
  drawMatrix(grid, { x: 0, y: 0 });
  //draw the active block
  drawMatrix(player.matrix, player.position);
}

function drawMatrix(matrix, offset) {
  //draw the inactive blocks
  //color them based on the colors array
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        context.fillStyle = colors[value];
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

function gridSweep() {
  //check for cleared rows in the game
  let rowCount = 1;
  outer: for (let y = grid.length - 1; y > 0; --y) {
    for (let x = 0; x < grid[y].length; ++x) {
      //if any empty blocks are found in the row
      //move on to the next row
      if (grid[y][x] === 0) {
        continue outer;
      }
    }
    //get an empty row
    const row = grid.splice(y, 1)[0].fill(0);
    //put the empty row on the top of the grid
    grid.unshift(row);
    ++y;

    //update the score
    //calculate points depending on how many rows were cleared
    player.score += rowCount * 10;
    rowCount = rowCount * 2;
  }
}

function merge(grid, player) {
  //merge the active block with the inactive blocks
  //update the grid array to contain the new block, represented by nonzero values
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        grid[y + player.position.y][x + player.position.x] = value;
      }
    });
  });
}

function playerDrop() {
  //moves the active block down
  player.position.y++;

  //when the active block reaches the bottom/inactive blocks:
  //move the block back up, to its uncollided position
  //merge the block with the inactive blocks
  //generate a new block
  //check if a row was cleared and update the score
  if (collide(grid, player)) {
    player.position.y--;
    merge(grid, player);
    playerReset();
    gridSweep();
    updateScore();
  }
  //reset counter
  dropCounter = 0;
}

function playerMove(direction) {
  //move the active block from left to right
  player.position.x = player.position.x + direction;

  if (collide(grid, player)) {
    player.position.x = player.position.x - direction;
  }
}

function playerReset() {
  //create a new block
  //choose a random shape
  const pieces = "ILJOTSZ";
  player.matrix = createPiece(
    pieces[Math.floor(pieces.length * Math.random())]
  );
  //initialize new block position
  player.position.y = 0;
  player.position.x =
    Math.floor(grid[0].length / 2) - Math.floor(player.matrix[0].length / 2);

  //if there is a collision directly after generating a new piece,
  //end the game and clear the grid
  if (collide(grid, player)) {
    grid.forEach((row) => row.fill(0));
    player.score = 0;
    updateScore();
  }
}

function playerRotate(direction) {
  const pos = player.position.x;
  let offset = 1;
  rotate(player.matrix, direction);

  //check for collisions of rotating pieces
  //if the piece clips into something, change the offset so the piece is moved back to its old position
  while (collide(grid, player)) {
    player.position.x = player.position.x + offset;
    offset = -(offset + (offset > 0 ? 1 : -1));

    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -direction);
      player.position.x = pos;
      return;
    }
  }
}

function rotate(matrix, direction) {
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
  }

  //rotate left or right
  if (direction > 0) {
    matrix.forEach((row) => row.reverse());
  } else {
    matrix.reverse();
  }
}

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter = dropCounter + deltaTime;

  //move active piece down automatically
  if (dropCounter > dropInterval) {
    playerDrop();
  }

  draw();
  requestAnimationFrame(update);
}

function updateScore() {
  document.getElementById("score").innerText = player.score;
}

document.addEventListener("keydown", (event) => {
  if (event.keyCode === 37) {
    playerMove(-1);
  } else if (event.keyCode === 39) {
    playerMove(1);
  } else if (event.keyCode === 40) {
    playerDrop();
  } else if (event.keyCode === 81) {
    playerRotate(-1);
  } else if (event.keyCode === 87) {
    playerRotate(1);
  }
});

//call functions
playerReset();
updateScore();
update();
