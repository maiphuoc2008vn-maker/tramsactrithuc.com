// File: profile/profile.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. KIỂM TRA ĐĂNG NHẬP
    const userStr = localStorage.getItem('user_info_sql');
    if(!userStr) {
        showToast("Bạn chưa đăng nhập!", "error");
        setTimeout(() => window.location.href = '../login/login.html', 1500);
        return;
    }

    const user = JSON.parse(userStr);
    
    // 2. LOAD DỮ LIỆU LÊN FORM
    document.getElementById('p-username').textContent = user.username;
    if(user.fullname) document.getElementById('inp-fullname').value = user.fullname;
    if(user.phone) document.getElementById('inp-phone').value = user.phone;
    if(user.bio) document.getElementById('inp-bio').value = user.bio;
    if(user.class_name) {
        document.getElementById('inp-class').value = user.class_name;
        document.getElementById('display-class').textContent = user.class_name;
    }
    if(user.dob) document.getElementById('inp-dob').value = user.dob;
    if(user.avatar_url) document.getElementById('p-avatar').src = user.avatar_url;
});

// 3. XỬ LÝ LƯU THÔNG TIN (TEXT)
document.getElementById('profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const userStr = localStorage.getItem('user_info_sql');
    const user = JSON.parse(userStr);

    const dataToSend = {
        username: user.username,
        fullname: document.getElementById('inp-fullname').value,
        phone: document.getElementById('inp-phone').value,
        bio: document.getElementById('inp-bio').value,
        class_name: document.getElementById('inp-class').value,
        dob: document.getElementById('inp-dob').value
    };

    const btn = document.querySelector('.save-btn');
    const oldText = btn.textContent;
    btn.textContent = "Đang lưu...";
    btn.disabled = true;

    fetch('../api/update_profile.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dataToSend)
    })
    .then(res => res.json())
    .then(data => {
        btn.textContent = oldText;
        btn.disabled = false;
        
        if(data.status === 'success') {
            showToast("Cập nhật thông tin thành công!", "success");
            localStorage.setItem('user_info_sql', JSON.stringify(data.user));
            if(data.user.class_name) document.getElementById('display-class').textContent = data.user.class_name;
        } else {
            showToast("Lỗi: " + data.message, "error");
        }
    })
    .catch(err => {
        btn.textContent = oldText;
        btn.disabled = false;
        console.error(err);
        showToast("Lỗi kết nối Server!", "error");
    });
});

// 4. XỬ LÝ UPLOAD ẢNH (Có hiệu ứng Loading)
const avatarInput = document.getElementById('avatar-upload');
if (avatarInput) {
    avatarInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            
            // Check dung lượng > 5MB
            if (file.size > 5 * 1024 * 1024) {
                showToast("Ảnh quá lớn! Vui lòng chọn dưới 5MB", "error");
                return;
            }

            const userStr = localStorage.getItem('user_info_sql');
            if (!userStr) return;
            const user = JSON.parse(userStr);

            const formData = new FormData();
            formData.append('avatar', file);
            formData.append('username', user.username);

            // HIỆN LOADING
            const loader = document.getElementById('avatar-loader');
            loader.style.display = 'flex';

            fetch('../api/upload_avatar.php', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                // ẨN LOADING
                loader.style.display = 'none';

                if (data.status === 'success') {
                    document.getElementById('p-avatar').src = data.avatar_url;
                    localStorage.setItem('user_info_sql', JSON.stringify(data.user));
                    showToast("Đổi ảnh đại diện thành công!", "success");
                } else {
                    showToast("Lỗi: " + data.message, "error");
                }
            })
            .catch(err => {
                loader.style.display = 'none';
                console.error(err);
                showToast("Lỗi tải ảnh!", "error");
            });
        }
    });
}

// 5. HÀM HIỂN THỊ THÔNG BÁO TOAST
function showToast(message, type = "success") {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = type === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-exclamation-circle"></i>';
    
    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    // Tự xóa sau 3 giây
    setTimeout(() => {
        toast.remove();
    }, 3000);
}