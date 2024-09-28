const URL_GET_WORD = "https://words.dev-apis.com/word-of-the-day";

let word;
let row = 1;

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function checkLetters(inputs, wordTry) {
  word = [...word];
  wordTry = [...wordTry];

  let countLetters = [...word].reduce((acc, vActual) => {
    acc[vActual] = (acc[vActual] || 0) + 1;
    return acc;
  }, {});

  for (let i = 0; i < 5; i++) {
    if (word[i] === wordTry[i]) {
      inputs[i].classList.add("success");
      countLetters[word[i]]--;
    }
  }

  for (let i = 0; i < 5; i++) {
    if (word[i] === wordTry[i]) {
      // do nothing
    } else if (word.includes(wordTry[i]) && countLetters[wordTry[i]] > 0) {
      inputs[i].classList.add("alert");
      countLetters[word[i]]--;
    } else {
      inputs[i].classList.add("error");
    }
  }
}

async function checkCompleteWord(inputs) {
  let wordTry = "";
  inputs.forEach((input) => {
    wordTry += input.value;
  });

  if (wordTry.length == 5) {
    if (wordTry == word) {
      youWin();
    } else {
      if (row < 6) {
        row += 1;
      } else {
        checkLetters(inputs, wordTry);

        gameOver();
      }

      checkLetters(inputs, wordTry);
      setRowActive(row);
    }
  }
}

async function setRowActive(activeRow) {
  const inputsAbles = [
    ...document.querySelectorAll(`.board__input.r${activeRow}`),
  ];

  const inputsDisabled = [
    ...document.querySelectorAll(`.board__input:not(.r${activeRow})`),
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

async function getWord(random) {
  // TODO: Agregar indicador de cargando el cual no se quitara hasta que no cargue la palabra
  const URL = random ? URL_GET_WORD + "?random=1" : URL_GET_WORD;
  const res = await fetch(URL);
  const resObj = await res.json();
  word = resObj.word.toUpperCase();
  setRowActive(row);
}

getWord(false);
