// Los elementos con clase "reveal" arrancan invisibles y corridos hacia
// abajo; al entrar en pantalla mientras se scrollea, se les agrega
// "reveal-visible" y el CSS los hace aparecer subiendo.

function iniciarScrollReveal() {
    const elementos = document.querySelectorAll(".reveal");
    if (!elementos.length) return;

    const prefiereMenosMovimiento = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefiereMenosMovimiento) {
        elementos.forEach((el) => el.classList.add("reveal-visible"));
        return;
    }

    const observador = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("reveal-visible");
                    observador.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    elementos.forEach((el) => observador.observe(el));
}

document.addEventListener("DOMContentLoaded", iniciarScrollReveal);
