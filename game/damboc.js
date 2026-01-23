// ÂM THANH: Thư mục sounds nằm trong game/ nên chỉ cần gọi sounds/
const snd = {
    punch: new Audio('sounds/punch.mp3'),
    hit: new Audio('sounds/hit.mp3'),
    win: new Audio('sounds/siuuu.mp3'),
    lose: new Audio('sounds/lose.mp3')
};

function play(name) {
    snd[name].currentTime = 0;
    snd[name].play().catch(() => {});
}

const questions = {
    10: [
        { q: "Thiết bị nào là 'não bộ' của máy tính?", a: ["RAM", "CPU", "Chuột", "Loa"], c: 1 },
        { q: "1 Byte bằng bao nhiêu bit?", a: ["4", "8", "16", "32"], c: 1 },
        { q: "Hệ điều hành là phần mềm gì?", a: ["Ứng dụng", "Hệ thống", "Tiện ích", "Đồ họa"], c: 1 },
        { q: "Phím tắt để Copy là gì?", a: ["Ctrl+V", "Ctrl+C", "Ctrl+X", "Ctrl+Z"], c: 1 }
        // ... (Bạn copy các câu hỏi lớp 10, 11, 12 của bạn vào đây)
    ],
    11: [],
    12: []
};

// Lưu ý: Hãy copy toàn bộ 60 câu hỏi mình đã gửi ở các lượt trước vào đây

let pHP = 5, eHP = 5, currentQs = [], qIdx = 0;

function startGame(lv) {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('quiz-area').style.display = 'block';
    currentQs = [...questions[lv]].sort(() => Math.random() - 0.5);
    qIdx = 0; pHP = 5; eHP = 5;
    renderQuestion();
}

function renderQuestion() {
    if (qIdx >= currentQs.length) { alert("Hết câu hỏi!"); location.reload(); return; }
    const q = currentQs[qIdx];
    document.getElementById('question').innerText = q.q;
    const btnBox = document.getElementById('answers');
    btnBox.innerHTML = '';
    q.a.forEach((ans, i) => {
        const btn = document.createElement('button');
        btn.innerText = ans;
        btn.onclick = () => checkAnswer(i === q.c);
        btnBox.appendChild(btn);
    });
}

function checkAnswer(isCorrect) {
    const player = document.getElementById('player');
    const enemy = document.getElementById('enemy');
    const pBox = document.getElementById('player-hp-slots'), eBox = document.getElementById('enemy-hp-slots');

    if (isCorrect) {
        play('punch');
        player.classList.add('player-punch');
        setTimeout(() => {
            player.classList.remove('player-punch');
            enemy.classList.add('hit-shake');
            eBox.classList.add('damaged');
            eHP--;
            updateHP('enemy-hp-slots', eHP);
            setTimeout(() => { enemy.classList.remove('hit-shake'); eBox.classList.remove('damaged'); checkEnd(); }, 300);
        }, 200);
    } else {
        play('hit');
        enemy.classList.add('enemy-punch');
        setTimeout(() => {
            enemy.classList.remove('enemy-punch');
            player.classList.add('hit-shake');
            pBox.classList.add('damaged');
            pHP--;
            updateHP('player-hp-slots', pHP);
            setTimeout(() => { player.classList.remove('hit-shake'); pBox.classList.remove('damaged'); checkEnd(); }, 300);
        }, 200);
    }
}

function updateHP(id, val) {
    const slots = document.getElementById(id).children;
    for (let i = 4; i >= val; i--) { if(slots[i]) slots[i].classList.add('lost'); }
}

function checkEnd() {
    if (eHP <= 0) showResult("win");
    else if (pHP <= 0) showResult("lose");
    else { qIdx++; renderQuestion(); }
}

function showResult(status) {
    const screen = document.getElementById('result-screen');
    document.getElementById('quiz-area').style.display = 'none';

    if (status === "win") {
        play('win');
        document.getElementById('result-title').innerText = "BẠN CHIẾN THẮNG!";
        document.getElementById('result-img').src = "../images/hocsinh.jpeg";
        document.getElementById('result-msg').innerText = "HỌC SINH ĐÃ ĐÁNH BẠI ROBOT!";
    } else {
        play('lose');
        document.getElementById('result-title').innerText = "THẤT BẠI!";
        document.getElementById('result-img').src = "../images/robot-win.jpeg";
        document.getElementById('result-msg').innerText = "ROBOT ĐÃ CHIẾN THẮNG!";
    }
    screen.style.display = "flex";
}
