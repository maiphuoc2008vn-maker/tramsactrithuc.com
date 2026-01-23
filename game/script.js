/* ==========================================================================
   GAME LOGIC - PHIÊN BẢN FULL CÂU HỎI LỚP 10, 11, 12
   ========================================================================== */

// 1. DATA CÂU HỎI
const questionDatabase = {
    // --- LỚP 10: PHẦN CỨNG & HỆ ĐIỀU HÀNH ---
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

    // --- LỚP 11: LẬP TRÌNH (PYTHON/C++) ---
    "11a1": [
         { image: "../images/11_python.jpg", answer: "PYTHON", hint: "Ngôn ngữ lập trình con trăn (6 ký tự)" },
         { image: "../images/11_bien.jpg", answer: "BIEN", hint: "Dùng để lưu trữ giá trị (4 ký tự)" },
         { image: "../images/11_if.jpg", answer: "IF", hint: "Câu lệnh kiểm tra điều kiện (2 ký tự)" },
         { image: "../images/11_for.jpg", answer: "VONGLAP", hint: "Thực hiện công việc lặp lại (7 ký tự)" },
         { image: "../images/11_array.jpg", answer: "MANG", hint: "Tập hợp các phần tử cùng kiểu (4 ký tự)" },
         { image: "../images/11_input.jpg", answer: "INPUT", hint: "Lệnh nhập dữ liệu từ bàn phím (5 ký tự)" },
         { image: "../images/11_print.jpg", answer: "PRINT", hint: "Lệnh xuất dữ liệu ra màn hình (5 ký tự)" },
         { image: "../images/11_int.jpg", answer: "INTEGER", hint: "Kiểu dữ liệu số nguyên (7 ký tự)" },
         { image: "../images/11_float.jpg", answer: "FLOAT", hint: "Kiểu dữ liệu số thực (5 ký tự)" },
         { image: "../images/11_string.jpg", answer: "STRING", hint: "Kiểu dữ liệu xâu ký tự (6 ký tự)" },
         { image: "../images/11_bug.jpg", answer: "BUG", hint: "Lỗi trong chương trình (3 ký tự)" },
         { image: "../images/11_debug.jpg", answer: "DEBUG", hint: "Quá trình sửa lỗi (5 ký tự)" }
    ],

    // --- LỚP 12: CƠ SỞ DỮ LIỆU & MẠNG ---
    "12a1": [
         { image: "../images/12_csdl.jpg", answer: "CSDL", hint: "Viết tắt Cơ sở dữ liệu (4 ký tự)" },
         { image: "../images/12_access.jpg", answer: "ACCESS", hint: "Hệ quản trị CSDL của Microsoft (6 ký tự)" },
         { image: "../images/12_sql.jpg", answer: "SQL", hint: "Ngôn ngữ truy vấn dữ liệu (3 ký tự)" },
         { image: "../images/12_table.jpg", answer: "BANG", hint: "Nơi chứa dữ liệu gồm hàng và cột (4 ký tự)" },
         { image: "../images/12_key.jpg", answer: "KHOACHINH", hint: "Dùng để xác định duy nhất mỗi hàng (9 ký tự)" },
         { image: "../images/12_query.jpg", answer: "TRUYVAN", hint: "Hỏi và trích xuất dữ liệu (7 ký tự)" },
         { image: "../images/12_baocao.jpg", answer: "BAOCAO", hint: "Dùng để xuất dữ liệu ra giấy (6 ký tự)" },
         { image: "../images/12_html.jpg", answer: "HTML", hint: "Ngôn ngữ đánh dấu siêu văn bản (4 ký tự)" },
         { image: "../images/12_network.jpg", answer: "MANG", hint: "Kết nối các máy tính với nhau (4 ký tự)" },
         { image: "../images/12_wifi.jpg", answer: "WIFI", hint: "Mạng không dây (4 ký tự)" },
         { image: "../images/12_server.jpg", answer: "SERVER", hint: "Máy chủ lưu trữ dữ liệu (6 ký tự)" },
         { image: "../images/12_cloud.jpg", answer: "DAMMAY", hint: "Điện toán ... (6 ký tự)" }
    ]
};

// 2. BIẾN TOÀN CỤC
let currentQuestions = [];
let currentIndex = 0;
let userAnswer = [];
let score = 0;
let canPlay = true;
let timerInterval;
let timeLeft = 60;
let isScoreSaved = false;

// Lấy các thẻ HTML (Dùng try-catch để tránh lỗi nếu HTML thiếu ID)
const getEl = (id) => document.getElementById(id);
const els = {
    grade: getEl("grade-select"),
    img: getEl("current-image"),
    slots: getEl("answer-container"),
    keyboard: getEl("keyboard-container"),
    score: getEl("score-value"),
    timer: getEl("timer")
};

// --- HÀM XÁO TRỘN CÂU HỎI ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// --- KHỞI TẠO GAME ---
function init() {
    console.log("Game Start: Đang khởi tạo...");
    
    // Lấy điểm cũ
    score = parseInt(localStorage.getItem("gameScore")) || 0;
    if(els.score) els.score.innerText = score;
    
    // Gắn sự kiện chọn lớp
    if(els.grade) {
        els.grade.addEventListener("change", (e) => loadGrade(e.target.value));
        loadGrade("10a1"); 
    } else {
        loadGrade("10a1"); // Chạy mặc định nếu không có nút chọn lớp
    }
}

function loadGrade(grade) {
    // Lấy dữ liệu và xáo trộn
    const rawData = questionDatabase[grade] || questionDatabase["10a1"];
    currentQuestions = shuffleArray([...rawData]); // Copy và đảo
    
    currentIndex = 0;
    loadQuestion();
}

function loadQuestion() {
    clearInterval(timerInterval);
    canPlay = true;
    isScoreSaved = false;
    
    // Kiểm tra các phần tử UI quan trọng
    if (!els.slots || !els.keyboard) {
        console.error("LỖI: Không tìm thấy ID 'answer-container' hoặc 'keyboard-container' trong HTML");
        return;
    }

    // Nếu hết câu hỏi
    if (!currentQuestions || currentIndex >= currentQuestions.length) {
        endGame();
        return;
    }

    const q = currentQuestions[currentIndex];
    console.log("Đang tải câu:", q.answer);

    // --- XỬ LÝ ẢNH (FIX LỖI TREO) ---
    if(els.img) {
        // Hiện spinner, làm mờ ảnh cũ
        els.img.style.opacity = 0.3; 
        const spinner = document.querySelector('.loading-spinner');
        if(spinner) spinner.style.display = 'block';

        // Gán ảnh mới
        els.img.src = q.image;
        
        // Khi ảnh tải xong
        els.img.onload = () => {
            els.img.style.opacity = 1;
            if(spinner) spinner.style.display = 'none';
        };
        
        // Khi ảnh lỗi -> Dùng ảnh thay thế -> KHÔNG ĐƯỢC TREO GAME
        els.img.onerror = () => {
            console.warn("Không tải được ảnh:", q.image);
            els.img.src = `https://via.placeholder.com/400x200?text=${q.answer}`; 
            els.img.style.opacity = 1;
            if(spinner) spinner.style.display = 'none';
        };
    }
    
    // --- VẼ GIAO DIỆN NGAY LẬP TỨC (Không chờ ảnh) ---
    userAnswer = Array(q.answer.length).fill("");
    renderSlots();
    renderKeyboard();
    startTimer();
}

// --- CÁC HÀM XỬ LÝ GIAO DIỆN ---
function renderSlots() {
    els.slots.innerHTML = "";
    userAnswer.forEach((char, i) => {
        const div = document.createElement("div");
        div.className = "slot" + (char ? " filled" : "");
        div.innerText = char;
        // Click để xóa ký tự
        div.onclick = () => { 
            if(canPlay && char !== "") { 
                userAnswer[i] = ""; 
                renderSlots(); 
            } 
        };
        els.slots.appendChild(div);
    });
}

function renderKeyboard() {
    els.keyboard.innerHTML = "";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    chars.split("").forEach(c => {
        const btn = document.createElement("button");
        btn.innerText = c;
        btn.className = "key-btn";
        btn.onclick = () => typeChar(c);
        els.keyboard.appendChild(btn);
    });
    
    // Nút Xóa
    const del = document.createElement("button");
    del.innerHTML = "<i class='fas fa-backspace'></i>";
    del.className = "key-btn key-del";
    del.onclick = () => {
        if (!canPlay) return;
        // Xóa ký tự cuối cùng điền vào
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
        // Kiểm tra thắng ngay khi điền đủ
        if (!userAnswer.includes("")) checkWin();
    }
}

// --- LOGIC GAME ---
function startTimer() {
    timeLeft = 60;
    if(els.timer) els.timer.innerText = timeLeft;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        if(els.timer) els.timer.innerText = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            canPlay = false;
            saveCurrentScoreSafe(); // Lưu điểm an toàn
            
            showModal('lose', 'HẾT GIỜ!', `Bạn dừng lại ở <b>${score} điểm</b>.`, 'Chơi Lại', () => {
                localStorage.setItem("gameScore", 0);
                location.reload();
            });
        }
    }, 1000);
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
        // Hiệu ứng rung khi sai
        if(els.slots) {
            els.slots.classList.add('shake-animation');
            setTimeout(() => els.slots.classList.remove('shake-animation'), 500);
        }
        document.querySelectorAll('.slot').forEach(s => { 
            s.style.borderColor = "#ff7675"; 
            s.style.color = "#ff7675"; 
        });
        
        // Reset sau 1 giây (hoặc dùng modal nếu muốn)
        setTimeout(() => {
             document.querySelectorAll('.slot').forEach(s => { 
                s.style.borderColor = "#b2bec3"; 
                s.style.color = "#2d3436"; 
            });
            renderSlots(); // Xóa đỏ
        }, 1000);
    }
}

function endGame() {
    clearInterval(timerInterval);
    saveCurrentScoreSafe();
    showModal('win', 'HOÀN THÀNH!', `Chúc mừng! Tổng điểm: <b>${score}</b>`, 'Về Menu', () => {
        localStorage.setItem("gameScore", 0);
        window.location.href = 'hub.html';
    });
}

// --- HÀM LƯU ĐIỂM AN TOÀN (KHÔNG GÂY LỖI NẾU THIẾU FIREBASE) ---
function saveCurrentScoreSafe() {
    // Kiểm tra xem hàm lưu điểm có tồn tại không trước khi gọi
    if (typeof window.saveScoreToFirebase === "function" && score > 0 && !isScoreSaved) {
        try {
            window.saveScoreToFirebase(score);
            isScoreSaved = true;
            console.log("Đã gọi lưu điểm thành công.");
        } catch (e) {
            console.warn("Lỗi khi lưu điểm:", e);
        }
    } else {
        console.log("Bỏ qua lưu điểm (Không có module hoặc 0 điểm)");
    }
}

// --- MODAL & GỢI Ý ---
window.showCurrentHint = function() {
    if(!canPlay) return;
    showModal('hint', 'GỢI Ý', currentQuestions[currentIndex].hint, 'Đã Hiểu');
}

let modalCallback = null;
function showModal(type, title, msg, btnText = "Đóng", callback = null) {
    const modal = document.getElementById('custom-modal');
    if(!modal) { alert(msg.replace(/<[^>]*>?/gm, '')); if(callback) callback(); return; }
    
    const iconMap = { 'win': '🎉', 'lose': '💔', 'hint': '💡' };
    modal.className = `modal-overlay active type-${type}`;
    
    // Cập nhật nội dung modal an toàn
    const setTxt = (id, txt) => { const el = document.getElementById(id); if(el) el.innerHTML = txt; };
    setTxt('modal-icon', iconMap[type] || '🔔');
    setTxt('modal-title', title);
    setTxt('modal-msg', msg);
    setTxt('modal-btn', btnText);
    
    // Xử lý nút bấm (Clone để xóa event cũ)
    const btn = document.getElementById('modal-btn');
    if(btn) {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.onclick = () => {
            window.closeModal();
            if(callback) callback();
        };
    }
    modalCallback = callback;
}

window.closeModal = function() {
    const modal = document.getElementById('custom-modal');
    if(modal) modal.classList.remove('active');
}

// --- CHẠY GAME KHI TRANG LOAD XONG ---
document.addEventListener("DOMContentLoaded", init);
