document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los campos HTML
    const planInput = document.getElementById('planSeleccionado');
    const mostrarPlan = document.getElementById('mostrarPlanSeleccionado');

    // Lógica para capturar el plan desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const planParam = urlParams.get('plan');

    if (planParam) {
        // Formatea el plan (ej. 'AsesoramientoCompleto' -> 'Asesoramiento Completo')
        let planFormateado = planParam.replace(/([A-Z])/g, ' $1').trim();
        planInput.value = planFormateado;
        mostrarPlan.innerHTML = `Plan Solicitado: <strong>${planFormateado}</strong>`;
    } else {
        // Muestra 'No especificado' si no viene desde la página principal
        mostrarPlan.innerHTML = `Plan Solicitado: <strong>No especificado.</strong>`;
    }

    // --- FUNCIÓN QUE SE EJECUTA AL ENVIAR EL FORMULARIO ---
    document.getElementById('whatsappForm').addEventListener('submit', function (event) {
        // 1. Evita el envío tradicional del formulario
        event.preventDefault();

        // 2. Número de WhatsApp de destino (tu número)
        const numeroWhatsApp = '5493518104131'; // Se recomienda añadir el código de país '54' y el 9 si es celular.

        // 3. Captura las variables de contacto
        const nombre = document.getElementById('nombre').value || 'No proporcionado';
        const email = document.getElementById('email').value || 'No proporcionado';
        const plan = planInput.value;

        // 4. Función auxiliar para obtener el valor de un campo
        const getFieldValue = (name, type) => {
            if (type == 'radio') {
                const checkedRadio = document.querySelector(`input[name="${name}"]:checked`);
                return checkedRadio ? checkedRadio.value : 'Sin respuesta';
            }
            const field = document.querySelector(`[name="${name}"]`);
            return field ? field.value || 'Sin respuesta' : 'Campo no encontrado';
        };

        // 5. Objeto que almacena todas las respuestas
        const respuestas = {
            'Plan Seleccionado': plan,
            'Nombre del Cliente': nombre,
            'Email/Contacto': email,
            '1) Actividad física previa': getFieldValue('actividadFisica', 'radio'),
            '2) Nivel en gimnasio/entrenando': getFieldValue('nivel', 'radio'),
            '3) Razón de interes': getFieldValue('interes'),
            '4) Enfermedad patológica': getFieldValue('enfermedad', 'radio'),
            '4b) Cual enfermedad': getFieldValue('cualEnfermedad'),
            '5) Lesión (pasada/reciente)': getFieldValue('lesion', 'radio'),
            '6) Alimento no gustado/consumible': getFieldValue('alimento'),
            '7) Objetivo detallado': getFieldValue('objetivo'),
            '8a) Días a entrenar': getFieldValue('diasSemana'),
            '8b) Horas por sesión': getFieldValue('horasDia'),
            '9) Dificultad con ejercicio': getFieldValue('dificultad', 'radio'),
            '9b) Cual dificultad': getFieldValue('cualDificultad'),
            '10) Peso actual (Kg)': getFieldValue('peso'),
            '11) Altura actual (M)': getFieldValue('altura'),
            '12) Edad (Años)': getFieldValue('edad'),
            '13) Gym/Entrena en casa': getFieldValue('gym')
        };

        // 6. Construcción del mensaje de WhatsApp
        let mensajeWhatsapp = `*¡NUEVO FORMULARIO DE ASESORÍA!*

*DATOS DEL CLIENTE*
Plan Solicitado: *${respuestas['Plan Seleccionado']}*
Nombre: ${respuestas['Nombre del Cliente']}
Contacto: ${respuestas['Email/Contacto']}
-----------------------------------------
*RESPUESTAS AL FORMULARIO*
1) Act.Física Previa: ${respuestas['1) Actividad física previa']}
2) Nivel: ${respuestas['2) Nivel en gimnasio/entrenando']}
3) Interés por la Asesoria: ${respuestas['3) Razón de interes']}
4) Enfermedad: ${respuestas['4) Enfermedad patológica']}${respuestas['4b) Cual enfermedad'] !== 'Sin respuesta' ? ` (${respuestas['4b) Cual enfermedad']})` : ''}
5) Lesión: ${respuestas['5) Lesión (pasada/reciente)']}
6) Alimento no deseado: ${respuestas['6) Alimento no gustado/consumible']}
7) Objetivo: ${respuestas['7) Objetivo detallado']}
8) Días/Horas entrenamiento semanal: ${respuestas['8a) Días a entrenar']} días, ${respuestas['8b) Horas por sesión']} hs.
9) Dificultad en algun ejercicio: ${respuestas['9) Dificultad con ejercicio']}${respuestas['9b) Cual dificultad'] !== 'Sin respuesta' ? ` (${respuestas['9b) Cual dificultad']})` : ''}
10) Peso: ${respuestas['10) Peso actual (Kg)']} Kg
11) Altura: ${respuestas['11) Altura actual (M)']} M
12) Edad: ${respuestas['12) Edad (Años)']} años
13) Lugar de Entreno: ${respuestas['13) Gym/Entrena en casa']}`;

        // 7. Codifica el mensaje y crea el enlace
        const mensajeCodificado = encodeURIComponent(mensajeWhatsapp);
        const urlWhatsapp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensajeCodificado}`;
        
        // 8. Abre la nueva pestaña con WhatsApp
        window.open(urlWhatsapp, '_blank');
        
    }); // <--- Cierre de la función de submit (¡aquí estaba el error!)
    
}); // <--- Cierre de la función DOMContentLoaded