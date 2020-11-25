document.addEventListener("DOMContentLoaded", () => {
  //event listeners
  document.addEventListener("keyup", control);

  //query selectors
  const gameGrid = document.querySelector(".grid");
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-btn");

  //variables
  const width = 10;
  let currentPosition = 4;

  //timer for auto-move
  timerId = setInterval(moveDown, 1000);

  //creates active game area
  for (var i = 0; i < 200; i++) {
    const newDiv = document.createElement("div");
    gameGrid.appendChild(newDiv);
  }

  //creates bottom of game area (barrier where the blocks stop)
  for (var j = 0; j < 10; j++) {
    const takenDiv = document.createElement("div");
    takenDiv.classList.add("taken");
    gameGrid.append(takenDiv);
  }

  const squares = Array.from(document.querySelectorAll(".grid div"));

  //create tetris block arrays
  const lBlock = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const oBlock = [
    [0, width, width + 1, 1],
    [0, width, width + 1, 1],
    [0, width, width + 1, 1],
    [0, width, width + 1, 1],
  ];

  const iBlock = [
    [width + 1, width * 2 + 1, width * 3 + 1, 1],
    [width, width + 1, width + 2, width + 3],
    [width + 1, width * 2 + 1, width * 3 + 1, 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const tBlock = [
    [width, width + 1, 1, width + 2],
    [width + 1, width * 2 + 1, 1, width + 2],
    [width, width + 1, width * 2 + 1, width + 2],
    [width + 1, width * 2 + 1, 1, width],
  ];

  const zBlock = [
    [width * 2, width * 2 + 1, width + 1, width + 2],
    [0, width, width + 1, width * 2 + 1],
    [width * 2, width * 2 + 1, width + 1, width + 2],
    [0, width, width + 1, width * 2 + 1],
  ];

  const tetrisBlockArray = [lBlock, zBlock, tBlock, oBlock, iBlock];

  let currentRotation = 0;
  let random = Math.floor(Math.random() * tetrisBlockArray.length);
  let currentBlock = tetrisBlockArray[random][currentRotation];

  //draw tetris block
  function drawBlock() {
    currentBlock.forEach((index) => {
      squares[currentPosition + index].classList.add("block");
    });
  }

  //erase tetris block
  function eraseBlock() {
    currentBlock.forEach((index) => {
      squares[currentPosition + index].classList.remove("block");
    });
  }

  //control block movement
  function control(event) {
    if (event.keyCode === 37) {
      moveLeft();
    } else if (event.keyCode === 38) {
      rotate();
    } else if (event.keyCode === 39) {
      moveRight();
    } else if (event.keyCode === 40) {
      moveDown();
    }
  }

  //move the blocks down the grid every second
  function moveDown() {
    eraseBlock();
    currentPosition = currentPosition + width;
    drawBlock();
    freezeBlock();
  }

  function freezeBlock() {
    //check if the block is at the bottom or will clip into frozen blocks
    const freezeMovement = currentBlock.some((index) =>
      squares[currentPosition + index + width].classList.contains("taken")
    );

    if (freezeMovement) {
      currentBlock.forEach((index) =>
        squares[currentPosition + index].classList.add("taken")
      );

      //make a new block
      random = Math.floor(Math.random() * tetrisBlockArray.length);
      currentBlock = tetrisBlockArray[random][currentRotation];
      currentPosition = 4;
      drawBlock();
    }
  }

  function moveLeft() {
    eraseBlock();

    //check if the active block is at the left edge of the grid
    //allow it to move if it is not at the edge
    const isAtLeftEdge = currentBlock.some(
      (index) => (currentPosition + index) % width === 0
    );

    if (!isAtLeftEdge) {
      currentPosition = currentPosition - 1;
    }

    //do not allow the active block to clip through frozen blocks
    if (
      currentBlock.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition = currentPosition + 1;
    }

    drawBlock();
  }

  function moveRight() {
    eraseBlock();

    //check if the active block is at the right edge of the grid
    //allow it to move if it is not at the edge
    const isAtRightEdge = currentBlock.some(
      (index) => (currentPosition + index) % width === width - 1
    );

    if (!isAtRightEdge) {
      currentPosition = currentPosition + 1;
    }

    //do not allow the active block to clip through frozen blocks
    if (
      currentBlock.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition = currentPosition - 1;
    }

    drawBlock();
  }

  function rotate() {
    eraseBlock();
    currentRotation = (currentRotation + 1) % 4;
    currentBlock = tetrisBlockArray[random][currentRotation];
    drawBlock();
  }
});
