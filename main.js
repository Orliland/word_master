const URL_GET_WORD = "https://words.dev-apis.com/word-of-the-day";
let WORD;
let guessWord;
let randomGame = false; // Indicate if the game is with a random word
let TRY = 0;

const INPUTS = [...document.querySelectorAll(".board__input")];
const FORM = document.querySelector(".board");
const MODAL = document.querySelector(".modal");
const modalCanvas = document.querySelector(".modal__canvas");
const startButton = document.querySelector(".modal__button");

// Listen to Start Game Button
startButton.addEventListener("click", (e) => {
  startGame();
  if (!randomGame) {
    randomGame = true;
  }
});

function cleanBoard(cleanClasses) {
  guessWord = "";
  TRY = 0;

  INPUTS.forEach((input) => {
    input.disabled = true;
    input.maxLength = 1;
    input.value = "";
    input.classList.remove("success");
    input.classList.remove("alert");
    input.classList.remove("error");
  });
}

async function startGame() {
  WORD = await getWord(randomGame);

  cleanBoard(false);
  MODAL.style.display = "none";
  playTry();
}

function endGame(result) {
  const messages = {
    win: `<h2 class="modal__title">You Win!</h2>`,
    lose: `<h2 class="modal__title">You Lose!</h2>
        <p class="modal__text">
          The correct word was <b>${WORD}</b>
        </p>`,
  };

  modalCanvas.innerHTML = messages[result];
  modalCanvas.classList.add(result);
  MODAL.style.display = "block";
}

async function getWord(isRandom) {
  const URL = isRandom ? URL_GET_WORD + "?random=1" : URL_GET_WORD;
  const res = await fetch(URL);
  const resObj = await res.json();
  const word = resObj.word.toUpperCase();
  return word;
}

function playTry() {
  const rowTry = INPUTS.filter((input) => {
    input.disabled = true;
    return input.classList.contains(`r${TRY}`);
  });

  rowTry[0].disabled = false;
  rowTry[0].focus();

  rowTry.forEach((input, index) => {
    input.removeAttribute("disabled");

    input.addEventListener("keydown", (event) => {
      const action = event.key;

      if (action === "Enter") {
        validateGuessWord(rowTry);
      } else if (action === "Backspace") {
        if (index > 0 && input.value === "") {
          rowTry[index - 1].focus();
        }
      } else if (isLetter(action)) {
        input.value = action.toUpperCase();
        event.preventDefault();

        if (index < rowTry.length - 1) {
          // Jump to the next input
          rowTry[index + 1].focus();
        }
      } else {
        event.preventDefault();
      }
    });
  });
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function validateGuessWord(inputs) {
  guessWord = inputs
    .map((input) => {
      return input.value;
    })
    .join("");

  if (guessWord.length === 5) {
    checkLetters(inputs);

    if (guessWord === WORD) {
      endGame("win");
    } else {
      if (TRY < 5) {
        TRY += 1;

        playTry();
      } else {
        endGame("lose");
      }
    }
  } else {
  }
}

function checkLetters(inputs) {
  wordList = [...WORD];
  tryList = [...guessWord];

  let countLetters = [...wordList].reduce((acc, vActual) => {
    acc[vActual] = (acc[vActual] || 0) + 1;
    return acc;
  }, {});

  for (let i = 0; i < 5; i++) {
    if (wordList[i] === tryList[i]) {
      inputs[i].classList.add("success");
      countLetters[wordList[i]]--;
    }
  }

  for (let i = 0; i < 5; i++) {
    if (wordList[i] === tryList[i]) {
      // do nothing
    } else if (wordList.includes(tryList[i]) && countLetters[tryList[i]] > 0) {
      inputs[i].classList.add("alert");
      countLetters[tryList[i]]--;
    } else {
      inputs[i].classList.add("error");
    }
  }
}
