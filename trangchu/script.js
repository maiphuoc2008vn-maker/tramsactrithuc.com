document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. XỬ LÝ INTRO OVERLAY ---
    const overlay = document.getElementById('intro-overlay');
    const enterBtn = document.getElementById('enter-site-btn');
    const userInfo = JSON.parse(localStorage.getItem('user_info_sql'));
    
    if (enterBtn && overlay) {
        if (userInfo && userInfo.username) {
            enterBtn.innerHTML = `Chào, ${userInfo.username} <i class="fas fa-arrow-right"></i>`;
        }
        enterBtn.onclick = () => overlay.classList.add('hidden');
    }

    // --- 2. HIỆN AVATAR GÓC PHẢI ---
    const topControls = document.querySelector('.top-controls');
    if (userInfo && topControls) {
        const userDiv = document.createElement('div');
        userDiv.className = 'btn-float float-avatar';
        const avatarUrl = userInfo.avatar || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
        userDiv.innerHTML = `<img src="${avatarUrl}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
        userDiv.onclick = () => {
            if(confirm(`Bạn có muốn đăng xuất khỏi tài khoản ${userInfo.username}?`)) {
                localStorage.removeItem('user_info_sql');
                window.location.reload();
            }
        };
        topControls.insertBefore(userDiv, topControls.firstChild);
    }

    // --- 3. BACKGROUND SLIDESHOW (bg1 -> bg10) ---
    const bgImages = [];
    for (let i = 1; i <= 10; i++) bgImages.push(`../images/bg${i}.jpg`);

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
            }, 600); 
        }, 5000); 
    }

    // --- 4. 3D TILT EFFECT (NGHIÊNG THẺ) ---
    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
            card.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) translateY(-10px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) translateY(0)`;
        });
    });

    // --- 5. DARK MODE ---
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.onclick = () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            themeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        };
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
            themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
});

// --- CÁC HÀM GLOBAL ---
function protectAccess(folder, file) {
    const user = localStorage.getItem('user_info_sql');
    if (user) {
        window.location.href = `../${folder}/${file}`;
    } else {
        const modal = document.getElementById('login-modal');
        modal.classList.add('active');
        modal.querySelector('.btn-confirm').onclick = () => {
            window.location.href = `../login/login.html?den=${folder}/${file}`;
        };
    }
}

function closeLoginModal() {
    document.getElementById('login-modal').classList.remove('active');
}
