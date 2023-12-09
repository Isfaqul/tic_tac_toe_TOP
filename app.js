const gameboard = (function () {
  let board = ["", "", "", "", "", "", "", "", ""];

  const printBoard = () => {
    let printedBoard = "";
    boardCopy = [...getBoard()];

    while (boardCopy[0]) {
      printedBoard += `${boardCopy.splice(0, 3).join(" | ")}\n`;
    }

    console.log(printedBoard);
  };

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

  return { getBoard, addMarker, resetBoard, printBoard };
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
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  // roundCounter
  let roundCount = 0;

  // api to get activePlayer
  const getActivePlayer = () => activePlayer;

  // New Round Message
  const printNewRound = () => {
    return `It's ${activePlayer.name}'s turn`;
  };

  // method to PlayRound
  const playRound = (index) => {
    if (board[index] === "X" || board[index] === "O") {
      return "Invalid move, cell already filled.";
    } else if (board[index] !== "X" || board[index] !== "O") {
      gameboard.addMarker(index, activePlayer.mark);
      // Switch player after successful marker addition
      // gameboard.printBoard();
      switchPlayer();
      // increment the roundNumber
      roundCount++;
      // Check for winner
      checkWinner();
    }
  };

  // winning patterns
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // string of 3 markers to be used to check winner
  let player1MarkerString = players[0].mark.repeat(3); // creating strings such as "XXX"
  let player2MarkerString = players[1].mark.repeat(3); // to compare with the winning patterns

  // method to check winner
  const checkWinner = () => {
    // Store an array of string of 3 chars
    // Extracted from board using the "winPatterns" indexes
    let currentMarkerStringsFromBoard = [];

    // loop over the winPatterns and get a string of 3 marks
    // from the board and push them in the above array
    for (let i = 0; i < winPatterns.length; i++) {
      let string = winPatterns[i].map((index) => board[index]).join("");

      currentMarkerStringsFromBoard.push(string);
    }

    // compare with p1 & p2 marker string
    // to check if we have a winner
    currentMarkerStringsFromBoard.forEach((string) => {
      if (string === player1MarkerString) {
        console.log(players[0].name);
        return players[0].name;
      } else if (string === player2MarkerString) {
        console.log(players[0].name);
        return players[1].name;
      } else {
        // If the round number is 9
        // All cells are filled
        // And we can declare the game as a tie
        if (roundCount === 9) {
          // console.log("tie");
          return "tie";
        }
      }
    });
  };

  // get winners name
  const getWinner = () => checkWinner();

  // declaring winner message
  const declareWinner = () => {
    if (getWinner() !== "tie") {
      return `${getWinner()} wins the game!`;
    } else if (getWinner() === "tie") {
      return `The game was a tie`;
    }
  };

  // reset the game
  const resetGame = () => {
    gameboard.resetBoard();
    roundCount = 0;
  };

  return { playRound, activePlayer, declareWinner, printNewRound };
})();
