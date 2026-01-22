import { collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    // --- CẤU HÌNH CLOUDINARY ---
    const CLOUD_NAME = "dbmh7rkrx"; 
    const UPLOAD_PRESET = "weblop12a4"; // Tên preset bạn đã đặt là Unsigned

    // Chờ Firebase kết nối
    const checkDB = setInterval(() => {
        if (window.fb_db) {
            clearInterval(checkDB);
            loadDocuments(); 
        }
    }, 500);

    const uploadModal = document.getElementById('upload-modal');
    const fileInput = document.getElementById('docFile');
    const filePreview = document.getElementById('fileListPreview');
    const uploadForm = document.getElementById('uploadForm');
    const btnSubmit = document.getElementById('btnSubmitUpload');

    // 1. Mở/Đóng Modal
    document.getElementById('btnOpenUpload').onclick = () => uploadModal.classList.add('active');
    document.getElementById('btnCloseUpload').onclick = () => {
        uploadModal.classList.remove('active');
        uploadForm.reset();
        filePreview.innerHTML = "";
    };

    // 2. Preview file khi chọn
    fileInput.onchange = function() {
        if (this.files.length > 0) {
            filePreview.innerHTML = `Đã chọn: ${this.files[0].name}`;
        }
    };

    // 3. XỬ LÝ UPLOAD (Cloudinary + Firebase)
    uploadForm.onsubmit = async (e) => {
        e.preventDefault();
        const file = fileInput.files[0];
        const title = uploadForm.title.value;
        const category = uploadForm.category.value;

        if (!file) return alert("Vui lòng chọn file!");

        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang tải...';

        try {
            // Bước A: Gửi file lên Cloudinary (Miễn phí lưu trữ)
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', UPLOAD_PRESET);

            const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
                method: 'POST',
                body: formData
            });
            const cloudData = await cloudRes.json();

            if (!cloudData.secure_url) throw new Error("Lỗi Cloudinary: Hãy kiểm tra lại Preset đã để Unsigned chưa.");

            // Bước B: Lưu link file vào Firebase Firestore (Database)
            await addDoc(collection(window.fb_db, "documents"), {
                title: title || file.name,
                category: category,
                file_url: cloudData.secure_url,
                file_size: (file.size / 1024).toFixed(1) + " KB",
                createdAt: new Date()
            });

            alert("Đã đăng tài liệu thành công!");
            uploadModal.classList.remove('active');
            uploadForm.reset();
            loadDocuments(); // Tải lại danh sách
        } catch (err) {
            alert("Lỗi: " + err.message);
            console.error(err);
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = 'Bắt đầu tải lên';
        }
    };

    // 4. HÀM LOAD DANH SÁCH TÀI LIỆU
    async function loadDocuments() {
        const container = document.getElementById('doc-list-container');
        if (!container) return;
        container.innerHTML = '<p style="text-align:center; grid-column:1/-1;">Đang tải dữ liệu...</p>';

        try {
            const q = query(collection(window.fb_db, "documents"), orderBy("createdAt", "desc"));
            const snap = await getDocs(q);
            container.innerHTML = "";

            if (snap.empty) {
                container.innerHTML = '<p style="text-align:center; grid-column:1/-1;">Chưa có tài liệu nào.</p>';
                return;
            }

            snap.forEach((doc) => {
                const d = doc.data();
                let icon = 'fa-file-alt';
                if (d.title.toLowerCase().includes('pdf')) icon = 'fa-file-pdf';
                if (d.title.toLowerCase().includes('doc')) icon = 'fa-file-word';

                container.innerHTML += `
                <div class="doc-card" data-category="${d.category}">
                    <div class="file-icon"><i class="fas ${icon}"></i></div>
                    <div class="doc-tag">${d.category.toUpperCase()}</div>
                    <h3>${d.title}</h3>
                    <div class="doc-meta">Cỡ: ${d.file_size} • Ngày: ${d.createdAt.toDate().toLocaleDateString('vi-VN')}</div>
                    <a href="${d.file_url}" target="_blank" class="btn-dl">Tải xuống →</a>
                </div>`;
            });
        } catch (e) { console.error(e); }
    }

    // 5. CHATBOT LOGIC
    const chatWin = document.getElementById('chat-window');
    const chatBody = document.getElementById('chat-body');
    const chatInput = document.getElementById('chat-input');
    document.getElementById('chatbot-toggle').onclick = () => chatWin.classList.toggle('active');
    document.getElementById('chat-send').onclick = () => {
        const val = chatInput.value.trim();
        if(!val) return;
        const u = document.createElement('div'); u.className = 'msg user'; u.innerText = val;
        chatBody.appendChild(u); chatInput.value = "";
        setTimeout(() => {
            const b = document.createElement('div'); b.className = 'msg bot'; b.innerText = "Chào bạn! Mình là trợ lý 12A4. Bạn cần tìm tài liệu gì cứ nhắn nhé!";
            chatBody.appendChild(b); chatBody.scrollTop = chatBody.scrollHeight;
        }, 600);
    };

    // 6. LỌC MÔN HỌC
    document.querySelectorAll('.pill').forEach(btn => {
        btn.onclick = function() {
            document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            const f = this.getAttribute('data-filter');
            document.querySelectorAll('.doc-card').forEach(c => {
                c.style.display = (f === 'all' || c.dataset.category === f) ? 'block' : 'none';
            });
        };
    });
});
