const URL_GET_WORD = "https://words.dev-apis.com/word-of-the-day";
let WORD;
let randomGame = false; // Indicate if the game is with a random word

const INPUTS = document.querySelectorAll(".board__input");
const FORM = document.querySelector(".board");
const MODAL = document.querySelector(".modal");
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
    input.classList.remove("success");
    input.classList.remove("alert");
    input.classList.remove("error");
  });

  FORM.reset();
}

// TODO: Función para manejar el inicio del juego
async function startGame() {
  WORD = await getWord(randomGame);
  cleanBoard();
  MODAL.style.display = "none";
  playTry();
}

// TODO: Función para manejar el final del juego
function endGame(result) {
  const messages = {
    win: "",
    lose: "",
  };
}

async function getWord(isRandom) {
  const URL = isRandom ? URL_GET_WORD + "?random=1" : URL_GET_WORD;
  const res = await fetch(URL);
  const resObj = await res.json();
  const word = resObj.word.toUpperCase();
  return word;
}

function playTry() {}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let word;
let row = 1;

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function checkLetters(inputs, wordTry) {
  wordList = [...word];
  wordTry = [...wordTry];

  let countLetters = [...wordList].reduce((acc, vActual) => {
    acc[vActual] = (acc[vActual] || 0) + 1;
    return acc;
  }, {});

  for (let i = 0; i < 5; i++) {
    if (wordList[i] === wordTry[i]) {
      inputs[i].classList.add("success");
      countLetters[wordList[i]]--;
    }
  }

  for (let i = 0; i < 5; i++) {
    if (wordList[i] === wordTry[i]) {
      // do nothing
    } else if (wordList.includes(wordTry[i]) && countLetters[wordTry[i]] > 0) {
      inputs[i].classList.add("alert");
      countLetters[wordList[i]]--;
    } else {
      inputs[i].classList.add("error");
    }
  }
}

// const winnerModal = document.querySelector(".winner");
// const loserModal = document.querySelector(".loser");
// const loserWord = document.querySelector(".modal__word");

// const buttonModal = document.querySelectorAll(".modal__button");
// const form = document.querySelector(".board");

// buttonModal.forEach((button) => {
//   button.addEventListener("click", newGame);
// });

function newGame() {
  row = 1;

  form.reset();
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.style.display = "none";
  });

  document.querySelectorAll(`.board__input`).forEach((input) => {
    input.classList.remove("success");
    input.classList.remove("alert");
    input.classList.remove("error");
  });

  getWord(true);
}

function checkCompleteWord(inputs) {
  const guess = inputs
    .map((input) => {
      return input.value;
    })
    .join("");

  if (guess.length == 5) {
    checkLetters(inputs, guess);

    if (guess === word) {
      winnerModal.style.display = "block";
      inputs.forEach((e) => {
        e.disabled = true;
      });
    } else {
      if (row < 6) {
        row += 1;
        setRowActive(row);
      } else {
        loserModal.style.display = "block";
        loserWord.innerText = word;

        inputs.forEach((e) => {
          e.disabled = true;
        });
      }
    }
  }
}

async function setRowActive() {
  const inputsAbles = [...document.querySelectorAll(`.board__input.r${row}`)];

  const inputsDisabled = [
    ...document.querySelectorAll(`.board__input:not(.r${row})`),
  ];

  inputsAbles[0].disabled = false;
  inputsAbles[0].focus();

  for (let i = 0; i < inputsAbles.length; i++) {
    const element = inputsAbles[i];
    element.removeAttribute("disabled");
    element.maxLength = 1;

    // Refactor event listener, I like more the way Brian code this part
    element.addEventListener("keydown", (event) => {
      const action = event.key;

      if (action === "Enter") {
        checkCompleteWord(inputsAbles);
      } else if (action === "Backspace") {
        if (i > 0 && element.value === "") {
          inputsAbles[i - 1].focus();
        }
      } else if (isLetter(action)) {
        inputsAbles[i].value = action.toUpperCase();
        event.preventDefault();
        if (i < inputsAbles.length - 1) {
          inputsAbles[i + 1].focus();
        }
      } else {
        event.preventDefault();
      }
    });
  }

  inputsDisabled.forEach((e) => {
    e.disabled = true;
  });
}
