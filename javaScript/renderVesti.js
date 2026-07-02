// ============================================================
// RENDERIZADO AUTOMÁTICO DE CARDS - vestimentaNA.html
// ============================================================
// Genera las cards a partir de PRODUCTOS_VESTI (productosVestimentaData.js)
// Requiere un contenedor vacío con la clase .conteCards-vesti en el HTML.
// ============================================================

function fmtPrecio(n) {
    return '$' + n.toLocaleString('es-AR');
}

function crearCarruselHTML(producto) {
    const carouselId = `carouselVesti-${producto.id}`;

    const slides = producto.imgs.map((img, i) => `
        <div class="carousel-item ${i === 0 ? 'active' : ''}">
            <a href="${img}">
                <img src="${img}" class="d-block w-100 imag carouselVestiImg" alt="${producto.titulo}">
            </a>
        </div>
    `).join('');

    const controles = producto.imgs.length > 1 ? `
        <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
            <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
            <span class="carousel-control-next-icon"></span>
        </button>
    ` : '';

    return `
        <div id="${carouselId}" class="carousel slide">
            <div class="carousel-inner">${slides}</div>
            ${controles}
        </div>
    `;
}

function crearCardVestiHTML(producto) {
    return `
        <div class="card cardVesti">
            ${crearCarruselHTML(producto)}
            <div class="card-body cardBodyVest">
                <h5 class="card-title-vesti">${producto.titulo}</h5>
                <h5 class="precios-vesti">${fmtPrecio(producto.precio)}</h5>
                <a href="detalleVesti.html?id=${producto.id}" class="btnVerMas">Ver producto</a>
            </div>
        </div>
    `;
}

function renderizarVestimenta() {
    const contenedor = document.querySelector('.conteCards-vesti');
    if (!contenedor) return;
    contenedor.innerHTML = PRODUCTOS_VESTI.map(crearCardVestiHTML).join('');
}

document.addEventListener('DOMContentLoaded', renderizarVestimenta);