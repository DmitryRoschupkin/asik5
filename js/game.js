const MAX_LIVES = 6;
const WORDS_DATABASE = [
    { word: "javascript", hint: "Язык программирования для Frontend-а"},
    { word: "браузер", hint: "Через эту программу можно выходить в Интернет"},
    { word: "переменная", hint: "Хранилище данных в программировании"},
];

let currentWord = "";
let currentHint = "";
let guessedLetters = [];
let livesLeft = MAX_LIVES;
let isGameOver = false;

const wordDisplay = document.getElementById("word-display");
const hintDisplay = document.getElementById("hint-display");
const livesDisplay = document.getElementById("lives-display");
const messageDisplay = document.getElementById("message-display");
const letterInput = document.getElementById("letter-input");
const guessBtn = document.getElementById("guess-btn");
const restartBtn = document.getElementById("restart-btn");

function initGame() {
    isGameOver = false;
    livesLeft = MAX_LIVES;
    guessedLetters = [];
    messageDisplay.textContent = "";
    letterInput.disabled = false;
    guessBtn.disabled = false;

    const randomIndex = Math.floor(Math.random() * WORDS_DATABASE.length);
    currentWord = WORDS_DATABASE[randomIndex].word;
    currentHint = WORDS_DATABASE[randomIndex].hint;

    hintDisplay.textContent = "Подсказка: " + currentHint;
    updateState();
    restartBtn.style.display = "none";
}

function updateState() {
    let displayedString = "";
    let allGuessed = true;

    for (let i = 0; i < currentWord.length; i++) {
        const letter = currentWord[i];
        if (guessedLetters.includes(letter)) {
            displayedString += letter + " ";
        } else {
            displayedString += "_ ";
            allGuessed = false;
        }
    }

    wordDisplay.textContent = displayedString.trim();
    livesDisplay.textContent = "Осталось жизней: " + livesLeft;

    if (allGuessed) {
        messageDisplay.textContent = "Поздравляем! Вы выйграли АААААААВТОМОБИЛЬ!";
        endGame();
    } else if (livesLeft <= 0) {
        messageDisplay.textContent = "Игра окончена! Вы почти угадали слово " + currentWord;
        endGame();
    }
}

function endGame() {
    isGameOver = true;
    restartBtn.style.display = "block";
    letterInput.disabled = true;
    guessBtn.disabled = true;
}

function handleGuess() {
    if (isGameOver) return;

    const guess = letterInput.value.toLowerCase().trim();
    letterInput.value = "";
    letterInput.focus();

    const isValidLetter = guess.length === 1 && /^[а-яёa-z]$/i.test(guess);

    if (!isValidLetter) {
        messageDisplay.textContent = "Введите ровно одну букву! Я хоть и код студента, но меня не обманешь!";
        return;
    }

    if (guessedLetters.includes(guess)) {
        messageDisplay.textContent = "Вы уже называли эту букву!";
        return;
    }

    guessedLetters.push(guess);

    if (currentWord.includes(guess)) {
        messageDisplay.textContent = "Да ладно! Есть такая буква!";
    } else {
        livesLeft--;
        messageDisplay.textContent = "Увы и ах, нет такой буквы, как и одной жизни в запасе (я про игру, если что)";
    }

    updateState();
}

guessBtn.addEventListener("click", handleGuess);
restartBtn.addEventListener("click", initGame);

letterInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        handleGuess();
    }
});

initGame();