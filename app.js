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

const gameController = (function () {
  // board access through gameboard API
  let board = gameboard.getBoard();

  // player list
  let players = [
    { name: "Player 1", mark: "X" },
    { name: "Player 2", mark: "O" },
  ];

  const fetchPlayerDetails = () => {
    let dialogEl = document.querySelector("dialog");
    let formSubmitBtn = document.querySelector("#start-game-btn");
    formSubmitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      players[0].name = document.querySelector("#p1-name").value || "Player 1";
      players[1].name = document.querySelector("#p2-name").value || "Player 2";

      dialogEl.close();
      displayController.updateDisplay();
    });
  };

  fetchPlayerDetails();

  // method to get acces player names
  const getPlayerNames = () => [players[0].name, players[1].name];

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
    if (board[index] === players[0].mark || board[index] === players[1].mark) {
      return "Invalid move, cell already filled.";
    } else if (
      board[index] !== players[0].mark ||
      board[index] !== players[1].mark
    ) {
      gameboard.addMarker(index, activePlayer.mark);
      // Switch player after successful marker addition
      gameboard.printBoard();
      switchPlayer();
      // increment the roundNumber
      roundCount++;
      // Check for winner
      checkWinner();
      console.log(roundCount);
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
    let winner;
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
        winner = players[0].name;
      } else if (string === player2MarkerString) {
        winner = players[1].name;
      } else if (roundCount > 8 && !winner) {
        // If the round number is 9
        // All cells are filled
        // And we can declare the game as a tie
        winner = "tie";
      }
    });

    return winner;
  };

  // get winners name
  const getWinner = () => checkWinner();

  // declaring winner message
  const declareResult = () => {
    if (getWinner() !== "tie") {
      return `${getWinner()} wins the game!`;
    } else if (getWinner() === "tie") {
      return `The game was a tie`;
    }
  };

  // reset the game
  const resetGame = () => {
    gameboard.resetBoard();
    activePlayer = players[0];
    roundCount = 0;
  };

  return {
    playRound,
    activePlayer,
    getWinner,
    declareResult,
    printNewRound,
    resetGame,
    getPlayerNames,
  };
})();

const displayController = (function () {
  const gameBoardContainerEl = document.querySelector(".gameboard-container");
  const cellItems = document.querySelectorAll(".cell-item");
  const messageEl = document.querySelector(".game-message");

  cellItems.forEach((cell) => {
    cell.addEventListener("click", () => {
      let cellIndex = Array.from(gameBoardContainerEl.children).indexOf(cell);
      gameController.playRound(cellIndex);
      updateDisplay();

      // Disable clicking if winner is found
      if (gameController.getWinner()) {
        disableButtons();
      }
    });
  });

  function updateDisplay() {
    let board = gameboard.getBoard();
    cellItems.forEach((cell, index) => (cell.innerText = board[index]));

    // update player names
    let p1NameEl = document.querySelector("[data-p1]");
    let p2NameEl = document.querySelector("[data-p2]");
    p1NameEl.innerText = gameController.getPlayerNames()[0];
    p2NameEl.innerText = gameController.getPlayerNames()[1];

    // Update message depening on whether there is a winner
    if (!gameController.getWinner()) {
      messageEl.innerText = gameController.printNewRound();
    } else {
      messageEl.innerText = gameController.declareResult();
      gameController.resetGame();
    }
  }

  updateDisplay();

  // function to disable buttons
  function disableButtons() {
    cellItems.forEach((cell) => {
      cell.style.pointerEvents = "none";
    });
  }

  // function to enable buttons
  function enableButtons() {
    cellItems.forEach((cell) => {
      cell.style.pointerEvents = "auto";
    });
  }

  return { updateDisplay };
})();
