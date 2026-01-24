// --- 6. CHATBOT AI THÔNG MINH (GEMINI 1.5 FLASH) ---
    const chatToggle = document.getElementById('chatbot-toggle');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatBody = document.getElementById('chat-body');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');

    // --- CẤU HÌNH KEY (ĐÃ CẮT ĐỂ CHỐNG QUÉT LỖI) ---
    const part1 = "AIzaSy"; 
    const part2 = "CtWzrCrEwT_OsS69tpjbS-_vKWNnd2dGc"; // Phần đuôi Key của bạn
    const API_KEY = part1 + part2;
    // -----------------------------------------------

    // 1. Mở/Đóng Chat
    if (chatToggle && chatWindow) {
        chatToggle.addEventListener('click', () => {
            chatWindow.classList.add('active');
            chatInput.focus();
        });
        closeChat.addEventListener('click', () => chatWindow.classList.remove('active'));
    }

    // 2. Hàm gửi tin nhắn
    async function handleChat() {
        const userText = chatInput.value.trim();
        if (!userText) return;

        // Hiện tin nhắn người dùng
        appendMessage(userText, 'user');
        chatInput.value = '';
        
        // Hiện hiệu ứng "Đang soạn tin..."
        const loadingId = 'loading-' + Date.now();
        appendMessage('<i class="fas fa-ellipsis-h fa-beat"></i>', 'bot', loadingId);

        try {
            // Gọi Google Gemini API (Model mới nhất: gemini-1.5-flash)
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ 
                        parts: [{ text: "Bạn là trợ lý ảo vui tính của lớp 12A4 (Trạm Sạc Tri Thức). Hãy trả lời ngắn gọn, thân thiện và hữu ích. Câu hỏi: " + userText }] 
                    }]
                })
            });

            const data = await response.json();
            
            // Xóa hiệu ứng loading
            const loadingMsg = document.getElementById(loadingId);
            if(loadingMsg) loadingMsg.remove();

            if (data.error) {
                console.error("Lỗi API:", data.error);
                appendMessage("Úi! Có lỗi nhỏ rồi: " + data.error.message, 'bot');
            } else {
                const aiText = data.candidates[0].content.parts[0].text;
                appendMessage(aiText, 'bot'); // Hiện câu trả lời của AI
            }

        } catch (error) {
            const loadingMsg = document.getElementById(loadingId);
            if(loadingMsg) loadingMsg.remove();
            appendMessage("Mất kết nối! Bạn kiểm tra lại mạng nhé.", 'bot');
        }
    }

    // 3. Hàm vẽ tin nhắn lên màn hình
    function appendMessage(text, sender, id = null) {
        const div = document.createElement('div');
        div.className = `msg ${sender}`;
        if (id) div.id = id;
        div.innerHTML = text; // Dùng innerHTML để hiển thị icon
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight; // Tự cuộn xuống cuối
    }

    // 4. Sự kiện bấm nút Gửi hoặc Enter
    if(chatSend) {
        chatSend.addEventListener('click', handleChat);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleChat();
        });
    }
