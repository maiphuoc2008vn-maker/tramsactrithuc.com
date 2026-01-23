/* ==========================================================================
   DATA & CONFIG
   ========================================================================== */
const questionDatabase = {
    "10a1": [
        { image: "../images/5.jpg", answer: "BANPHIM", hint: "Thiết bị nhập dữ liệu (7 ký tự)" },
        { image: "../images/6.jpg", answer: "CHUOT", hint: "Thiết bị điều khiển con trỏ (5 ký tự)" },
        { image: "../images/19.jpg", answer: "USB", hint: "Thiết bị lưu trữ di động (3 ký tự)" },
        { image: "../images/28.jpg", answer: "WEBCAM", hint: "Camera kỹ thuật số (6 ký tự)" },
        { image: "../images/29.jpg", answer: "TAINGHE", hint: "Thiết bị âm thanh (7 ký tự)" },
        { image: "../images/44.jpg", answer: "HDD", hint: "Ổ cứng đĩa từ (3 ký tự)" },
        { image: "../images/45.jpg", answer: "SSD", hint: "Ổ cứng thể rắn (3 ký tự)" },
        { image: "../images/43.jpg", answer: "RAM", hint: "Bộ nhớ truy cập ngẫu nhiên (3 ký tự)" },
        { image: "../images/cpu.jpg", answer: "CPU", hint: "Bộ não máy tính (3 ký tự)" },
        { image: "../images/7.jpg", answer: "WINDOWS", hint: "Hệ điều hành của Microsoft (7 ký tự)" },
        { image: "../images/9.jpg", answer: "WORD", hint: "Phần mềm soạn thảo (4 ký tự)" },
        { image: "../images/3.jpg", answer: "EXCEL", hint: "Phần mềm bảng tính (5 ký tự)" },
        { image: "../images/15.jpg", answer: "GOOGLE", hint: "Công cụ tìm kiếm số 1 (6 ký tự)" }
    ],
    "11a1": [
        { image: "../images/10.jpg", answer: "PYTHON", hint: "Ngôn ngữ lập trình con trăn (6 ký tự)" },
        { image: "../images/31.jpg", answer: "PRINT", hint: "Lệnh xuất dữ liệu (5 ký tự)" },
        { image: "../images/33.jpg", answer: "INTEGER", hint: "Số nguyên (7 ký tự)" },
        { image: "../images/34.jpg", answer: "FLOAT", hint: "Số thực (5 ký tự)" },
        { image: "../images/67.jpg", answer: "IF", hint: "Kiểm tra điều kiện (2 ký tự)" },
        { image: "../images/37.jpg", answer: "VONGLAP", hint: "Thực hiện lặp lại (7 ký tự)" },
        { image: "../images/18.jpg", answer: "BUG", hint: "Lỗi chương trình (3 ký tự)" }
    ],
    "12a1": [
        { image: "../images/81.jpg", answer: "CSDL", hint: "Viết tắt Cơ sở dữ liệu (4 ký tự)" },
        { image: "../images/83.jpg", answer: "ACCESS", hint: "Hệ quản trị CSDL Microsoft (6 ký tự)" },
        { image: "../images/84.jpg", answer: "BANG", hint: "Nơi lưu trữ dữ liệu chính (4 ký tự)" },
        { image: "../images/87.jpg", answer: "KHOACHINH", hint: "Xác định duy nhất mỗi hàng (9 ký tự)" },
        { image: "../images/95.jpg", answer: "SQL", hint: "Ngôn ngữ truy vấn (3 ký tự)" },
        { image: "../images/96.jpg", answer: "HTML", hint: "Ngôn ngữ đánh dấu web (4 ký tự)" },
        { image: "../images/97.jpg", answer: "CSS", hint: "Ngôn ngữ trang trí web (3 ký tự)" },
        { image: "../images/106.jpg", answer: "AI", hint: "Trí tuệ nhân tạo (2 ký tự)" }
    ]
};

let currentQuestions = [];
let currentIndex = 0;
let userAnswer = [];
let score = 0;
let canPlay = true;
let timerInterval;
let timeLeft = 60;
let isScoreSaved = false;

const els = {
    grade: document.getElementById("grade-select"),
    img: document.getElementById("current-image"),
    slots: document.getElementById("answer-container"),
    keyboard: document.getElementById("keyboard-container"),
    score: document.getElementById("score-value"),
    timer: document.getElementById("timer")
};

// --- HÀM XÁO TRỘN MẢNG (Shuffle) ---
// Đây là công thức Fisher-Yates Shuffle chuẩn
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function init() {
    score = parseInt(localStorage.getItem("gameScore")) || 0;
    if(els.score) els.score.innerText = score;
    
    if(els.grade) {
        els.grade.addEventListener("change", (e) => loadGrade(e.target.value));
        loadGrade("10a1"); // Mặc định chạy lớp 10
    } else {
        loadGrade("10a1");
    }
}

function loadGrade(grade) {
    // 1. Lấy dữ liệu gốc của lớp đó
    const originalData = questionDatabase[grade] || questionDatabase["10a1"];
    
    // 2. Tạo một bản copy (dùng [...]) để không làm hỏng dữ liệu gốc
    // 3. Xáo trộn bản copy đó
    currentQuestions = shuffleArray([...originalData]);
    
    currentIndex = 0;
    loadQuestion();
}

function loadQuestion() {
    clearInterval(timerInterval);
    canPlay = true;
    isScoreSaved = false;
    
    // Kiểm tra hết câu hỏi
    if (!currentQuestions || currentIndex >= currentQuestions.length) {
        endGame();
        return;
    }

    const q = currentQuestions[currentIndex];
    
    // Xử lý hiển thị ảnh (có code chống lỗi ảnh)
    if(els.img) {
        els.img.style.opacity = 0;
        const spinner = document.querySelector('.loading-spinner');
        if(spinner) spinner.style.display = 'block';

        els.img.src = q.image;
        
        els.img.onload = () => {
            els.img.style.opacity = 1;
            if(spinner) spinner.style.display = 'none';
        };
        
        els.img.onerror = () => {
            console.log("Ảnh lỗi, dùng ảnh thay thế: " + q.image);
            els.img.src = `https://via.placeholder.com/400x200?text=${q.answer}`;
            els.img.style.opacity = 1;
            if(spinner) spinner.style.display = 'none';
        };
    }
    
    userAnswer = Array(q.answer.length).fill("");
    renderSlots();
    renderKeyboard();
    startTimer();
}

function startTimer() {
    timeLeft = 60;
    if(els.timer) els.timer.innerText = timeLeft;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        if(els.timer) els.timer.innerText = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            canPlay = false;
            saveCurrentScore(); 
            showModal('lose', 'HẾT GIỜ!', `Hết thời gian! Bạn dừng lại ở <b>${score} điểm</b>.`, 'Chơi Lại', () => {
                localStorage.setItem("gameScore", 0);
                location.reload();
            });
        }
    }, 1000);
}

function saveCurrentScore() {
    if (score > 0 && !isScoreSaved) {
        if (window.saveScoreToFirebase) {
            window.saveScoreToFirebase(score);
            isScoreSaved = true;
        }
    }
}

function renderSlots() {
    if(!els.slots) return;
    els.slots.innerHTML = "";
    userAnswer.forEach((char, i) => {
        const div = document.createElement("div");
        div.className = "slot" + (char ? " filled" : "");
        div.innerText = char;
        div.onclick = () => { if(canPlay) { userAnswer[i] = ""; renderSlots(); } };
        els.slots.appendChild(div);
    });
}

function renderKeyboard() {
    if(!els.keyboard) return;
    els.keyboard.innerHTML = "";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    chars.split("").forEach(c => {
        const btn = document.createElement("button");
        btn.innerText = c;
        btn.className = "key-btn";
        btn.onclick = () => typeChar(c);
        els.keyboard.appendChild(btn);
    });
    
    const del = document.createElement("button");
    del.innerHTML = "<i class='fas fa-backspace'></i>";
    del.className = "key-btn key-del";
    del.onclick = () => {
        if (!canPlay) return;
        for (let i = userAnswer.length - 1; i >= 0; i--) {
            if (userAnswer[i]) { userAnswer[i] = ""; renderSlots(); return; }
        }
    };
    els.keyboard.appendChild(del);
}

function typeChar(char) {
    if (!canPlay) return;
    const idx = userAnswer.indexOf("");
    if (idx !== -1) {
        userAnswer[idx] = char;
        renderSlots();
        if (!userAnswer.includes("")) checkWin();
    }
}

function checkWin() {
    const correct = currentQuestions[currentIndex].answer;
    const inputAnswer = userAnswer.join("");

    if (inputAnswer === correct) {
        clearInterval(timerInterval);
        canPlay = false;
        
        score += 10;
        if(els.score) els.score.innerText = score;
        localStorage.setItem("gameScore", score);

        showModal('win', 'CHÍNH XÁC!', `Đáp án: <b>${correct}</b> (+10 điểm)`, 'Câu Tiếp', () => {
            currentIndex++;
            loadQuestion();
        });
    } else {
        if(els.slots) {
            els.slots.classList.add('shake-animation');
            setTimeout(() => els.slots.classList.remove('shake-animation'), 500);
        }
        document.querySelectorAll('.slot').forEach(s => { 
            s.style.borderColor = "#ff7675"; 
            s.style.color = "#ff7675"; 
        });
        
        showModal('lose', 'SAI RỒI!', `Từ <b>${inputAnswer}</b> chưa đúng.`, 'Thử Lại', () => {
            userAnswer = Array(correct.length).fill("");
            renderSlots();
            canPlay = true; 
            startTimer(); 
        });
    }
}

function endGame() {
    clearInterval(timerInterval);
    saveCurrentScore();
    showModal('win', 'CHÚC MỪNG!', `Bạn đã hoàn thành tất cả câu hỏi!<br>Tổng điểm: <b>${score}</b>`, 'Về Menu', () => {
        localStorage.setItem("gameScore", 0);
        window.location.href = 'hub.html';
    });
}

function showCurrentHint() {
    if(!canPlay) return;
    showModal('hint', 'GỢI Ý', currentQuestions[currentIndex].hint, 'Đã Hiểu');
}

/* MODAL SYSTEM */
let modalCallback = null;
function showModal(type, title, msg, btnText = "Đóng", callback = null) {
    const modal = document.getElementById('custom-modal');
    if(!modal) { 
        alert(msg.replace(/<[^>]*>?/gm, '')); 
        if(callback) callback(); 
        return; 
    }
    
    const iconMap = { 'win': '🎉', 'lose': '💔', 'hint': '💡' };
    modal.className = `modal-overlay active type-${type}`;
    
    const iconEl = document.getElementById('modal-icon');
    if(iconEl) iconEl.innerHTML = iconMap[type] || '🔔';
    
    const titleEl = document.getElementById('modal-title');
    if(titleEl) titleEl.innerText = title;
    
    const msgEl = document.getElementById('modal-msg');
    if(msgEl) msgEl.innerHTML = msg;
    
    const btnEl = document.getElementById('modal-btn');
    if(btnEl) btnEl.innerText = btnText;
    
    // Tự động đóng modal sau khi render để tránh lỗi
    // (Dùng callback để xử lý click)
    const newBtn = btnEl.cloneNode(true);
    btnEl.parentNode.replaceChild(newBtn, btnEl);
    
    newBtn.onclick = () => {
        closeModal();
        if(callback) callback();
    };
    
    modalCallback = callback;
}

function closeModal() {
    document.getElementById('custom-modal').classList.remove('active');
}

// Khởi chạy game khi trang load xong
document.addEventListener("DOMContentLoaded", init);
