// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// --- QUAN TRỌNG: DÁN MÃ TỪ FIREBASE CONSOLE VÀO ĐÂY ---
// (Vào Firebase -> Project Settings -> Kéo xuống dưới copy config)
const firebaseConfig = {
    apiKey: "AIzaSyD...", // <--- Thay mã của bạn vào đây
    authDomain: "tramsactrithuc.firebaseapp.com",
    projectId: "tramsactrithuc",
    storageBucket: "tramsactrithuc.appspot.com",
    messagingSenderId: "123...",
    appId: "1:..."
};
// ------------------------------------------------------

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
