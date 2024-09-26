# My Word Master Version

This is my final project of the COMPLETE INTRO TO WEB DEV course from FrontendMasters.

[Project Info](https://btholt.github.io/complete-intro-to-web-dev-v3/lessons/talking-to-servers/project)

## Requirements

- There is a secret five letter word chosen
- Players have six guesses to figure out the secret word. After six guesses, they lose
- If the player guesses a letter that is in the right place, it is shown as green

* If the player guesses a letter that is in the word but not in the right place, it is shown as yellow
  \*It does account for however many of the letter exist in the word. For example, if the player guesses "SPOOL" and the word is "OVERT", one "O" is shown as yellow and the second one is not.
* If the player guesses the right word, the player wins and the game is over.

## Docs

### checkLetters()

Función encargada de comprobar si las letras son correctas, están mal posicionadas o son incorrectas.

**Objetivos**

- Comprobar si la letra es la misma que la contraparte de la misma posición, si es asi, la casilla se marcara color VERDE.
- Si la letra si se encuentra dentro de la PALABRA, pero en otra posición, marcar la casilla de color AMARILLO.
  - Si la letra se encuentra repetida dentro de la PALABRA, solo marcar la primera en aparecer.
  - Si se incluyen dos o mas veces las mismas letras y estas a su vez tienen la misma cantidad en la contra parte o mas de una, marcar cada una de las opciones.
- Si la letra no se encuentra dentro de la PALABRA, marcar la casilla de color ROJO.
