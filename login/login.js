// File: login/login.js

// Import kết nối từ file config ở thư mục gốc
import { auth, db } from "../firebase-config.js";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    doc, setDoc, getDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    // 1. HIỆU ỨNG TRƯỢT (SLIDER)
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');

    if(signUpButton && signInButton) {
        signUpButton.addEventListener('click', () => container.classList.add("right-panel-active"));
        signInButton.addEventListener('click', () => container.classList.remove("right-panel-active"));
    }

    // 2. XỬ LÝ ĐĂNG KÝ
    const btnRegister = document.getElementById('btn-register');
    if (btnRegister) {
        btnRegister.addEventListener('click', async (e) => {
            e.preventDefault(); // Chặn load lại trang
            
            const name = document.getElementById('reg-name').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const pass = document.getElementById('reg-pass').value.trim();

            if (!name || !email || !pass) {
                alert("Vui lòng điền đầy đủ thông tin!");
                return;
            }

            try {
                // A. Tạo tài khoản Authentication
                const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
                const user = userCredential.user;

                // B. Lưu thông tin chi tiết vào Firestore (Bảng 'users')
                await setDoc(doc(db, "users", user.uid), {
                    username: name,
                    email: email,
                    score: 0, // Điểm khởi đầu
                    title: "Tân Binh",
                    avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                    createdAt: new Date()
                });

                alert("Đăng ký thành công! Vui lòng đăng nhập.");
                container.classList.remove("right-panel-active"); // Quay về tab đăng nhập
                
                // Điền sẵn email cho tiện
                document.getElementById('login-name').value = email;
                
            } catch (error) {
                let msg = error.message;
                if(error.code === 'auth/email-already-in-use') msg = "Email này đã được sử dụng!";
                if(error.code === 'auth/weak-password') msg = "Mật khẩu phải trên 6 ký tự!";
                alert("Lỗi: " + msg);
            }
        });
    }

    // 3. XỬ LÝ ĐĂNG NHẬP
    const btnLogin = document.getElementById('btn-login');
    if (btnLogin) {
        btnLogin.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-name').value.trim(); // Nhập Email vào ô này
            const pass = document.getElementById('login-pass').value.trim();

            if (!email || !pass) {
                alert("Vui lòng nhập Email và Mật khẩu!");
                return;
            }

            try {
                // Đăng nhập Auth
                const userCredential = await signInWithEmailAndPassword(auth, email, pass);
                const user = userCredential.user;

                // Lấy thông tin từ Database
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    
                    // Lưu thông tin vào LocalStorage để dùng nhanh ở các trang khác
                    const userInfo = {
                        uid: user.uid,
                        username: userData.username,
                        avatar: userData.avatar,
                        score: userData.score
                    };
                    localStorage.setItem('user_info_sql', JSON.stringify(userInfo));

                    alert(`Xin chào ${userData.username}!`);
                    window.location.href = "../game/hub.html"; // Chuyển sang trang Game
                } else {
                    alert("Lỗi: Không tìm thấy dữ liệu người dùng!");
                }

            } catch (error) {
                console.error(error);
                alert("Đăng nhập thất bại! Kiểm tra lại Email/Mật khẩu.");
            }
        });
    }
});
