document.addEventListener('DOMContentLoaded', () => {
  const cells = document.querySelectorAll('.cell');
  let currentPlayer = 'X';
  let gameOver = false;

  const winMessage = document.querySelector('.win-message');
  const continueBtn = document.getElementById('continueBtn');
  const endGameBtn = document.getElementById('endGameBtn');
  const endGameMessage = document.createElement('div');
  const drawMessage = document.createElement('div');
  const scorePlX = document.querySelector('.score-x');
  const scorePlY = document.querySelector('.score-y');
  const playerX = document.querySelector('.score-namesX');
  const playerO = document.querySelector('.score-namesO');
  const mainScore = document.querySelector('.players-score-wrapper');
  const showScoreBtn = document.getElementById('show-score');
  const playersScore = document.querySelector('.players-score');
  const playersList = document.getElementById('players-list');
  const scoresList = document.getElementById('scores-list');

  endGameMessage.classList.add('end-game-message');
  drawMessage.classList.add('draw-message');
  document.body.appendChild(endGameMessage);
  document.body.appendChild(drawMessage);

  let scoreX = 0;
  let scoreO = 0;
  const winScore = 3;

  const winComb = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function showPlayersScore() {
    playersScore.style.display = 'block';
    setTimeout(() => {
      playersScore.style.display = 'none';
    }, 3000);
  }

  showScoreBtn.addEventListener('click', showPlayersScore);

  function resetGame() {
    cells.forEach(cell => (cell.textContent = ''));
    currentPlayer = 'X';
    gameOver = false;
    winMessage.style.display = 'none';
    drawMessage.style.display = 'none';
  }

  function addToScore(playerName, score) {
    let board = JSON.parse(localStorage.getItem('board')) || [];
    board.push({ name: playerName, score: score });
    board.sort((a, b) => b.score - a.score);
    board = board.slice(0, 10);
    localStorage.setItem('board', JSON.stringify(board));
    showBoard();
  }

  function showBoard() {
    playersList.innerHTML = '';
    scoresList.innerHTML = '';

    const board = JSON.parse(localStorage.getItem('board')) || [];

    board.forEach(player => {
      let playerItem = document.createElement('li');
      playerItem.classList.add('score-items-name');
      playerItem.textContent = player.name;
      playersList.appendChild(playerItem);

      let scoreItem = document.createElement('li');
      scoreItem.classList.add('score-items-score');
      scoreItem.textContent = player.score;
      scoresList.appendChild(scoreItem);
    });
  }

  function showEndGameMessage() {
    endGameMessage.textContent = 'Game over.';
    endGameMessage.classList.add('show-message');

    setTimeout(() => {
      endGameMessage.classList.remove('show-message');
      setTimeout(() => {
        endGameMessage.innerHTML = 'If you want to continue click <span class="yes-button">YES</span>...';
        endGameMessage.classList.add('continue-message');

        const yesButton = document.querySelector('.yes-button');
        yesButton.addEventListener('click', () => {
          location.reload();
        });
      }, 500);
    }, 2000);
  }

  function checkWin(cells) {
    for (const comb of winComb) {
      const [a, b, c] = comb;
      if (cells[a].textContent && cells[a].textContent === cells[b].textContent && cells[a].textContent === cells[c].textContent) {
        return cells[a].textContent;
      }
    }
    return null;
  }

  function checkDraw(cells) {
    return Array.from(cells).every(cell => cell.textContent !== '');
  }

  function cellClick(e) {
    const cell = e.target;
    if (cell.textContent !== '' || gameOver) {
      return;
    }
    cell.textContent = currentPlayer;

    const winner = checkWin(cells);
    if (winner) {
      gameOver = true;
      let winnerName = winner === 'X' ? playerX.textContent : playerO.textContent;

      if (winner === 'X') {
        scoreX++;
        scorePlX.textContent = scoreX;
      } else {
        scoreO++;
        scorePlY.textContent = scoreO;
      }

      if (scoreX === winScore || scoreO === winScore) {
        setTimeout(() => {
          winMessage.querySelector('.win-text').textContent = `${winnerName} the Best!`;
          winMessage.style.display = 'block';

          addToScore(winnerName, winner === 'X' ? scoreX : scoreO);

          setTimeout(() => {
            showEndGameMessage();
          }, 2000);
        }, 500);
      } else {
        setTimeout(() => {
          winMessage.querySelector('.win-text').textContent = `Player: ${winnerName} Won!`;
          winMessage.style.display = 'block';
        }, 500);
      }
    } else {
      if (checkDraw(cells)) {
        gameOver = true;
        drawMessage.textContent = `It's a Draw!`;
        drawMessage.classList.add('show-message');
        drawMessage.style.display = 'block';
        const continueDrawBtn = document.createElement('button');
        continueDrawBtn.classList.add('players-draw')
        continueDrawBtn.textContent = 'OK!!!';
        continueDrawBtn.addEventListener('click', () => {
          resetGame(); // Сброс игры
          drawMessage.style.display = 'none';
        });
        drawMessage.appendChild(continueDrawBtn);
      } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      }
    }
  }

  continueBtn.addEventListener('click', resetGame);
  endGameBtn.addEventListener('click', () => {
    gameOver = true;
    winMessage.style.display = 'none';
    showEndGameMessage();
  });

  cells.forEach(cell => {
    cell.addEventListener('click', cellClick);
  });

  showBoard();
});
