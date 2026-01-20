const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

// Hiệu ứng trượt
if (signUpButton && signInButton && container) {
    signUpButton.addEventListener('click', () => {
        container.classList.add("right-panel-active");
    });

    signInButton.addEventListener('click', () => {
        container.classList.remove("right-panel-active");
    });
}

// Xử lý Đăng Ký
const btnRegister = document.getElementById('btn-register');
if (btnRegister) {
    btnRegister.addEventListener('click', (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const pass = document.getElementById('reg-pass').value.trim();

        if (!name || !email || !pass) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        fetch('../api/register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: name, password: pass, email: email })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                alert("Lỗi: " + data.error);
            } else {
                alert("Đăng ký thành công! Vui lòng đăng nhập.");
                container.classList.remove("right-panel-active");
            }
        })
        .catch(err => {
            console.error(err);
            alert("Không thể kết nối tới Server.");
        });
    });
}

// Xử lý Đăng Nhập (SỬA LỖI ĐƯỜNG DẪN Ở ĐÂY)
const btnLogin = document.getElementById('btn-login');
if (btnLogin) {
    btnLogin.addEventListener('click', (e) => {
        e.preventDefault();
        const name = document.getElementById('login-name').value.trim();
        const pass = document.getElementById('login-pass').value.trim();

        if (!name || !pass) {
            alert("Vui lòng nhập tên đăng nhập và mật khẩu!");
            return;
        }

        fetch('../api/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: name, password: pass })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                // Lưu thông tin user
                localStorage.setItem('user_info_sql', JSON.stringify(data.user));
                
                // --- SỬA ĐÚNG ĐƯỜNG DẪN TẠI ĐÂY ---
                // Thoát ra khỏi login, vào thư mục game
                window.location.href = "../game/hub.html"; 
            }
        })
        .catch(err => {
            console.error(err);
            alert("Lỗi kết nối Server.");
        });
    });
}