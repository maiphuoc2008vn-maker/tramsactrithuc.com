const questions = {
    10: [
        { q: "Thiết bị nào là 'não bộ' của máy tính?", a: ["RAM", "CPU", "Chuột", "Loa"], c: 1 },
        { q: "1 Byte bằng bao nhiêu bit?", a: ["4", "8", "16", "32"], c: 1 },
        { q: "Hệ điều hành là phần mềm gì?", a: ["Ứng dụng", "Hệ thống", "Tiện ích", "Đồ họa"], c: 1 },
        { q: "Phím tắt để Copy là gì?", a: ["Ctrl+V", "Ctrl+C", "Ctrl+X", "Ctrl+Z"], c: 1 },
        { q: "1GB bằng bao nhiêu MB?", a: ["100", "1000", "1024", "128"], c: 2 },
        { q: "Phần mềm duyệt Web là?", a: ["Word", "Excel", "Chrome", "Paint"], c: 2 },
        { q: "Đâu là thiết bị vào?", a: ["Màn hình", "Loa", "Bàn phím", "Máy in"], c: 2 },
        { q: "Bộ nhớ RAM bị mất điện sẽ?", a: ["Mất dữ liệu", "Còn dữ liệu", "Cháy máy", "Không sao"], c: 0 },
        { q: "Tên miền .gov dành cho?", a: ["Công ty", "Trường học", "Chính phủ", "Cá nhân"], c: 2 },
        { q: "CPU viết tắt của từ gì?", a: ["Central Unit", "Control Unit", "Central Processing Unit", "Main Unit"], c: 2 },
        { q: "Thông tin sau khi xử lý gọi là gì?", a: ["Dữ liệu", "Lệnh", "Vật mang tin", "Kết quả"], c: 0 },
        { q: "Bàn phím và Chuột thuộc nhóm nào?", a: ["Thiết bị ra", "Thiết bị vào", "Bộ nhớ", "CPU"], c: 1 },
        { q: "Trong Tin học, Bit là gì?", a: ["Số thập phân", "Ký tự", "Đơn vị nhỏ nhất", "Tệp tin"], c: 2 },
        { q: "Phần mềm soạn thảo văn bản là?", a: ["Excel", "Windows", "Word", "Photoshop"], c: 2 },
        { q: "Virus máy tính thực chất là gì?", a: ["Vi khuẩn", "Một chương trình", "Bụi bẩn", "Lỗi phần cứng"], c: 1 },
        { q: "Mạng LAN kết nối trong phạm vi?", a: ["Toàn cầu", "Quốc gia", "Diện tích nhỏ", "Vũ trụ"], c: 2 },
        { q: "Thiết bị in văn bản ra giấy?", a: ["Màn hình", "Máy in", "Loa", "Máy quét"], c: 1 },
        { q: "Thùng rác trên Windows là?", a: ["Control Panel", "My Computer", "Recycle Bin", "Desktop"], c: 2 },
        { q: "Đơn vị đo tốc độ xử lý CPU là?", a: ["Hz", "Byte", "Bit", "Kg"], c: 0 },
        { q: "Phím tắt mở Task Manager?", a: ["Ctrl+Alt+Del", "Ctrl+Shift+Esc", "Alt+F4", "Cả A và B"], c: 3 }
    ],
    11: [
        { q: "Lệnh in trong Python là?", a: ["out()", "write()", "print()", "show()"], c: 2 },
        { q: "Kiểu số nguyên trong Python?", a: ["float", "str", "bool", "int"], c: 3 },
        { q: "Dấu chú thích (#) dùng cho mấy dòng?", a: ["1 dòng", "Nhiều dòng", "Toàn bộ đề", "Không có"], c: 0 },
        { q: "Kết quả 10 % 3 là?", a: ["3", "1", "0", "3.3"], c: 1 },
        { q: "Vòng lặp biết trước số lần?", a: ["while", "for", "if", "else"], c: 1 },
        { q: "Lệnh input() mặc định là kiểu?", a: ["int", "float", "string", "bool"], c: 2 },
        { q: "Thêm phần tử vào list dùng?", a: ["add", "append", "push", "insert"], c: 1 },
        { q: "Kết quả 'Ha'*3 là?", a: ["Ha3", "HaHaHa", "Lỗi", "Ha Ha Ha"], c: 1 },
        { q: "Hàm len([1, 2, 3]) trả về?", a: ["1", "2", "3", "0"], c: 2 },
        { q: "Kiểu dữ liệu Logic là?", a: ["int", "float", "bool", "str"], c: 2 },
        { q: "Để thoát vòng lặp ngay lập tức?", a: ["continue", "break", "exit", "stop"], c: 1 },
        { q: "Python ra đời năm nào?", a: ["1989", "1991", "1995", "2000"], c: 1 },
        { q: "Toán tử so sánh bằng?", a: ["=", "==", "===", "is"], c: 1 },
        { q: "Khai báo hàm dùng từ khóa?", a: ["func", "function", "def", "define"], c: 2 },
        { q: "List trong Python dùng ngoặc nào?", a: ["()", "{}", "[]", "<>"], c: 2 },
        { q: "Chia lấy phần nguyên là toán tử?", a: ["/", "//", "%", "div"], c: 1 },
        { q: "Range(1, 5) gồm các số?", a: ["1,2,3,4,5", "0,1,2,3,4", "1,2,3,4", "1,3,5"], c: 2 },
        { q: "Python là ngôn ngữ thông dịch hay biên dịch?", a: ["Thông dịch", "Biên dịch", "Cả hai", "Không phải"], c: 0 },
        { q: "Lệnh xóa phần tử list theo chỉ số?", a: ["remove", "del", "clear", "discard"], c: 1 },
        { q: "Kiểu dữ liệu Tuple dùng ngoặc nào?", a: ["[]", "{}", "()", "||"], c: 2 }
    ],
    12: [
        { q: "CSDL là viết tắt của?", a: ["Cơ sở dữ liệu", "Cơ cấu dữ liệu", "Công sức", "Cổng số"], c: 0 },
        { q: "Lệnh lấy dữ liệu trong SQL?", a: ["GET", "TAKE", "SELECT", "FETCH"], c: 2 },
        { q: "Khóa chính dùng để?", a: ["Bảo mật", "Phân biệt bản ghi", "Sắp xếp", "Xóa"], c: 1 },
        { q: "Mạng diện rộng là?", a: ["LAN", "MAN", "WAN", "PAN"], c: 2 },
        { q: "Thiết bị định tuyến gọi là?", a: ["Hub", "Switch", "Router", "Bridge"], c: 2 },
        { q: "Lệnh xóa dữ liệu SQL?", a: ["REMOVE", "DELETE", "DROP", "CLEAR"], c: 1 },
        { q: "Phần mềm quản trị CSDL?", a: ["Word", "Access", "Excel", "Chrome"], c: 1 },
        { q: "Sắp xếp tăng dần SQL dùng?", a: ["DESC", "ASC", "ORDER", "BY"], c: 1 },
        { q: "SQL là ngôn ngữ?", a: ["Lập trình", "Truy vấn", "Đồ họa", "Máy"], c: 1 },
        { q: "Lệnh SELECT * FROM hocsinh?", a: ["Xóa bảng", "Lấy tất cả", "Sửa bảng", "Thêm"], c: 1 },
        { q: "Hệ quản trị CSDL phổ biến?", a: ["MySQL", "Windows", "Python", "Java"], c: 0 },
        { q: "Bản ghi tương ứng với?", a: ["Cột", "Hàng", "Trang", "Tệp"], c: 1 },
        { q: "Khóa ngoại dùng để?", a: ["Liên kết bảng", "Khóa máy", "Mã hóa", "Xóa hàng"], c: 0 },
        { q: "Mối quan hệ 1-Nhiều là?", a: ["1 lớp có nhiều HS", "1 HS có nhiều lớp", "Cả hai", "Không có"], c: 0 },
        { q: "Địa chỉ IP gồm mấy số cách bởi dấu chấm?", a: ["2", "3", "4", "5"], c: 2 },
        { q: "Tên miền .com dành cho?", a: ["Giáo dục", "Thương mại", "Chính phủ", "Quân đội"], c: 1 },
        { q: "Giao thức truyền tải web?", a: ["FTP", "SMTP", "HTTP", "IP"], c: 2 },
        { q: "Lệnh UPDATE dùng để?", a: ["Xóa", "Thêm", "Sửa", "Tạo"], c: 2 },
        { q: "Hệ thống phân giải tên miền?", a: ["DHCP", "DNS", "FTP", "NAT"], c: 1 },
        { q: "SQL viết tắt của từ gì?", a: ["Simple Question", "Structured Query Language", "Strong Query", "Small Queue"], c: 1 }
    ]
};

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
    const ronaldo = document.getElementById('player');
    const messi = document.getElementById('enemy');
    if (isCorrect) {
        ronaldo.classList.add('player-punch');
        setTimeout(() => {
            ronaldo.classList.remove('player-punch');
            messi.classList.add('hit-shake');
            eHP--;
            updateHP('enemy-hp-slots', eHP);
            setTimeout(() => { messi.classList.remove('hit-shake'); checkEnd(); }, 300);
        }, 200);
    } else {
        messi.classList.add('enemy-punch');
        setTimeout(() => {
            messi.classList.remove('enemy-punch');
            ronaldo.classList.add('hit-shake');
            pHP--;
            updateHP('player-hp-slots', pHP);
            setTimeout(() => { ronaldo.classList.remove('hit-shake'); checkEnd(); }, 300);
        }, 200);
    }
}

function updateHP(id, val) {
    const slots = document.getElementById(id).children;
    for (let i = 4; i >= val; i--) { slots[i].classList.add('lost'); }
}

function checkEnd() {
    if (eHP <= 0) showResult("win");
    else if (pHP <= 0) showResult("lose");
    else { qIdx++; renderQuestion(); }
}

function showResult(status) {
    const screen = document.getElementById('result-screen');
    const title = document.getElementById('result-title');
    const img = document.getElementById('result-img');
    const msg = document.getElementById('result-msg');
    document.getElementById('quiz-area').style.display = 'none';

    if (status === "win") {
        title.innerText = "SIUUUUUUU!";
        img.src = "../images/ronaldo-win.jpeg";
        msg.innerText = "BẠN (RONALDO) ĐÃ THẮNG VÀ NHẬN CÚP C1!";
    } else {
        title.innerText = "THẤT BẠI!";
        img.src = "../images/messi-win.jpeg";
        msg.innerText = "MESSI ĐÃ THẮNG VÀ NHẬN CÚP THẾ GIỚI!";
    }
    screen.style.display = "flex";
}
