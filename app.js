document.addEventListener("DOMContentLoaded", () => {
  const gameGrid = document.querySelector(".grid");
  const width = 10;
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-btn");

  for (var i = 0; i < 200; i++) {
    const newDiv = document.createElement("div");
    gameGrid.appendChild(newDiv);
  }

  for (var j = 0; j < 10; j++) {
    const takenDiv = document.createElement("div");
    takenDiv.classList.add("taken");
    gameGrid.append(takenDiv);
  }

  const squares = Array.from(document.querySelectorAll(".grid div"));
  console.log(squares);

  //Tetris blocks
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
    [[width, width + 1, width + 2, width + 3]],
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

  let currentPosition = 4;
  let currentRotation = 0;

  let random = Math.floor(Math.random() * tetrisBlockArray.length);
  let currentBlock = tetrisBlockArray[random][currentRotation];

  console.log(random);

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

  timerId = setInterval(moveDown, 1000);

  //move the blocks down the grid every second
  function moveDown() {
    eraseBlock();
    currentPosition += width;
    drawBlock();
    freezeBlock();
  }

  function freezeBlock() {
    if (
      currentBlock.some((index) =>
        squares[currentPosition + index + width].classList.contains("taken")
      )
    ) {
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
});
