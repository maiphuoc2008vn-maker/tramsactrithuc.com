document.addEventListener('DOMContentLoaded', () => {
    
    // 1. INTRO
    const overlay = document.getElementById('intro-overlay');
    const enterBtn = document.getElementById('enter-site-btn');
    const userInfo = JSON.parse(localStorage.getItem('user_info_sql'));
    
    if (enterBtn && overlay) {
        if (userInfo && userInfo.username) {
            enterBtn.innerHTML = `Chào, ${userInfo.username} <i class="fas fa-arrow-right"></i>`;
        }
        enterBtn.addEventListener('click', () => { overlay.classList.add('hidden'); });
    }

    // 2. AVATAR
    const topControls = document.querySelector('.top-controls');
    if (userInfo && topControls) {
        const userDiv = document.createElement('div');
        userDiv.className = 'btn-float float-avatar';
        userDiv.title = "Nhấn để xem thông tin hoặc đăng xuất";
        const avatarUrl = userInfo.avatar || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
        
        userDiv.innerHTML = `<img src="${avatarUrl}" alt="User"><div class="status-dot"></div>`;
        userDiv.onclick = function() {
            if(confirm(`Tài khoản: ${userInfo.username}\nEmail: ${userInfo.email}\n\nBạn có muốn đăng xuất không?`)) {
                localStorage.removeItem('user_info_sql');
                window.location.reload();
            }
        };
        topControls.insertBefore(userDiv, topControls.firstChild);
    }

    // 3. SCROLL
    const reveals = document.querySelectorAll('.reveal, .reveal-text');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;
        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // 4. DARK MODE
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeBtn ? themeBtn.querySelector('i') : null;
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        if(themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
    if(themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            if(themeIcon) themeIcon.classList.replace(isDark ? 'fa-moon' : 'fa-sun', isDark ? 'fa-sun' : 'fa-moon');
        });
    }

    // 5. SLIDESHOW
    const bgImages = [];
    for (let i = 1; i <= 10; i++) { bgImages.push(`../images/bg${i}.jpg`); }
    let bgIndex = 0;
    const heroBg = document.getElementById('hero-bg-slider');
    if (heroBg && bgImages.length > 0) {
        setInterval(() => {
            heroBg.classList.add('fading');
            setTimeout(() => {
                bgIndex = (bgIndex + 1) % bgImages.length;
                const tempImg = new Image();
                tempImg.src = bgImages[bgIndex];
                tempImg.onload = () => {
                    heroBg.src = bgImages[bgIndex];
                    heroBg.classList.remove('fading');
                };
                tempImg.onerror = () => heroBg.classList.remove('fading');
            }, 400);
        }, 5000);
    }
});

// --- HÀM XỬ LÝ ĐƯỜNG DẪN THÔNG MINH ---
function protectAccess(folder, file) {
    const userStr = localStorage.getItem('user_info_sql');
    
    // Kiểm tra xem đang ở thư mục con (trangchu) hay gốc
    const isSubDir = window.location.pathname.includes('/trangchu/');
    const prefix = isSubDir ? '../' : ''; // Nếu ở trangchu thì thêm ../
    const path = `${prefix}${folder}/${file}`;

    if (userStr) {
        window.location.href = path;
    } else {
        showLoginModal(path);
    }
}

function showLoginModal(destinationPath) {
    const modal = document.getElementById('login-modal');
    // Đường dẫn tới trang login cũng cần kiểm tra tương tự
    const isSubDir = window.location.pathname.includes('/trangchu/');
    const loginPath = isSubDir ? '../login/login.html' : 'login/login.html';

    if(modal) {
        modal.classList.add('active');
        const loginBtn = modal.querySelector('.btn-confirm');
        if (loginBtn) {
            loginBtn.onclick = function() {
                window.location.href = `${loginPath}?den=${destinationPath}`;
            };
        }
    } else {
        if(confirm("Bạn cần đăng nhập! Chuyển đến trang đăng nhập?")) {
            window.location.href = `${loginPath}?den=${destinationPath}`;
        }
    }
}

function closeLoginModal() {
    const modal = document.getElementById('login-modal');
    if(modal) modal.classList.remove('active');
}
