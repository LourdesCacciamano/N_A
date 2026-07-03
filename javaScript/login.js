// ============================================================
// LOGIN - requiere Firebase
// ============================================================
// Este archivo va SOLO en index.html (la única página con el
// formulario de login real, #dniInput). El resto de las páginas
// usan menuAuth.js en su lugar, que no necesita Firebase.
// ============================================================

import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCpuRMkYLZOPTBm77KqTmEx94ZPgU3iQPE",
    authDomain: "asesoramiento-na.firebaseapp.com",
    projectId: "asesoramiento-na",
    storageBucket: "asesoramiento-na.firebasestorage.app",
    messagingSenderId: "774206761497",
    appId: "1:774206761497:web:042ed21a39fcee75329888",
    measurementId: "G-EJMVKDR61V"
};

import { getApp, getApps, initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

let app;

if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}
const auth = getAuth(app);
const db = getFirestore(app);

window.loginUsuario = async function () {
    const dni = document.getElementById("dniInput").value.trim();

    if (!dni) return;

    await signInAnonymously(auth);

    // 🔥 esperar a que auth esté listo de verdad
    await new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                unsubscribe();
                resolve();
            }
        });
    });

    const docRef = doc(db, "usuarios", dni);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

        const toastOk = new bootstrap.Toast(document.getElementById('toastSuccess'));
        document.querySelector('#toastSuccess .toast-body').innerText = "Bienvenido 👋";
        toastOk.show();

        localStorage.setItem("usuarioLogueado", "true");
        localStorage.setItem("dni", dni);

        setTimeout(() => {
            location.reload();
        }, 1200);

    } else {

        const toastError = new bootstrap.Toast(document.getElementById('toastError'));
        toastError.show();
    }
}