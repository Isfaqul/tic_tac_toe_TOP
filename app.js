const gameboard = (function () {
  let board = ["", "", "", "", "", "", "", "", ""];

  // api to access board
  const getBoard = () => board;

  // api to add marker to board
  const addMarker = (index, player) => {
    board[index] = player;
  };

  // api to reset board
  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return { getBoard, addMarker, resetBoard };
})();

const gameController = (function (
  playerOne = "Player 1",
  playerTwo = "Player 2"
) {
  // board access through gameboard API
  let board = gameboard.getBoard();

  // player list
  const players = [
    { name: playerOne, mark: "X" },
    { name: playerTwo, mark: "O" },
  ];

  // setting active player as p1
  let activePlayer = players[0];

  // method to switch player
  const switchPlayer = () => {
    activePlayer === players[0] ? players[1] : players[0];
  };

  // api to get activePlayer
  const getActivePlayer = () => activePlayer;

  // method to PlayRound
  const playRound = (index) => {
    if (board[index] === "X" || board[index] === "O") {
      return "Invalid move, cell already filled.";
    } else if (board[index] !== "X" || board[index] !== "O") {
      gameboard.addMarker(index, activePlayer.mark);
    }
  };

  return { playRound, activePlayer };
})();
