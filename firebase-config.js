// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// --- QUAN TRỌNG: DÁN MÃ TỪ FIREBASE CONSOLE VÀO ĐÂY ---
// (Vào Firebase -> Project Settings -> Kéo xuống dưới copy config)
const firebaseConfig = {
  apiKey: "AIzaSyBO4Z7X3t_lNiUOGl1A74mYlbfcamzxP-s",
  authDomain: "tram-sac-12a4-final.firebaseapp.com",
  projectId: "tram-sac-12a4-final",
  storageBucket: "tram-sac-12a4-final.firebasestorage.app",
  messagingSenderId: "81252342287",
  appId: "1:81252342287:web:475bc6898d58565f3ca17a"
};
// ------------------------------------------------------

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
