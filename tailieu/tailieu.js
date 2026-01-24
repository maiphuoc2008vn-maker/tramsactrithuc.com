/* 
   tailieu.js - TRẠM SẠC TRI THỨC 12A4 
   Sử dụng API Key mới: AIzaSyAvyPpso1f0-csKIwMNjk5GlIE53K9jJDY
*/

import { collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. CẤU HÌNH (GIỮ NGUYÊN CLOUDINARY + KEY MỚI) ---
    const CLOUD_NAME = "dbmh7rkrx"; 
    const UPLOAD_PRESET = "weblop12a4"; 
    const GEMINI_API_KEY = "AIzaSyAvyPpso1f0-csKIwMNjk5GlIE53K9jJDY"; 

    // Kiểm tra kết nối Database
    const checkDB = setInterval(() => {
        if (window.fb_db) {
            clearInterval(checkDB);
            console.log("Kết nối Database thành công!");
            loadDocuments(); 
        }
    }, 500);

    const uploadModal = document.getElementById('upload-modal');
    const fileInput = document.getElementById('docFile');
    const filePreview = document.getElementById('fileListPreview');
    const uploadForm = document.getElementById('uploadForm');
    const btnSubmit = document.getElementById('btnSubmitUpload');

    // Mở/Đóng Modal
    document.getElementById('btnOpenUpload').onclick = () => uploadModal.classList.add('active');
    document.getElementById('btnCloseUpload').onclick = () => {
        uploadModal.classList.remove('active');
        uploadForm.reset();
        filePreview.innerHTML = "";
    };

    fileInput.onchange = function() {
        if (this.files.length > 0) filePreview.innerHTML = `<b>Đã chọn:</b> ${this.files[0].name}`;
    };

    // --- 2. HÀM TẢI TÀI LIỆU (CLOUDINARY + FIREBASE) ---
    uploadForm.onsubmit = async (e) => {
        e.preventDefault();
        const file = fileInput.files[0];
        if (!file) return alert("Vui lòng chọn file!");

        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang tải...';

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', UPLOAD_PRESET);

            const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
                method: 'POST',
                body: formData
            });
            const cloudData = await cloudRes.json();

            await addDoc(collection(window.fb_db, "documents"), {
                title: uploadForm.title.value || file.name,
                category: uploadForm.category.value,
                file_url: cloudData.secure_url,
                file_size: (file.size / 1024).toFixed(1) + " KB",
                createdAt: new Date(),
                uploader: "Thành viên 12A4"
            });

            alert("Tải lên thành công!");
            uploadModal.classList.remove('active');
            uploadForm.reset();
            loadDocuments(); 
        } catch (err) {
            alert("Lỗi tải file: " + err.message);
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = 'Bắt đầu tải lên';
        }
    };

    // --- 3. HIỂN THỊ DANH SÁCH TÀI LIỆU ---
    async function loadDocuments() {
        const container = document.getElementById('doc-list-container');
        if (!container) return;
        try {
            const q = query(collection(window.fb_db, "documents"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            container.innerHTML = "";
            querySnapshot.forEach((doc) => {
                const d = doc.data();
                container.innerHTML += `
                <div class="doc-card" data-category="${d.category}">
                    <div class="file-icon"><i class="fas fa-file-alt"></i></div>
                    <div class="doc-tag">${d.category.toUpperCase()}</div>
                    <h3>${d.title}</h3>
                    <div class="doc-meta">Cỡ: ${d.file_size} • Ngày: ${d.createdAt.toDate().toLocaleDateString('vi-VN')}</div>
                    <a href="${d.file_url}" target="_blank" class="btn-dl">Tải xuống tài liệu →</a>
                </div>`;
            });
        } catch (e) { console.error(e); }
    }

    // --- 4. BỘ LỌC MÔN HỌC ---
    document.querySelectorAll('.pill').forEach(btn => {
        btn.onclick = function() {
            document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            document.querySelectorAll('.doc-card').forEach(card => {
                card.style.display = (filter === 'all' || card.dataset.category === filter) ? 'block' : 'none';
            });
        };
    });

    // --- 5. CHATBOT AI GEMINI (MODEL FLASH 1.5 - KEY MỚI) ---
    const chatWin = document.getElementById('chat-window');
    const chatBody = document.getElementById('chat-body');
    const chatInput = document.getElementById('chat-input');
    const btnSend = document.getElementById('chat-send');

    document.getElementById('chatbot-toggle').onclick = () => chatWin.classList.toggle('active');

    async function handleChat() {
        const userText = chatInput.value.trim();
        if (!userText) return;

        appendMsg(userText, 'user');
        chatInput.value = "";

        const botMsgId = "bot-" + Date.now();
        appendMsg("AI 12A4 đang suy nghĩ...", 'bot', botMsgId);
        chatBody.scrollTop = chatBody.scrollHeight;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Bạn là trợ lý học tập cho lớp 12A4 Nam Hà. 
                                   Hãy trả lời thật thông minh, ngắn gọn. Câu hỏi: ${userText}`
                        }]
                    }]
                })
            });

            const data = await response.json();

            if (!response.ok) {
                const errorDetail = data.error ? data.error.message : "Lỗi không xác định";
                document.getElementById(botMsgId).innerText = "Lỗi AI: " + errorDetail;
                return;
            }

            if (data.candidates && data.candidates[0].content) {
                const aiText = data.candidates[0].content.parts[0].text;
                document.getElementById(botMsgId).innerText = aiText;
            } else {
                document.getElementById(botMsgId).innerText = "AI không có phản hồi phù hợp.";
            }

        } catch (error) {
            document.getElementById(botMsgId).innerText = "Không thể kết nối mạng tới Google AI!";
            console.error(error);
        }
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function appendMsg(text, sender, id = "") {
        const div = document.createElement('div');
        if (id) div.id = id;
        div.className = `msg ${sender}`;
        div.innerText = text;
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    btnSend.onclick = handleChat;
    chatInput.onkeypress = (e) => { if (e.key === "Enter") handleChat(); };
});
