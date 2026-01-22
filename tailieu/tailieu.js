import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    // Chờ Firebase khởi tạo xong (vì load từ module html)
    const checkFirebase = setInterval(() => {
        if (window.fb_storage && window.fb_db) {
            clearInterval(checkFirebase);
            loadDocuments(); 
        }
    }, 500);

    const uploadModal = document.getElementById('upload-modal');
    const fileInput = document.getElementById('docFile');
    const filePreview = document.getElementById('fileListPreview');
    const uploadForm = document.getElementById('uploadForm');

    // 1. Thông báo Toast
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

    // 3. Xem trước file đã chọn
    fileInput.onchange = function() {
        if (this.files.length > 0) {
            filePreview.innerHTML = `Đã chọn ${this.files.length} file: ` + 
                Array.from(this.files).map(f => f.name).slice(0, 2).join(', ') + (this.files.length > 2 ? '...' : '');
        }
    };

    // 4. Xử lý Upload lên FIREBASE
    uploadForm.onsubmit = async (e) => {
        e.preventDefault();
        const btn = document.getElementById('btnSubmitUpload');
        const files = fileInput.files;
        const category = uploadForm.category.value;
        const titleInput = uploadForm.title.value;

        if (files.length === 0) return alert("Vui lòng chọn file!");

        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang tải lên...';
        btn.disabled = true;

        try {
            for (let file of files) {
                // Tải lên Firebase Storage
                const storageRef = ref(window.fb_storage, 'documents/' + Date.now() + "_" + file.name);
                const snapshot = await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(snapshot.ref);

                // Lưu thông tin vào Firestore Database
                await addDoc(collection(window.fb_db, "documents"), {
                    title: titleInput || file.name,
                    category: category,
                    file_path: downloadURL,
                    uploader: "Thành viên lớp",
                    file_size: (file.size / 1024).toFixed(1) + " KB",
                    createdAt: new Date()
                });
            }

            showToast("Đã đăng tài liệu thành công!");
            uploadModal.classList.remove('active');
            uploadForm.reset();
            filePreview.innerHTML = "";
            loadDocuments(); // Tải lại danh sách
        } catch (err) {
            console.error(err);
            alert("Lỗi tải lên: " + err.message);
        } finally {
            btn.innerHTML = 'Bắt đầu tải lên';
            btn.disabled = false;
        }
    };

    // 5. Load Tài liệu từ FIREBASE
    async function loadDocuments() {
        const container = document.getElementById('doc-list-container');
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Đang tải dữ liệu...</p>';
        
        try {
            const q = query(collection(window.fb_db, "documents"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Chưa có tài liệu nào.</p>';
                return;
            }

            container.innerHTML = "";
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                let icon = 'fa-file-alt';
                const name = data.title.toLowerCase();
                if(name.includes('pdf')) icon = 'fa-file-pdf';
                else if(name.includes('doc')) icon = 'fa-file-word';
                else if(name.includes('ppt')) icon = 'fa-file-powerpoint';
                else if(name.includes('jpg') || name.includes('png')) icon = 'fa-file-image';

                container.innerHTML += `
                <div class="doc-card" data-category="${data.category}">
                    <div class="file-icon"><i class="fas ${icon}"></i></div>
                    <div class="doc-tag">${data.category}</div>
                    <h3>${data.title}</h3>
                    <div class="doc-meta">Đăng bởi: ${data.uploader} • ${data.file_size}</div>
                    <a href="${data.file_path}" target="_blank" download class="btn-dl">Tải xuống →</a>
                </div>`;
            });
        } catch (e) { 
            console.error(e);
            container.innerHTML = "Lỗi khi tải danh sách."; 
        }
    }

    // 6. Chatbot Logic (Giữ nguyên của bạn)
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
