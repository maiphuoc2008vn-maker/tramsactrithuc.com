document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. XỬ LÝ INTRO OVERLAY (MÀN HÌNH CHÀO) ---
    const overlay = document.getElementById('intro-overlay');
    const enterBtn = document.getElementById('enter-site-btn');
    
    // Lấy thông tin user từ LocalStorage
    const userInfo = JSON.parse(localStorage.getItem('user_info_sql'));
    
    if (enterBtn && overlay) {
        if (userInfo && userInfo.username) {
            enterBtn.innerHTML = `Chào, ${userInfo.username} <i class="fas fa-arrow-right"></i>`;
        }
        enterBtn.addEventListener('click', () => {
            overlay.classList.add('hidden');
        });
    }

    // --- 2. HIỆN AVATAR GÓC PHẢI (NẾU ĐÃ ĐĂNG NHẬP) ---
    const topControls = document.querySelector('.top-controls');
    if (userInfo && topControls) {
        const userDiv = document.createElement('div');
        userDiv.className = 'btn-float float-avatar';
        userDiv.title = "Nhấn để xem thông tin hoặc đăng xuất";
        
        const avatarUrl = userInfo.avatar || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
        
        userDiv.innerHTML = `
            <img src="${avatarUrl}" alt="User">
            <div class="status-dot"></div>
        `;
        
        userDiv.onclick = function() {
            if(confirm(`Tài khoản: ${userInfo.username}\nEmail: ${userInfo.email}\n\nBạn có muốn đăng xuất không?`)) {
                localStorage.removeItem('user_info_sql');
                window.location.reload();
            }
        };

        topControls.insertBefore(userDiv, topControls.firstChild);
    }

    // --- 3. HIỆU ỨNG CUỘN (SCROLL REVEAL) ---
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

    // --- 4. 3D TILT EFFECT (CHỈ CHẠY TRÊN LAPTOP/PC) ---
    // Kiểm tra kích thước màn hình > 768px mới bật hiệu ứng
    if (window.matchMedia("(min-width: 768px)").matches) {
        const cards = document.querySelectorAll('.tilt-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
            });
        });
    }

    // --- 5. DARK MODE (CHẾ ĐỘ TỐI) ---
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

    // --- 6. CHATBOT ---
    const chatBtn = document.getElementById('chatbot-toggle');
    if(chatBtn) {
        chatBtn.addEventListener('click', () => {
            alert("Xin chào! Tôi là trợ lý ảo của lớp 12A4. Hiện tại tôi đang học việc, quay lại sau nhé!");
        });
    }

    // --- 7. BACKGROUND SLIDESHOW (ẢNH NỀN TỰ ĐỔI) ---
    const bgImages = [];
    for (let i = 1; i <= 10; i++) { 
        bgImages.push(`../images/bg${i}.jpg`);
    }

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

/* =============================================================
   HÀM GLOBAL (GỌI TỪ HTML)
   ============================================================= */

function protectAccess(folder, file) {
    const userStr = localStorage.getItem('user_info_sql');
    if (userStr) {
        window.location.href = `../${folder}/${file}`;
    } else {
        showLoginModal(folder, file);
    }
}

function showLoginModal(folder, file) {
    const modal = document.getElementById('login-modal');
    if(modal) {
        modal.classList.add('active');
        const loginBtn = modal.querySelector('.btn-confirm');
        if (loginBtn) {
            loginBtn.onclick = function() {
                window.location.href = `../login/login.html?den=${folder}/${file}`;
            };
        }
    } else {
        if(confirm("Bạn cần đăng nhập! Chuyển đến trang đăng nhập?")) {
            window.location.href = `../login/login.html?den=${folder}/${file}`;
        }
    }
}

function closeLoginModal() {
    const modal = document.getElementById('login-modal');
    if(modal) modal.classList.remove('active');
}
