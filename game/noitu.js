/* --- noitu.js --- */

const startWords = ["Học", "Sách", "Bút", "Vở", "Cây", "Hoa", "Lá", "Mây", "Mưa", "Gió"];

let currentWord = "";
let score = 0;
let timeLeft = 15;
let timerInterval;
let isPlaying = true;

const elScore = document.getElementById("score");
const elCurrentWord = document.getElementById("currentWord");
const elInput = document.getElementById("userInput");
const elMessage = document.getElementById("message");
const elTimerBar = document.getElementById("timerBar");
const btnSubmit = document.getElementById("btnSubmit");
const btnRestart = document.getElementById("btnRestart");

function initGame() {
    isPlaying = true;
    score = 0;
    elScore.innerText = score;
    
    btnRestart.style.display = "none";
    btnSubmit.style.display = "inline-block";
    
    elMessage.innerText = "Bắt đầu thôi!";
    elMessage.className = "";

    currentWord = startWords[Math.floor(Math.random() * startWords.length)];
    elCurrentWord.innerText = currentWord;

    elInput.value = "";
    elInput.disabled = false;
    elInput.focus();

    resetTimer();
}

function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = 15;
    updateTimerBar();

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerBar();
        if (timeLeft <= 0) {
            gameOver();
        }
    }, 1000);
}

function updateTimerBar() {
    const percent = (timeLeft / 15) * 100;
    elTimerBar.style.width = percent + "%";
    
    if (timeLeft <= 5) {
        elTimerBar.style.background = "#d63031";
    } else {
        elTimerBar.style.background = "#ff4757";
    }
}

function checkAnswer() {
    if (!isPlaying) return;

    let text = elInput.value.trim();
    text = text.replace(/\s+/g, ' ');

    if (!text) {
        showMessage("Bạn chưa nhập từ nào cả!", "text-error");
        elInput.focus();
        return;
    }

    const parts = text.split(' ');

    if (parts.length !== 2) {
        showMessage("Sai luật: Phải nhập từ ghép 2 tiếng!", "text-error");
        return;
    }

    const firstPart = parts[0];
    const secondPart = parts[1];

    if (firstPart.toLowerCase() !== currentWord.toLowerCase()) {
        showMessage(`Sai rồi: Từ đầu tiên phải là "${currentWord}"`, "text-error");
        return;
    }

    score++;
    elScore.innerText = score;
    showMessage("Chính xác! Tiếp tục nào.", "text-success");

    currentWord = capitalize(secondPart);
    elCurrentWord.innerText = currentWord;

    elInput.value = "";
    elInput.focus();
    
    resetTimer();
}

function gameOver() {
    clearInterval(timerInterval);
    isPlaying = false;
    elInput.disabled = true;
    
    showMessage(`Hết giờ! Tổng điểm: ${score}`, "text-error");
    
    btnSubmit.style.display = "none";
    btnRestart.style.display = "inline-block";
}

function showMessage(msg, cssClass) {
    elMessage.innerText = msg;
    elMessage.className = cssClass;
}

function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

btnSubmit.addEventListener("click", checkAnswer);
btnRestart.addEventListener("click", initGame);

elInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        checkAnswer();
    }
});

initGame();