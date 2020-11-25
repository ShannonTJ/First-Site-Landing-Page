const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");

context.scale(20, 20);

function collide(grid, player) {
  const [m, o] = [player.matrix, player.position];
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (m[y][x] !== 0 && (grid[y + o.y] && grid[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

function createMatrix(width, height) {
  const matrix = [];
  while (height > 0) {
    matrix.push(new Array(width).fill(0));
    height--;
  }
  return matrix;
}

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
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  drawMatrix(grid, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.position);
}

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        context.fillStyle = colors[value];
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

function merge(grid, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        grid[y + player.position.y][x + player.position.x] = value;
      }
    });
  });
}

function playerDrop() {
  player.position.y++;

  if (collide(grid, player)) {
    player.position.y--;
    merge(grid, player);
    playerReset();
  }
  dropCounter = 0;
}

function playerMove(direction) {
  player.position.x = player.position.x + direction;

  if (collide(grid, player)) {
    player.position.x = player.position.x - direction;
  }
}

function playerReset() {
  const pieces = "ILJOTSZ";
  player.matrix = createPiece(pieces[(pieces.length * Math.random()) | 0]);
  player.position.y = 0;
  player.position.x =
    ((grid[0].length / 2) | 0) - ((player.matrix[0].length / 2) | 0);

  //if there is a collision directly after generating a new piece,
  //end the game and clear the grid
  if (collide(grid, player)) {
    grid.forEach((row) => row.fill(0));
  }
}

function playerRotate(direction) {
  const pos = player.position.x;
  let offset = 1;
  rotate(player.matrix, direction);

  //check for collisions of rotating pieces
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

//in milliseconds
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

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
  position: { x: 5, y: 5 },
  matrix: createPiece("T"),
};

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

update();
