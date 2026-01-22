import { collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const CLOUD_NAME = "dbmh7rkrx"; 
    const UPLOAD_PRESET = "weblop12a4"; 

    // Kiểm tra kết nối Database
    const checkDB = setInterval(() => {
        if (window.fb_db) {
            clearInterval(checkDB);
            console.log("Firebase OK!");
            loadDocuments(); 
        }
    }, 500);

    const uploadForm = document.getElementById('uploadForm');
    const btnSubmit = document.getElementById('btnSubmitUpload');

    if(uploadForm) {
        uploadForm.onsubmit = async (e) => {
            e.preventDefault();
            const file = document.getElementById('docFile').files[0];
            if(!file) return alert("Bạn chưa chọn file!");

            btnSubmit.disabled = true;
            btnSubmit.innerHTML = 'Đang tải lên Cloudinary...';

            try {
                // Bước 1: Upload lên Cloudinary
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', UPLOAD_PRESET);

                const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
                    method: 'POST',
                    body: formData
                });
                
                const cloudData = await res.json();
                
                if(!cloudData.secure_url) {
                    console.error("Lỗi Cloudinary:", cloudData);
                    throw new Error("Lỗi Cloudinary: Bạn chưa để Preset là 'Unsigned' hoặc sai Cloud Name.");
                }

                // Bước 2: Lưu vào Firebase
                btnSubmit.innerHTML = 'Đang lưu vào Database...';
                await addDoc(collection(window.fb_db, "documents"), {
                    title: uploadForm.title.value || file.name,
                    category: uploadForm.category.value,
                    file_url: cloudData.secure_url,
                    file_size: (file.size / 1024).toFixed(1) + " KB",
                    createdAt: new Date()
                });

                alert("Tải lên thành công 100%!");
                location.reload();
            } catch (err) {
                console.error("LỖI:", err);
                alert("KHÔNG TẢI LÊN ĐƯỢC: " + err.message);
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = 'Bắt đầu tải lên';
            }
        };
    }

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
                    <h3>${d.title}</h3>
                    <div class="doc-meta">Môn: ${d.category} • ${d.file_size}</div>
                    <a href="${d.file_url}" target="_blank" class="btn-dl">Tải xuống</a>
                </div>`;
            });
        } catch (e) { 
            console.error("Lỗi hiển thị:", e);
            container.innerHTML = "Lỗi kết nối Database. Hãy kiểm tra lại Rules của Firestore.";
        }
    }
});
