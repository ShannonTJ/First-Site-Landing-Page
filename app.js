const gameGrid = document.querySelector(".grid");

document.addEventListener("DOMContentLoaded", () => {
  let i = 1;
  while (i < 200) {
    const tetris = document.createElement("div");
    // tetris.classList.add("grid");
    gameGrid.appendChild(tetris);

    i = i + 1;
    console.log(i);
  }
});
