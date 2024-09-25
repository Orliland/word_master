function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function checkCompleteWord(inputs) {
  let word = "";
  inputs.forEach((input) => {
    word += input.value;
  });
  if (word.length == 5) {
    // Realizar Evaluación con API
  }
}

function setRowActive(activeRow) {
  const inputsAbles = [
    ...document.querySelectorAll(`.board__input.r${activeRow}`),
  ];

  const inputsDisabled = [
    ...document.querySelectorAll(`.board__input:not(.r${activeRow})`),
  ];

  for (let i = 0; i < inputsAbles.length; i++) {
    const element = inputsAbles[i];
    element.removeAttribute("disabled");
    element.maxLength = 1;

    element.addEventListener("keyup", (event) => {
      // TODO: Refactorizar y convertir en una función
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

setRowActive(4);
