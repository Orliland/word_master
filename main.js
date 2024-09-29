const URL_GET_WORD = "https://words.dev-apis.com/word-of-the-day";
let WORD;
let guessWord;
let randomGame = false; // Indicate if the game is with a random word
let TRY = 0;

let INPUTS = [...document.querySelectorAll(".board__input")];
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

function cleanBoard() {
  INPUTS.forEach((input) => {
    input.disabled = true;
    input.maxLength = 1;
    input.value = "";
    input.classList.remove("success");
    input.classList.remove("alert");
    input.classList.remove("error");
    input.removeAttribute("onkeydown");
  });
}

async function startGame() {
  guessWord = "";
  TRY = 0;
  WORD = await getWord(randomGame);

  cleanBoard();

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

let ROWTRY;

function handleKeyDown(input, event, index) {
  const action = event.key;

  if (action === "Enter") {
    validateGuessWord(ROWTRY);
  } else if (action === "Backspace") {
    if (index > 0 && input.value === "") {
      ROWTRY[index - 1].focus();
    }
  } else if (isLetter(action)) {
    input.value = action.toUpperCase();
    event.preventDefault();

    if (index < ROWTRY.length - 1) {
      ROWTRY[index + 1].focus();
    }
  } else {
    event.preventDefault();
  }
}

function playTry() {
  const rowTry = INPUTS.filter((input) => {
    input.disabled = true;
    return input.classList.contains(`r${TRY}`);
  });

  rowTry[0].disabled = false;
  rowTry[0].focus();

  ROWTRY = rowTry;

  rowTry.forEach((input, index) => {
    input.removeAttribute("disabled");

    input.setAttribute("onkeydown", `handleKeyDown(this, event, ${index})`);
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
