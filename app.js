document.addEventListener("DOMContentLoaded", () => {
  const gameGrid = document.querySelector(".grid");
  const width = 10;
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-btn");

  for (var i = 0; i < 200; i++) {
    const newDiv = document.createElement("div");
    gameGrid.appendChild(newDiv);
  }

  const squares = Array.from(document.querySelectorAll(".grid div"));

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

  //draw blocks
  function draw() {
    currentBlock.forEach((index) => {
      squares[currentPosition + index].classList.add("block");
    });
  }

  draw();

  function erase() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("block");
    });
  }
});
