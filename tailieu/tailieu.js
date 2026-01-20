document.addEventListener('DOMContentLoaded', () => {
    loadDocuments();

    const uploadModal = document.getElementById('upload-modal');
    const fileInput = document.getElementById('docFile');
    const filePreview = document.getElementById('fileListPreview');
    const uploadForm = document.getElementById('uploadForm');

    // 1. Toast Notification Xịn
    function showToast(msg) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${msg}</span>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    // 2. Mở/Đóng Modal
    document.getElementById('btnOpenUpload').onclick = () => uploadModal.classList.add('active');
    document.getElementById('btnCloseUpload').onclick = () => {
        uploadModal.classList.remove('active');
        uploadForm.reset();
        filePreview.innerHTML = "";
    };

    // 3. Hiển thị danh sách file khi chọn
    fileInput.onchange = function() {
        if (this.files.length > 0) {
            filePreview.innerHTML = `Đã chọn ${this.files.length} file: ` + 
                Array.from(this.files).map(f => f.name).slice(0, 2).join(', ') + (this.files.length > 2 ? '...' : '');
        }
    };

    // 4. Xử lý Upload Đa File
    uploadForm.onsubmit = async (e) => {
        e.preventDefault();
        const btn = document.getElementById('btnSubmitUpload');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;

        const formData = new FormData(uploadForm);
        const user = JSON.parse(localStorage.getItem('user_info_sql') || '{}');
        formData.append('uploader', user.username || 'Thành viên lớp');

        try {
            const res = await fetch('../api/upload.php', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.status === 'success') {
                showToast(data.message);
                setTimeout(() => location.reload(), 1500);
            }
        } catch (err) { alert("Lỗi kết nối!"); }
    };

    // 5. Load Tài liệu (Có Icon theo đuôi file)
    async function loadDocuments() {
        const container = document.getElementById('doc-list-container');
        try {
            const res = await fetch('../api/get_documents.php');
            const docs = await res.json();
            container.innerHTML = docs.map(doc => {
                let icon = 'fa-file-alt'; // Mặc định
                const name = doc.title.toLowerCase();
                if(name.includes('.pdf')) icon = 'fa-file-pdf';
                if(name.includes('.doc')) icon = 'fa-file-word';
                if(name.includes('.jpg') || name.includes('.png')) icon = 'fa-file-image';
                if(name.includes('.ppt')) icon = 'fa-file-powerpoint';

                return `
                <div class="doc-card" data-category="${doc.category}">
                    <div class="file-icon"><i class="fas ${icon}"></i></div>
                    <div class="doc-tag">${doc.category}</div>
                    <h3>${doc.title}</h3>
                    <div class="doc-meta">Đăng bởi: ${doc.uploader} • ${doc.file_size}</div>
                    <a href="${doc.file_path}" download class="btn-dl">Tải xuống →</a>
                </div>`;
            }).join('');
        } catch (e) { container.innerHTML = "Không thể tải dữ liệu."; }
    }

    // 6. Chatbot Logic
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
            const b = document.createElement('div'); b.className = 'msg bot'; b.innerText = "Robot 12A4 đã nhận tin! Cần tìm gì hãy hỏi nhé.";
            chatBody.appendChild(b); chatBody.scrollTop = chatBody.scrollHeight;
        }, 600);
    };

    // 7. Lọc môn học
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