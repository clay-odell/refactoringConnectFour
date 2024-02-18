/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
  constructor(p1, p2, width = 7, height = 6) {
    this.players = [p1, p2];
    this.currPlayer = p1;
    this.width = width;
    this.height = height;
    this.board = [];
  }
  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }
  makeHtmlBoard() {
    const board = document.getElementById("board");
    board.innerHTML = "";
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    // Use an arrow function to ensure 'this' refers to the Game object
    top.addEventListener("click", (evt) => this.handleClick(evt));
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }
    board.append(top);
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("tr");
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }
      board.append(row);
    }
  }
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }
  placeInTable(y, x) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }
  endGame(msg) {
    setTimeout(() => alert(msg), 200);
    this.gameOver = true;
  }
  handleClick(evt) {
    if (this.gameOver) {
      return;
    }
    const x = +evt.target.id;
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    if (this.checkForWin()) {
      return this.endGame(`${this.currPlayer.name} won!`);
    }
    if (this.board.every((row) => row.every((cell) => cell))) {
      return this.endGame("Tie!");
    }
    this.currPlayer =
      this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }
  checkForWin() {
    const _win = (cells) => {
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    };

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];

        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
    return false;
  }
  startGame() {
    this.board = [];
    this.makeBoard();
    this.makeHtmlBoard();
    this.gameOver = false;
    this.currPlayer = this.players[0];
  }
}

class Player {
  constructor(name, color) {
    this.name = name;
    this.color = color;
  }
}

let game;
document
  .querySelector("#color-form")
  .addEventListener("submit", function (evt) {
    evt.preventDefault();
    let p1 = new Player("Player 1", document.querySelector("#p1-color").value);
    let p2 = new Player("Player 2", document.querySelector("#p2-color").value);
    game = new Game(p1, p2);
    game.startGame();
  });
