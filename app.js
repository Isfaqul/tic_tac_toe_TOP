const gameboard = function () {
  let board = ["-", "-", "-", "-", "-", "-", "-", "-", "-"];

  const getBoard = () => board;

  const addMarker = (index, player) => {
    board[index - 1] = player;
  };

  const printBoard = () => {
    let printedBoard = "";
    boardCopy = [...getBoard()];

    while (boardCopy[0]) {
      printedBoard += `${boardCopy.splice(0, 3).join(" | ")}\n`;
    }

    console.log(printedBoard);
  };

  const resetBoard = () => {
    board = ["-", "-", "-", "-", "-", "-", "-", "-", "-"];
  };

  return { getBoard, addMarker, printBoard, resetBoard };
};

const gameController = function (player1 = "Player 1", player2 = "Player 2") {
  let board = gameboard();

  const players = [
    {
      name: player1,
      marker: "X",
    },
    {
      name: player2,
      marker: "O",
    },
  ];

  let activePlayer = players[0];

  const switchPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const printNewRound = () => {
    console.log(`It's ${activePlayer.name}'s turn -`);
    board.printBoard();
  };

  const playRound = (index) => {
    if (
      board.getBoard()[index - 1] === players[0].marker ||
      board.getBoard()[index - 1] === players[1].marker
    ) {
      console.log(`\t>> Invalid move! : cell not empty <<`);
      printNewRound();
    } else {
      console.log(`\tAdded ${activePlayer.name}'s marker.`);
      board.addMarker(index, activePlayer.marker);

      let winner = checkWinner();
      if (winner && winner !== "tie") {
        board.printBoard();
        console.log(`ANDD!! ${winner} WINS THE GAME!`);
        gameReset();
      } else if (winner === "tie") {
        board.printBoard();
        gameReset();
        console.log(`THE GAME WAS A TIE`);
      } else {
        switchPlayer();
        printNewRound();
      }
    }
  };

  printNewRound();

  let player1MarkerString = players[0].marker.repeat(3); // creating strings such as "XXX"
  let player2MarkerString = players[1].marker.repeat(3); // to compare with the winning patterns

  const gameReset = () => {
    activePlayer = players[0];
    board.resetBoard();
  };

  const checkWinner = () => {
    let winner = "";
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

    let markerAsPerWinPatterns = [];

    for (let i = 0; i < winPatterns.length; i++) {
      let string = winPatterns[i]
        .map((index) => board.getBoard()[index])
        .join("");

      markerAsPerWinPatterns.push(string);
    }

    markerAsPerWinPatterns.forEach((pattern) => {
      if (pattern === player1MarkerString) {
        winner = players[0].name;
      } else if (pattern === player2MarkerString) {
        winner = players[1].name;
      } else {
        let copy = markerAsPerWinPatterns.join("");
        if (!copy.includes("-")) {
          winner = "tie";
        }
      }
    });

    return winner;
  };

  return { playRound };
};

const game = gameController();
