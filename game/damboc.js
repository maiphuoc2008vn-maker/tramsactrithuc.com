// Cấu hình âm thanh
const snd = {
    punch: new Audio('../sounds/punch.mp3'),
    hit: new Audio('../sounds/hit.mp3'),
    win: new Audio('../sounds/siuuu.mp3'), // Bạn có thể đổi tên file âm thanh cho hợp
    lose: new Audio('../sounds/lose.mp3')
};

function play(name) {
    snd[name].currentTime = 0;
    snd[name].play().catch(() => {});
}

// BỘ CÂU HỎI (GIỮ NGUYÊN 60 CÂU ĐÃ TRỘN)
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
        { q: "Thành phần hiển thị hình ảnh là?", a: ["Chuột", "Bàn phím", "Màn hình", "Ổ cứng"], c: 2 },
        { q: "Virus máy tính thực chất là gì?", a: ["Vi khuẩn", "Một chương trình", "Bụi bẩn", "Lỗi phần cứng"], c: 1 },
        { q: "Mạng LAN kết nối trong phạm vi?", a: ["Toàn cầu", "Quốc gia", "Diện tích nhỏ", "Vũ trụ"], c: 2 },
        { q: "Thiết bị in văn bản ra giấy?", a: ["Màn hình", "Máy in", "Loa", "Máy quét"], c: 1 },
        { q: "Thùng rác trên Windows là?", a: ["Control Panel", "My Computer", "Recycle Bin", "Desktop"], c: 2 },
        { q: "Đơn vị đo tốc độ xử lý CPU là?", a: ["Hz", "Byte", "Bit", "Kg"], c: 0 }
    ],
    11: [
        { q: "Lệnh in trong Python là?", a: ["out()", "write()", "print()", "show()"], c: 2 },
        { q: "Kiểu số nguyên trong Python?", a: ["float", "str", "bool", "int"], c: 3 },
        { q: "Dấu chú thích (#) dùng cho?", a: ["1 dòng", "Nhiều dòng", "Toàn bộ", "Không có"], c: 0 },
        { q: "Kết quả 10 % 3 là?", a: ["3", "1", "0", "3.3"], c: 1 },
        { q: "Vòng lặp biết trước số lần?", a: ["while", "for", "if", "else"], c: 1 },
        { q: "Lệnh input() mặc định là kiểu?", a: ["int", "float", "string", "bool"], c: 2 },
        { q: "Thêm phần tử vào list dùng?", a: ["add", "append", "push", "insert"], c: 1 },
        { q: "Hàm tính độ dài danh sách là?", a: ["size()", "len()", "count()", "length()"], c: 1 },
        { q: "Để thoát vòng lặp ngay lập tức?", a: ["continue", "break", "exit", "stop"], c: 1 },
        { q: "Python ra đời năm nào?", a: ["1989", "1991", "1995", "2000"], c: 1 },
        { q: "Khai báo hàm dùng từ khóa?", a: ["func", "function", "def", "define"], c: 2 },
        { q: "List trong Python dùng ngoặc nào?", a: ["()", "{}", "[]", "<>"], c: 2 },
        { q: "Chia lấy phần nguyên là toán tử?", a: ["/", "//", "%", "div"], c: 1 },
        { q: "Range(1, 5) gồm các số?", a: ["1,2,3,4,5", "0,1,2,3,4", "1,2,3,4", "1,3,5"], c: 2 },
        { q: "Kiểu dữ liệu Logic là?", a: ["int", "float", "bool", "str"], c: 2 },
        { q: "Toán tử so sánh bằng?", a: ["=", "==", "===", "is"], c: 1 },
        { q: "Kết quả của 'A' < 'B' là?", a: ["True", "False", "Lỗi", "None"], c: 0 },
        { q: "Kiểu dữ liệu Tuple dùng ngoặc?", a: ["[]", "{}", "()", "||"], c: 2 },
        { q: "Lệnh xóa phần tử list theo chỉ số?", a: ["remove", "del", "clear", "discard"], c: 1 },
        { q: "Để kiểm tra x có trong list không?", a: ["in", "has", "exists", "contains"], c: 0 }
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
        { q: "Khóa ngoại dùng để?", a: ["Liên kết bảng", "Khóa máy", "Mã hóa", "Xóa hàng"], c: 0 },
        { q: "Hệ quản trị CSDL viết tắt là?", a: ["DBMS", "OS", "HTML", "RAM"], c: 0 },
        { q: "Bản ghi tương ứng với?", a: ["Cột", "Hàng", "Trang", "Tệp"], c: 1 },
        { q: "Trường tương ứng với?", a: ["Hàng", "Cột", "Bảng", "Ô"], c: 1 },
        { q: "Để thêm dữ liệu vào SQL dùng?", a: ["ADD", "PUT", "INSERT INTO", "CREATE"], c: 2 },
        { q: "Địa chỉ IP gồm mấy số?", a: ["2", "3", "4", "5"], c: 2 },
        { q: "Giao thức truyền tải web?", a: ["FTP", "SMTP", "HTTP", "IP"], c: 2 },
        { q: "Lệnh UPDATE dùng để?", a: ["Xóa", "Thêm", "Sửa", "Tạo"], c: 2 },
        { q: "Hệ thống phân giải tên miền?", a: ["DHCP", "DNS", "FTP", "NAT"], c: 1 },
        { q: "SQL viết tắt của từ gì?", a: ["Structured Query Language", "Simple Question", "Strong Query", "Small Queue"], c: 0 }
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
    if (qIdx >= currentQs.length) { alert("Hết đề!"); location.reload(); return; }
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
    const pHPBox = document.getElementById('player-hp-slots');
    const eHPBox = document.getElementById('enemy-hp-slots');

    if (isCorrect) {
        play('punch');
        player.classList.add('player-punch');
        setTimeout(() => {
            player.classList.remove('player-punch');
            enemy.classList.add('hit-shake');
            eHPBox.classList.add('damaged');
            eHP--;
            updateHP('enemy-hp-slots', eHP);
            setTimeout(() => { 
                enemy.classList.remove('hit-shake'); 
                eHPBox.classList.remove('damaged');
                checkEnd(); 
            }, 300);
        }, 200);
    } else {
        play('hit');
        enemy.classList.add('enemy-punch');
        setTimeout(() => {
            enemy.classList.remove('enemy-punch');
            player.classList.add('hit-shake');
            pHPBox.classList.add('damaged');
            pHP--;
            updateHP('player-hp-slots', pHP);
            setTimeout(() => { 
                player.classList.remove('hit-shake'); 
                pHPBox.classList.remove('damaged');
                checkEnd(); 
            }, 300);
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
        document.getElementById('result-title').innerText = "CHIẾN THẮNG!";
        document.getElementById('result-img').src = "../images/robot-win.jpg";
        document.getElementById('result-msg').innerText = "ROBOT ĐÃ CHIẾN THẮNG VÀ NHẬN CÚP!";
    } else {
        play('lose');
        document.getElementById('result-title').innerText = "THẤT BẠI!";
        document.getElementById('result-img').src = "../images/hocsinh.jpg"; // Hoặc ảnh hocsinh-win.jpg nếu có
        document.getElementById('result-msg').innerText = "HỌC SINH ĐÃ CHIẾN THẮNG TRẬN ĐẤU!";
    }
    screen.style.display = "flex";
}
