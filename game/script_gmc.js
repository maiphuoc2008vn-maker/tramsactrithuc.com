// Dữ liệu câu hỏi: Code & Lỗi sai
const questions = [
    {
        // Câu 1
        code: `<span class="kwd">if</span> x = 5:\n    <span class="func">print</span>(<span class="str">"Hello"</span>)`,
        q: "Lỗi sai trong dòng lệnh IF này là gì?",
        options: [
            "Thiếu dấu hai chấm (:)",
            "Dùng sai toán tử so sánh (==)",
            "Lệnh print viết sai",
            "Biến x chưa khai báo"
        ],
        correct: 1, // Đáp án B (Index 1)
        explain: "Trong Python, so sánh bằng phải dùng '==' chứ không phải '='."
    },
    {
        // Câu 2
        code: `my_list = [1, 2, 3]\n<span class="func">print</span>(my_list[3])`,
        q: "Chương trình sẽ báo lỗi gì?",
        options: [
            "SyntaxError",
            "IndexError: list index out of range",
            "NameError",
            "In ra số 3"
        ],
        correct: 1,
        explain: "Danh sách có 3 phần tử thì chỉ số (index) tối đa là 2. Index[3] không tồn tại."
    },
    {
        // Câu 3
        code: `<span class="kwd">for</span> i <span class="kwd">in</span> <span class="func">range</span>(5)\n    <span class="func">print</span>(i)`,
        q: "Đoạn code này thiếu ký tự nào?",
        options: [
            "Dấu chấm phẩy (;)",
            "Dấu ngoặc đơn ()",
            "Dấu hai chấm (:)",
            "Dấu chấm (.)"
        ],
        correct: 2,
        explain: "Sau lệnh for/while/if trong Python bắt buộc phải có dấu hai chấm (:)."
    },
    {
        // Câu 4
        code: `<span class="kwd">def</span> <span class="func">tong</span>(a, b):\n    <span class="kwd">return</span> a + b\n\n<span class="func">print</span>(tong(5))`,
        q: "Tại sao đoạn code này lỗi?",
        options: [
            "Hàm sai cú pháp",
            "Thiếu đối số truyền vào",
            "Không thể print hàm",
            "Sai tên hàm"
        ],
        correct: 1,
        explain: "Hàm 'tong' yêu cầu 2 tham số (a, b) nhưng khi gọi chỉ truyền 1 số (5)."
    },
    {
        // Câu 5
        code: `x = <span class="str">"10"</span>\ny = 5\n<span class="func">print</span>(x + y)`,
        q: "Kết quả hoặc lỗi của đoạn code này?",
        options: [
            "In ra 15",
            "In ra 105",
            "TypeError: can only concatenate str...",
            "Không có lỗi"
        ],
        correct: 2,
        explain: "Không thể cộng chuỗi (str) với số nguyên (int) trực tiếp trong Python."
    }
];

let currentIdx = 0;
let score = 0;
let canClick = true;

// Âm thanh (dùng lại của game trước)
const sounds = {
    correct: new Audio('sounds/traloidung.mp3'),
    wrong: new Audio('sounds/traloisai.mp3')
};

function initGame() {
    currentIdx = 0;
    score = 0;
    document.getElementById('score').innerText = score;
    loadQuestion();
}

function loadQuestion() {
    if (currentIdx >= questions.length) {
        showEndGame();
        return;
    }

    canClick = true;
    document.getElementById('feedback-overlay').classList.add('hidden');
    
    const data = questions[currentIdx];
    
    // Hiển thị code
    document.getElementById('code-display').innerHTML = data.code;
    
    // Hiển thị câu hỏi
    document.getElementById('question-text').innerText = data.q;
    
    // Tạo nút đáp án
    const optsDiv = document.getElementById('options-container');
    optsDiv.innerHTML = "";
    
    data.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'code-btn';
        btn.innerHTML = `<span style="color:#79c0ff; font-weight:bold;">${String.fromCharCode(65+index)}.</span> ${opt}`;
        btn.onclick = () => checkAnswer(index, btn);
        optsDiv.appendChild(btn);
    });
}

function checkAnswer(index, btn) {
    if (!canClick) return;
    canClick = false;

    const data = questions[currentIdx];
    
    if (index === data.correct) {
        // Đúng
        btn.classList.add('correct');
        score += 10;
        document.getElementById('score').innerText = score;
        sounds.correct.play();
        showFeedback(true, "CHÍNH XÁC!", data.explain);
    } else {
        // Sai
        btn.classList.add('wrong');
        // Hiện đáp án đúng
        const allBtns = document.querySelectorAll('.code-btn');
        allBtns[data.correct].classList.add('correct');
        sounds.wrong.play();
        showFeedback(false, "SAI RỒI!", data.explain);
    }
}

function showFeedback(isCorrect, title, msg) {
    const overlay = document.getElementById('feedback-overlay');
    const icon = document.getElementById('feedback-icon');
    const titleEl = document.getElementById('feedback-title');
    const msgEl = document.getElementById('feedback-msg');

    setTimeout(() => {
        overlay.classList.remove('hidden');
        icon.innerHTML = isCorrect ? '✅' : '❌';
        titleEl.innerText = title;
        titleEl.style.color = isCorrect ? '#27c93f' : '#ff5f56';
        msgEl.innerText = msg;
    }, 1000);
}

function nextQuestion() {
    currentIdx++;
    loadQuestion();
}

function showEndGame() {
    const overlay = document.getElementById('feedback-overlay');
    overlay.classList.remove('hidden');
    document.getElementById('feedback-icon').innerHTML = '🏆';
    document.getElementById('feedback-title').innerText = "HOÀN THÀNH";
    document.getElementById('feedback-msg').innerText = `Tổng điểm của bạn: ${score}/${questions.length * 10}`;
    
    // Đổi nút Tiếp tục thành Về trang chủ
    const btn = document.querySelector('.next-btn');
    btn.innerText = "Về Kho Game";
    btn.onclick = () => window.location.href = "hub.html";
}

// Bắt đầu
initGame();