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
    const dicLetter = { letter: l, index: i };
    if (l == word[i]) {
      dicLetter["status"] = "green";
    } else if (word.includes(l)) {
      dicLetter["status"] = "yellow";
    } else {
      dicLetter["status"] = "error";
    }
    return dicLetter;
  });

  const filterYellowLetters = letters.map((letter, index) => {
    if (letter.status == "yellow") {
      let count = letters.filter((l) => l.letter == letter.letter).length; // Cuantas veces aparece la letra actual
      const countGreenLetters = letters.filter((l) => {
        // Cuantas veces aparece en verde la letra actual
        return l.letter == letter.letter && l.status == "green";
      }).length;
      console.log(count);

      if (count > countGreenLetters) {
        count -= 1;
      } else {
        letter.status = "error";
      }
    }
    return letter;
  });

  // const filterYellowLetters = letters.map((e, i) => {
  //   if (e.status == "yellow") {
  //     let count = letters.filter((l) => l.letter == e.letter);

  //     if (count.length > countLetters[e.letter]) {
  //       e.status = "error";
  //     }
  //   }
  //   return e;
  // });

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
      youWin();
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

async function setRowActive(activeRow) {
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
        inputsAbles[i].value = action;
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
