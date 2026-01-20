// CƠ SỞ DỮ LIỆU ĐÁP ÁN
const database = {
    "10": [
        "CPU", "RAM", "ROM", "HDD", "SSD", "Bàn phím", "Chuột", "Windows", "Linux", "Word", 
        "Excel", "Virus", "Máy in", "USB", "Bit", "Byte", "Nhị phân", "Thuật toán", "Internet", "Wifi", 
        "Google", "Màn hình", "Loa", "Webcam", "Thư mục", "Tệp tin", "Desktop", "Taskbar", "Delete", "Backspace", 
        "Caps Lock", "Enter", "Ctrl C", "Ctrl V", "Ctrl S", "Unikey", "Android", "IOS", "Chrome", "Facebook"
    ],
    "11": [
        "Python", "Biên dịch", "Thông dịch", "Biến", "Hằng", "Int", "Float", "Str", "Bool", "List",
        "If", "Else", "For", "While", "Break", "Def", "Return", "Import", "Math", "Print",
        "Input", "Len", "Range", "Bug", "Debug", "Cú pháp", "Ghi chú", "Mảng", "Sắp xếp", "Tìm kiếm",
        "And", "Or", "Not", "Abs", "Sqrt", "Lập trình", "Pascal", "Scratch", "Java", "C++"
    ],
    "12": [
        "CSDL", "Access", "Bảng", "Mẫu hỏi", "Biểu mẫu", "Báo cáo", "Trường", "Bản ghi", "Khóa chính", "Khóa ngoại",
        "SQL", "LAN", "WAN", "Máy chủ", "Máy khách", "IP", "HTML", "CSS", "HTTP", "Trình duyệt",
        "Liên kết", "AI", "Robot", "Big Data", "Tường lửa", "Hacker", "Mã hóa", "Mật khẩu", "Sao lưu", "Modem",
        "Switch", "Router", "Dữ liệu", "Thông tin", "Quan hệ", "Cập nhật", "Turing", "IoT", "Cloud", "Virus"
    ]
};

// Biến toàn cục
let currentGrade = "10";
let currentIndices = [];
let currentIndexPtr = 0;
let score = 0;
let currentAudio = new Audio();
let isPlaying = false;
let modalCallback = null; // Callback cho modal

// --- KHỞI TẠO GAME ---
function startGame() {
    currentGrade = document.getElementById('grade-select').value;
    let indices = Array.from({length: 40}, (_, i) => i);
    currentIndices = indices.sort(() => Math.random() - 0.5);
    
    currentIndexPtr = 0;
    score = 0;
    
    document.getElementById('level-display').innerText = `Khối ${currentGrade} (Câu 1/40)`;
    document.getElementById('score').innerText = score;
    document.getElementById('start-overlay').style.display = 'none';
    
    document.getElementById('answer-input').value = "";
    document.getElementById('answer-input').focus();
    document.getElementById('status-text').innerText = "Nhấn nút để nghe câu hỏi...";
}

// --- XỬ LÝ ÂM THANH ---
function playQuestionAudio() {
    if (isPlaying) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    let realIndex = currentIndices[currentIndexPtr];
    // Đường dẫn file âm thanh: sounds/Lớp_ThứTự.mp3
    let audioPath = `sounds/${currentGrade}_${realIndex}.mp3`;
    
    currentAudio.src = audioPath;
    
    currentAudio.onplay = () => {
        isPlaying = true;
        document.getElementById('visualizer').classList.add('playing');
        document.getElementById('status-text').innerText = "🔊 Đang phát câu hỏi...";
    };

    currentAudio.onended = () => {
        isPlaying = false;
        document.getElementById('visualizer').classList.remove('playing');
        document.getElementById('status-text').innerText = "Hãy nhập đáp án!";
    };

    currentAudio.onerror = () => {
        isPlaying = false;
        document.getElementById('visualizer').classList.remove('playing');
        showModal("info", "LỖI FILE", "Không tìm thấy file âm thanh!<br>Vui lòng kiểm tra thư mục 'sounds'.");
    };

    currentAudio.play();
}

// --- KIỂM TRA ĐÁP ÁN ---
function checkAnswer() {
    const userInp = document.getElementById('answer-input').value.trim();
    if (!userInp) {
        showModal("info", "CHƯA NHẬP", "Bạn vui lòng nhập câu trả lời trước khi gửi!");
        return;
    }

    let realIndex = currentIndices[currentIndexPtr];
    const correctAns = database[currentGrade][realIndex];

    if (userInp.toLowerCase() === correctAns.toLowerCase()) {
        // TRẢ LỜI ĐÚNG
        score += 10;
        document.getElementById('score').innerText = score;
        new Audio('sounds/correct.mp3').play().catch(()=>{});
        
        showModal("win", "CHÍNH XÁC!", `Đáp án đúng là: <b>${correctAns}</b><br>Bạn nhận được +10 điểm.`, "Câu Tiếp Theo", () => {
            nextQuestion();
        });

    } else {
        // TRẢ LỜI SAI
        new Audio('sounds/wrong.mp3').play().catch(()=>{});
        
        showModal("lose", "SAI RỒI!", `Đáp án đúng phải là: <b style="color:#c0392b">${correctAns}</b><br>Rất tiếc!`, "Đi Tiếp", () => {
            nextQuestion();
        });
    }
}

// --- CHUYỂN CÂU HỎI ---
function nextQuestion() {
    currentIndexPtr++;
    
    if (currentIndexPtr >= 40) {
        showModal("win", "HOÀN THÀNH!", `Chúc mừng bạn đã hoàn thành tất cả câu hỏi!<br>Tổng điểm: <b>${score}</b>`, "Chơi Lại", () => {
            location.reload();
        });
        return;
    }

    document.getElementById('level-display').innerText = `Khối ${currentGrade} (Câu ${currentIndexPtr + 1}/40)`;
    document.getElementById('answer-input').value = "";
    document.getElementById('answer-input').focus();
    document.getElementById('status-text').innerText = "Nhấn nút để nghe câu tiếp theo...";
    
    currentAudio.pause();
    currentAudio.currentTime = 0;
    document.getElementById('visualizer').classList.remove('playing');
}

// --- HỆ THỐNG MODAL ---
function showModal(type, title, msg, btnText = "Đóng", callback = null) {
    const modal = document.getElementById('custom-modal');
    const box = document.getElementById('modal-box-content');
    const icon = document.getElementById('modal-icon-i');
    const titleEl = document.getElementById('modal-title');
    const msgEl = document.getElementById('modal-msg');
    const btn = document.getElementById('modal-btn');

    // Reset class màu
    box.classList.remove('win', 'lose', 'info');
    box.classList.add(type);

    // Set Icon & Nội dung
    if(type === 'win') icon.className = "fas fa-check-circle";
    else if(type === 'lose') icon.className = "fas fa-times-circle";
    else icon.className = "fas fa-info-circle";

    titleEl.innerText = title;
    msgEl.innerHTML = msg;
    btn.innerText = btnText;
    modalCallback = callback;

    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('custom-modal').classList.remove('active');
    if (modalCallback) {
        modalCallback();
        modalCallback = null;
    }
}

// Cho phép ấn Enter
document.getElementById('answer-input').addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("submit-btn").click();
    }
});