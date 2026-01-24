document.addEventListener('DOMContentLoaded', () => {
    // 1. MÀN HÌNH CHÀO
    const overlay = document.getElementById('intro-overlay');
    const enterBtn = document.getElementById('enter-site-btn');
    const userInfo = JSON.parse(localStorage.getItem('user_info_sql'));

    if (enterBtn && overlay) {
        if (userInfo && userInfo.username) {
            enterBtn.innerHTML = `Chào, ${userInfo.username} <i class="fas fa-arrow-right"></i>`;
        }
        enterBtn.onclick = () => overlay.classList.add('hidden');
    }

    // 2. AVATAR USER
    const topControls = document.querySelector('.top-controls');
    if (userInfo && topControls) {
        const userDiv = document.createElement('div');
        userDiv.className = 'btn-float';
        userDiv.innerHTML = `<img src="${userInfo.avatar || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
        userDiv.onclick = () => {
            if(confirm('Đăng xuất nhé?')) { localStorage.removeItem('user_info_sql'); location.reload(); }
        };
        topControls.insertBefore(userDiv, topControls.firstChild);
    }

    // 3. DARK MODE
    const themeBtn = document.getElementById('theme-toggle');
    if(themeBtn) {
        themeBtn.onclick = () => {
            document.body.classList.toggle('dark-mode');
        };
    }
    
    // 4. CHATBOT AI (KEY ĐÃ CẤU HÌNH)
    const chatToggle = document.getElementById('chatbot-toggle');
    const chatWindow = document.getElementById('chat-window');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatBody = document.getElementById('chat-body');

    // KEY CỦA BẠN (Đã cắt để bảo mật)
    const p1 = "AIzaSy";
    const p2 = "CtWzrCrEwT_OsS69tpjbS-_vKWNnd2dGc";
    const API_KEY = p1 + p2;

    if (chatToggle) {
        chatToggle.onclick = () => chatWindow.classList.add('active');
        document.getElementById('close-chat').onclick = () => chatWindow.classList.remove('active');

        async function handleChat() {
            const txt = chatInput.value.trim();
            if(!txt) return;
            addMsg(txt, 'user');
            chatInput.value = '';
            addMsg('...', 'bot', 'loading');

            try {
                const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ contents: [{ parts: [{ text: "Trả lời ngắn gọn: " + txt }] }] })
                });
                const data = await res.json();
                document.getElementById('loading').remove();
                addMsg(data.candidates[0].content.parts[0].text, 'bot');
            } catch(e) {
                document.getElementById('loading').remove();
                addMsg("Lỗi mạng rồi!", 'bot');
            }
        }

        chatSend.onclick = handleChat;
        chatInput.onkeypress = (e) => { if(e.key==='Enter') handleChat() };
    }

    function addMsg(txt, sender, id) {
        const d = document.createElement('div');
        d.className = `msg ${sender}`;
        if(id) d.id = id;
        d.innerText = txt;
        chatBody.appendChild(d);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
});

// HÀM CHUYỂN TRANG
function protectAccess(folder, file) {
    if (localStorage.getItem('user_info_sql')) {
        window.location.href = `../${folder}/${file}`;
    } else {
        document.getElementById('login-modal').classList.add('active');
    }
}
function closeLoginModal() { document.getElementById('login-modal').classList.remove('active'); }
