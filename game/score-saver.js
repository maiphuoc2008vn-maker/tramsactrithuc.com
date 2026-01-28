import { db } from "../firebase-config.js";
import { doc, updateDoc, increment, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Hàm này sẽ được gọi từ các file game khác
window.saveScoreToFirebase = async function(points) {
    // 1. Lấy thông tin user đang đăng nhập
    const userStr = localStorage.getItem('user_info_sql');
    
    if (!userStr) {
        console.warn("Chưa đăng nhập, không lưu được điểm.");
        return; 
    }

    const user = JSON.parse(userStr);
    const userRef = doc(db, "users", user.uid);

    try {
        // 2. Kiểm tra xem user đã có trong database chưa
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
            // Nếu chưa có thì tạo mới
            await setDoc(userRef, {
                username: user.displayName || user.email,
                email: user.email,
                score: points,
                title: "Tân Binh",
                photoURL: user.photoURL || ""
            });
        } else {
            // 3. Nếu có rồi thì cộng dồn điểm (increment)
            await updateDoc(userRef, {
                score: increment(points)
            });
        }

        console.log(`Đã cộng ${points} điểm lên hệ thống!`);
        
        // 4. Kiểm tra thăng hạng sau khi cộng điểm
        const snap = await getDoc(userRef);
        const newScore = snap.data().score;
        let newTitle = "Tân Binh";
        
        if(newScore >= 1000) newTitle = "Tập Sự";
        if(newScore >= 5000) newTitle = "Cao Thủ";
        if(newScore >= 10000) newTitle = "Huyền Thoại";
        
        // Nếu danh hiệu thay đổi thì cập nhật
        if(snap.data().title !== newTitle) {
            await updateDoc(userRef, { title: newTitle });
            alert(`🎉 CHÚC MỪNG! Bạn đã thăng hạng: ${newTitle}`);
        }

    } catch (e) {
        console.error("Lỗi lưu điểm:", e);
    }
}
