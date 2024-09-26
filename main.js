const URL_GET_WORD = "https://words.dev-apis.com/word-of-the-day";

let word;
let row = 1;

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function checkLetters(inputs, wordTry) {
  const countLetters = [...word].reduce((acc, vActual) => {
    acc[vActual] = (acc[vActual] || 0) + 1;
    return acc;
  }, {});

  const letters = [...wordTry].map((l, i) => {
    if (l == word[i]) {
      return { letter: l, index: i, status: "green" };
    } else if (word.includes(l)) {
      return { letter: l, index: i, status: "yellow" };
    } else {
      return { letter: l, index: i, status: "error" };
    }
  });

  const filterYellowLetters = letters.map((e, i) => {
    if (e.status == "yellow") {
      let count = letters.filter((l) => l.letter == e.letter);
      if (count.length > countLetters[e.letter]) {
        e.status = "error";
        return e;
      } else {
        return e;
      }
    } else {
      return e;
    }
  });

  filterYellowLetters.forEach((e) => {
    inputs[e.index].classList.add(e.status);
  });
}

async function checkCompleteWord(inputs) {
  let wordTry = "";
  inputs.forEach((input) => {
    wordTry += input.value.toLowerCase();
  });

  if (wordTry.length == 5) {
    if (wordTry == word) {
      alert("GANASTE!");
    } else {
      if (row < 6) {
        row += 1;
      } else {
        gameOver();
      }

      checkLetters(inputs, wordTry);

      setRowActive(row);
    }
  }
}

function setRowActive(activeRow) {
  const inputsAbles = [
    ...document.querySelectorAll(`.board__input.r${activeRow}`),
  ];

  const inputsDisabled = [
    ...document.querySelectorAll(`.board__input:not(.r${activeRow})`),
  ];

  inputsAbles[0].focus();

  for (let i = 0; i < inputsAbles.length; i++) {
    const element = inputsAbles[i];
    element.removeAttribute("disabled");
    element.maxLength = 1;

    element.addEventListener("keyup", (event) => {
      if (
        !isLetter(event.key) &&
        event.key != "Backspace" &&
        event.key != "Enter"
      ) {
        event.preventDefault();
      } else if (event.key == "Backspace") {
        if (i > 0 && element.value == "") {
          inputsAbles[i - 1].focus();
        }
      } else if (event.key == "Enter") {
        checkCompleteWord(inputsAbles);
      } else {
        inputsAbles[i].value = event.key;
        if (i < inputsAbles.length - 1) {
          inputsAbles[i + 1].focus();
        }
      }
    });
  }

  inputsDisabled.forEach((e) => {
    e.disabled = true;
  });
}

function getWord() {
  const peticion = fetch(URL_GET_WORD);
  peticion
    .then((response) => response.json())
    .then((response) => {
      word = response.word;
      setRowActive(row);
    });
}

getWord();
