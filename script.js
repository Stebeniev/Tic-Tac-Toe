document.addEventListener("DOMContentLoaded", () => {
  const title = document.querySelector('.main-title');
  const text = title.textContent;
  title.textContent = '';
  title.style.visibility = 'visible';

  let i = 0;
  let gameStarted = false;
  let rulesShown = false;

  function startTitle() {
    if (i < text.length) {
      title.textContent += text.charAt(i);
      i++;
      setTimeout(startTitle, 100);
    }
  }

  startTitle();

  const overlay = document.querySelector('.overlay');
  const gameContainer = document.querySelector('.game-container');
  const gameField = document.querySelector('.game-field');
  const cells = document.querySelectorAll('.cell');
  const scoreNamesX = document.querySelector('.score-namesX');
  const scoreNamesO = document.querySelector('.score-namesO');
  const endGameMessage = document.createElement('div');
  const nameInputContainer = document.getElementById('nameInputContainer');
  const playerNameInput = document.getElementById('playerName');
  const namePrompt = document.getElementById('namePrompt');
  const submitNameButton = document.getElementById('submitName');
  const cancelButton = document.getElementById('cancelName');
  const rules = document.getElementById('modalRules');
  const closeRules = document.getElementById('close-rules');
  const errorMessage = document.createElement('div');

  errorMessage.classList.add('error-massage');
  nameInputContainer.appendChild(errorMessage);

  endGameMessage.classList.add('end-game-message');
  document.body.appendChild(endGameMessage);

  playerNameInput.setAttribute('autocomplete', 'off');
  playerNameInput.focus();

  function showErrorMessage(message) {
    errorMessage.textContent = message;
    errorMessage.style.color = 'white';
    errorMessage.style.fontSize = '40px';
  }

  function showEndGameMessage() {
    endGameMessage.textContent = 'Game over';
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

  function startGame() {
    if (gameStarted) {
      return;
    }

    overlay.style.display = 'none';
    gameContainer.classList.remove('hidden');
    gameContainer.classList.add('visible');

    askPlayerNames();
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !rulesShown) {
      rulesShown = true;
      startGame();
    }
  });

  document.querySelector('.overlay').addEventListener('click', () => {
    if (!rulesShown) {
      rulesShown = true;
      startGame();
    }
  });

  function askPlayerNames() {
    rules.classList.remove('hidden-rules');

    nameInputContainer.style.display = 'none';

    closeRules.onclick = () => {
      rules.classList.add('hidden-rules');
      nameInputContainer.style.display = 'block';
      playerNameInput.focus();

      handleNameInput();
    };
  }
  function handleNameInput() {
    namePrompt.textContent = "Enter the name of the first player (Player X):";
    playerNameInput.focus();

    submitNameButton.onclick = null;

    submitNameButton.onclick = () => {
      const playerName = playerNameInput.value.trim();
      if (playerName === '') {
        showErrorMessage('Please enter your name:');
        return;
      }

      scoreNamesX.textContent = playerName;
      scoreNamesX.classList.add('score-namesX');
      playerNameInput.value = '';
      errorMessage.textContent = '';
      namePrompt.textContent = "Enter the name of the second player (Player O):";
      playerNameInput.focus();

      submitNameButton.onclick = null;
      submitNameButton.onclick = () => {
        const playerOName = playerNameInput.value.trim();
        if (playerOName === '') {
          errorMessage.textContent = '';
          showErrorMessage('Please enter your name:');
          return;
        }

        scoreNamesO.textContent = playerOName;
        scoreNamesO.classList.add('score-namesO');
        errorMessage.textContent = '';
        nameInputContainer.style.display = 'none';
        gameStarted = true;

        gameField.style.opacity = 1;
        showCells();
      };
    };

    cancelButton.addEventListener('click', () => {
      nameInputContainer.style.display = 'none';
      showEndGameMessage();
    });
  }

  function showCells() {
    const cellOrder = [0, 8, 2, 6, 1, 7, 3, 5, 4];

    cellOrder.forEach((cellIndex, orderIndex) => {
      setTimeout(() => {
        cells[cellIndex].style.opacity = 1;
        cells[cellIndex].style.transition = 'opacity 0.5s';
      }, orderIndex * 300);
    });
  }
});
