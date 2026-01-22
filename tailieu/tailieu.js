import { collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    // THÔNG TIN CLOUDINARY CỦA BẠN
    const CLOUD_NAME = "dbmh7rkrx"; 
    const UPLOAD_PRESET = "weblop12a4";

    const waitFB = setInterval(() => {
        if (window.fb_db) { clearInterval(waitFB); loadDocuments(); }
    }, 500);

    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('docFile');
    const btnSubmit = document.getElementById('btnSubmitUpload');

    // HÀM UPLOAD FILE
    if(uploadForm) {
        uploadForm.onsubmit = async (e) => {
            e.preventDefault();
            const file = fileInput.files[0];
            if(!file) return alert("Vui lòng chọn file!");

            btnSubmit.disabled = true;
            btnSubmit.innerHTML = "Đang tải lên...";

            try {
                // 1. Đẩy file lên Cloudinary (Miễn phí 25GB)
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', UPLOAD_PRESET);

                const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
                    method: 'POST',
                    body: formData
                });
                const fileData = await res.json();
                
                if(!fileData.secure_url) throw new Error("Lỗi Cloudinary: Hãy kiểm tra lại Upload Preset đã để Unsigned chưa.");

                // 2. Lưu link file vào Firebase Firestore (Database)
                await addDoc(collection(window.fb_db, "documents"), {
                    title: uploadForm.title.value || file.name,
                    category: uploadForm.category.value,
                    file_path: fileData.secure_url,
                    file_size: (file.size / 1024).toFixed(1) + " KB",
                    createdAt: new Date()
                });

                alert("Tải lên thành công!");
                location.reload();
            } catch (err) {
                alert("Lỗi: " + err.message);
                console.error(err);
            } finally {
                btnSubmit.disabled = false;
            }
        };
    }

    // HÀM LOAD DANH SÁCH TÀI LIỆU
    async function loadDocuments() {
        const container = document.getElementById('doc-list-container');
        try {
            const q = query(collection(window.fb_db, "documents"), orderBy("createdAt", "desc"));
            const snap = await getDocs(q);
            container.innerHTML = "";
            snap.forEach(doc => {
                const d = doc.data();
                container.innerHTML += `
                <div class="doc-card" data-category="${d.category}">
                    <div class="file-icon"><i class="fas fa-file-alt"></i></div>
                    <div class="doc-tag">${d.category}</div>
                    <h3>${d.title}</h3>
                    <div class="doc-meta">Cỡ: ${d.file_size}</div>
                    <a href="${d.file_path}" target="_blank" class="btn-dl">Tải xuống →</a>
                </div>`;
            });
        } catch (e) { console.error(e); }
    }
});
