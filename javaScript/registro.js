window.addEventListener("DOMContentLoaded", () => {

    //iniciar emailJS 
    emailjs.init("GzCo-Bpl2dSrUjLIr");

    const form = document.getElementById('formRegistro');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const data = {
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            dni: document.getElementById('dni').value,
            email: document.getElementById('email').value,
        };

        emailjs.send("service_2dnwbtb", "template_o2qau7s", data)
            .then(() => {
                Swal.fire({
                    icon: "success",
                    title: "Solicitud enviada",
                    text: "Tu solicitud de cuenta fue enviado correctamente. Te avisameros en unos dias cuando ya puedas usar tu cuenta. ¡Gracias!",
                    confirmButtonText: "OK"
                });
                form.reset();
            })
            .catch((error) => {
                console.log(error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Hubo un problema al enviar la solicitud ❌",
                    confirmButtonText: "Intentar de nuevo"
                });

            });
    });



    function mostrarToast(mensaje, tipo = "success") {

        const toastEl = document.getElementById("miToast");
        const toastMensaje = document.getElementById("toastMensaje");

        toastMensaje.textContent = mensaje;

        // cambiar color según tipo
        toastEl.classList.remove("bg-success", "bg-danger");

        if (tipo === "error") {
            toastEl.classList.add("bg-danger");
        } else {
            toastEl.classList.add("bg-success");
        }

        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    }

    if (!data.nombre || !data.apellido || !data.dni || !data.email) {
        mostrarToast("Completá todos los campos ⚠️.", "error");
        return;
    }
})

