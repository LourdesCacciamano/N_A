// ============================================================
// MENÚ / LOGOUT - sin dependencia de Firebase
// ============================================================
// Este archivo reemplaza a login.js en todas las páginas EXCEPTO
// index.html (que es la única que tiene el formulario de login
// real y necesita Firebase). Acá solo se lee localStorage para
// mostrar/ocultar el menú y cerrar sesión - no hace falta
// descargar el SDK de Firebase para esto.
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    const dni = localStorage.getItem("dni");

    const menuMiPlan = document.getElementById("menuMiPlan");
    const menuCuota = document.getElementById("menuCuota");
    const btnLogin = document.getElementById("btnLogin");
    const btnLogout = document.getElementById("btnLogout");

    if (dni) {
        // usuario logueado
        if (menuMiPlan) menuMiPlan.style.display = "block";
        if (menuCuota) menuCuota.style.display = "block";
        if (btnLogin) btnLogin.style.display = "none";
        if (btnLogout) btnLogout.style.display = "block";
    } else {
        // usuario NO logueado
        if (menuMiPlan) menuMiPlan.style.display = "none";
        if (menuCuota) menuCuota.style.display = "none";
        if (btnLogin) btnLogin.style.display = "block";
        if (btnLogout) btnLogout.style.display = "none";
    }

    if (btnLogout) {
        btnLogout.addEventListener("click", (e) => {
            e.preventDefault();

            Swal.fire({
                title: "¿Cerrar sesión?",
                text: "Vas a salir de tu cuenta",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, salir",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem("dni");
                    localStorage.removeItem("usuarioLogueado");
                    window.location.href = "../index.html";
                }
            });
        });
    }
});