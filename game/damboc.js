const questionsBank = {
    10: [
        { q: "Thiết bị nào sau đây là thiết bị vào?", a: ["Màn hình", "Bàn phím", "Máy in", "Loa"], c: 1 },
        { q: "1GB bằng bao nhiêu MB?", a: ["100", "1000", "1024", "128"], c: 2 },
        { q: "Hệ điều hành là loại phần mềm nào?", a: ["Phần mềm ứng dụng", "Phần mềm hệ thống", "Phần mềm tiện ích", "Phần mềm đồ họa"], c: 1 }
    ],
    11: [
        { q: "Trong Python, từ khóa nào dùng để bắt đầu một hàm?", a: ["func", "function", "def", "define"], c: 2 },
        { q: "Kết quả của 10 % 3 trong Python là?", a: ["3", "1", "0.3", "3.33"], c: 1 },
        { q: "Kiểu dữ liệu 'True' thuộc loại nào?", a: ["int", "string", "boolean", "float"], c: 2 }
    ],
    12: [
        { q: "Trong CSDL, khóa chính (Primary Key) dùng để?", a: ["Sắp xếp dữ liệu", "Phân biệt các bản ghi", "Mã hóa dữ liệu", "Xóa dữ liệu"], c: 1 },
        { q: "Lệnh SELECT trong SQL dùng để làm gì?", a: ["Xóa dữ liệu", "Sửa dữ liệu", "Truy vấn dữ liệu", "Tạo bảng"], c: 2 },
        { q: "Mô hình CSDL phổ biến nhất hiện nay là?", a: ["Phân cấp", "Mạng", "Quan hệ", "Đối tượng"], c: 2 }
    ]
};

let playerHP = 100, enemyHP = 100, currentQs = [], qIndex = 0;

function startGame(level) {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-arena').style.display = 'block';
    currentQs = questionsBank[level].sort(() => Math.random() - 0.5);
    qIndex = 0;
    loadQuestion();
}

function loadQuestion() {
    if (qIndex >= currentQs.length) {
        alert("BẠN ĐÃ CHIẾN THẮNG TRẬN ĐẤU!");
        location.reload();
        return;
    }

    const q = currentQs[qIndex];
    document.getElementById('question-text').innerText = q.q;
    const grid = document.getElementById('answer-grid');
    grid.innerHTML = '';

    q.a.forEach((ans, idx) => {
        const btn = document.createElement('button');
        btn.innerText = ans;
        btn.onclick = () => check(idx);
        grid.appendChild(btn);
    });
}

function check(idx) {
    const q = currentQs[qIndex];
    const pSprite = document.getElementById('player-sprite');
    const eSprite = document.getElementById('enemy-sprite');

    if (idx === q.c) {
        // Trả lời đúng -> Đối thủ bị đấm
        enemyHP -= 25;
        eSprite.classList.add('shake');
        setTimeout(() => eSprite.classList.remove('shake'), 300);
    } else {
        // Trả lời sai -> Người chơi bị đấm
        playerHP -= 25;
        pSprite.classList.add('shake');
        setTimeout(() => pSprite.classList.remove('shake'), 300);
    }

    updateUI();
}

function updateUI() {
    document.getElementById('player-hp').style.width = playerHP + "%";
    document.getElementById('enemy-hp').style.width = enemyHP + "%";

    if (enemyHP <= 0) {
        alert("K.O! BẠN THẮNG RỒI!");
        location.reload();
    } else if (playerHP <= 0) {
        alert("BẠN ĐÃ BỊ KNOCKOUT! THỬ LẠI NHÉ.");
        location.reload();
    } else {
        qIndex++;
        loadQuestion();
    }
}