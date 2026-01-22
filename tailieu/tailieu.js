import { collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    // --- THÔNG TIN CLOUDINARY CỦA BẠN ---
    const CLOUD_NAME = "DÁN_CLOUD_NAME_CỦA_BẠN_VÀO_ĐÂY";
    const UPLOAD_PRESET = "weblop12a4"; 

    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('docFile');
    const btnSubmit = document.getElementById('btnSubmitUpload');

    // Hàm Upload chính (Dùng Cloudinary thay cho Firebase Storage)
    uploadForm.onsubmit = async (e) => {
        e.preventDefault();
        const file = fileInput.files[0];
        if(!file) return alert("Bạn chưa chọn file!");

        btnSubmit.disabled = true;
        btnSubmit.innerHTML = "Đang tải lên...";

        try {
            // 1. Gửi file lên Cloudinary
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', UPLOAD_PRESET);

            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`, {
                method: 'POST',
                body: formData
            });
            const fileData = await res.json();
            const downloadURL = fileData.secure_url; // Đây là link file để tải về

            // 2. Lưu thông tin link vào Firebase Firestore (Vẫn miễn phí)
            await addDoc(collection(window.fb_db, "documents"), {
                title: uploadForm.title.value || file.name,
                category: uploadForm.category.value,
                file_path: downloadURL,
                file_size: (file.size / 1024).toFixed(1) + " KB",
                createdAt: new Date()
            });

            alert("Đã đăng tài liệu thành công!");
            location.reload();
        } catch (err) {
            console.error(err);
            alert("Lỗi tải lên: " + err.message);
        } finally {
            btnSubmit.disabled = false;
        }
    };

    // Hàm load tài liệu từ Firebase vẫn giữ nguyên như cũ...
});
