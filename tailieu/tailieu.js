/* 
   tailieu.js - TRẠM SẠC TRI THỨC 12A4 
   Tính năng: Quản lý tài liệu (Firebase + Cloudinary) & Trợ lý AI (Gemini 1.5 Flash)
*/

import { collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. THÔNG TIN CẤU HÌNH (GIỮ NGUYÊN TỪ BẢN GỐC) ---
    const CLOUD_NAME = "dbmh7rkrx"; 
    const UPLOAD_PRESET = "weblop12a4"; 
    const GEMINI_API_KEY = "AIzaSyDFP8Hi3KOeXqOLQ1KK4Q782eNvNJMHF7k"; // Key của bạn

    // Chờ Firebase khởi tạo (Biến fb_db được định nghĩa ở file HTML)
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

    // MỞ/ĐÓNG MODAL TẢI FILE
    document.getElementById('btnOpenUpload').onclick = () => uploadModal.classList.add('active');
    document.getElementById('btnCloseUpload').onclick = () => {
        uploadModal.classList.remove('active');
        uploadForm.reset();
        filePreview.innerHTML = "";
    };

    fileInput.onchange = function() {
        if (this.files.length > 0) {
            filePreview.innerHTML = `<b>Đã chọn:</b> ${this.files[0].name}`;
        }
    };

    // --- 2. HÀM TẢI TÀI LIỆU LÊN (CLOUDINARY + FIREBASE) ---
    uploadForm.onsubmit = async (e) => {
        e.preventDefault();
        const file = fileInput.files[0];
        const title = uploadForm.title.value;
        const category = uploadForm.category.value;

        if (!file) return alert("Vui lòng chọn file!");

        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang tải lên...';

        try {
            // Bước A: Gửi lên Cloudinary
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', UPLOAD_PRESET);

            const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
                method: 'POST',
                body: formData
            });
            const cloudData = await cloudRes.json();

            if (!cloudData.secure_url) throw new Error("Cloudinary chưa được cấu hình Unsigned.");

            // Bước B: Lưu vào Firebase Firestore
            await addDoc(collection(window.fb_db, "documents"), {
                title: title || file.name,
                category: category,
                file_url: cloudData.secure_url,
                file_size: (file.size / 1024).toFixed(1) + " KB",
                createdAt: new Date(),
                uploader: "Thành viên 12A4"
            });

            alert("Đăng tài liệu thành công!");
            uploadModal.classList.remove('active');
            uploadForm.reset();
            loadDocuments(); // Tải lại danh sách

        } catch (err) {
            console.error(err);
            alert("Lỗi tải lên: " + err.message);
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = 'Bắt đầu tải lên';
        }
    };

    // --- 3. HÀM HIỂN THỊ DANH SÁCH TÀI LIỆU ---
    async function loadDocuments() {
        const container = document.getElementById('doc-list-container');
        if (!container) return;
        container.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Đang tải dữ liệu...</p>';

        try {
            const q = query(collection(window.fb_db, "documents"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            
            container.innerHTML = "";
            if (querySnapshot.empty) {
                container.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Chưa có tài liệu nào.</p>';
                return;
            }

            querySnapshot.forEach((doc) => {
                const d = doc.data();
                let icon = 'fa-file-alt';
                if (d.title.toLowerCase().includes('pdf')) icon = 'fa-file-pdf';
                else if (d.title.toLowerCase().includes('doc')) icon = 'fa-file-word';

                container.innerHTML += `
                <div class="doc-card" data-category="${d.category}">
                    <div class="file-icon"><i class="fas ${icon}"></i></div>
                    <div class="doc-tag">${d.category.toUpperCase()}</div>
                    <h3>${d.title}</h3>
                    <div class="doc-meta">Cỡ: ${d.file_size} • Ngày: ${d.createdAt.toDate().toLocaleDateString('vi-VN')}</div>
                    <a href="${d.file_url}" target="_blank" class="btn-dl">Tải xuống tài liệu →</a>
                </div>`;
            });
        } catch (e) {
            container.innerHTML = "Lỗi kết nối Database.";
        }
    }

    // --- 4. LOGIC BỘ LỌC (FILTER) ---
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

    // --- 5. TRỢ LÝ AI GEMINI 1.5 FLASH ---
    const chatWin = document.getElementById('chat-window');
    const chatBody = document.getElementById('chat-body');
    const chatInput = document.getElementById('chat-input');
    const btnSend = document.getElementById('chat-send');

    // Mở/đóng khung chat
    document.getElementById('chatbot-toggle').onclick = () => {
        chatWin.classList.toggle('active');
        if(chatWin.classList.contains('active')) chatInput.focus();
    };

    async function handleChat() {
        const userText = chatInput.value.trim();
        if (!userText) return;

        // Hiện tin nhắn người dùng
        appendMsg(userText, 'user');
        chatInput.value = "";

        // Tạo bong bóng tin nhắn cho Bot (trạng thái chờ)
        const botMsgId = "bot-" + Date.now();
        appendMsg("Trợ lý 12A4 đang suy nghĩ...", 'bot', botMsgId);
        chatBody.scrollTop = chatBody.scrollHeight;

        try {
            // GỌI API GOOGLE GEMINI
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Bạn là trợ lý học tập thông minh cho lớp 12A4 trường THPT Nam Hà. 
                                   Hãy trả lời thân thiện, ngắn gọn và hữu ích.
                                   Câu hỏi: ${userText}`
                        }]
                    }]
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error ? data.error.message : "Lỗi API");
            }

            // Lấy kết quả văn bản từ AI
            const aiText = data.candidates[0].content.parts[0].text;
            document.getElementById(botMsgId).innerText = aiText;

        } catch (error) {
            console.error("Lỗi AI:", error);
            document.getElementById(botMsgId).innerText = "Xin lỗi, mình gặp lỗi kết nối. Hãy kiểm tra lại API Key hoặc mạng nhé!";
        }
        
        // Cuộn xuống tin nhắn mới nhất
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // Hàm thêm tin nhắn vào giao diện
    function appendMsg(text, sender, id = "") {
        const msgDiv = document.createElement('div');
        if (id) msgDiv.id = id;
        msgDiv.className = `msg ${sender}`;
        msgDiv.innerText = text;
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // Gửi khi bấm nút hoặc nhấn Enter
    btnSend.onclick = handleChat;
    chatInput.onkeypress = (e) => { if (e.key === "Enter") handleChat(); };
});
