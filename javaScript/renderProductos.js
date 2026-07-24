// ============================================================
// RENDERIZADO AUTOMÁTICO DE CARDS - suplementos.html
// ============================================================
// Genera las cards de cada categoría a partir de PRODUCTOS_NA
// (definido en productos-data.js). Para agregar, sacar o editar
// un producto del listado, se edita SOLO productos-data.js.
//
// Requiere que estos contenedores existan en el HTML (vacíos):
//   .conteTiposProte   -> productos con categoria "Proteínas"
//   .conteTiposCrea    -> productos con categoria "Creatinas"
//   .conteTiposOtros   -> productos con categoria "Otros"
// ============================================================

function crearCardHTML(producto) {
    const tieneDescuento = producto.precioViejo && producto.precioViejo > producto.precio;

    return `
        <div class="cardSuple">
            <img src="${producto.img}" class="card-img-top cardImgSuple" alt="${producto.titulo}">
            <div class="card-body">
                <h4 class="card-title titleSuple">${producto.titulo}</h4>
                <h3 class="precioSuple">
                    ${tieneDescuento ? `<span class="precioTachado">${fmtPrecio(producto.precioViejo)}</span> ` : ''}${fmtPrecio(producto.precio)}
                </h3>
                <a href="detalleProductos.html?id=${producto.id}" class="btnVerMas">Ver producto</a>
            </div>
        </div>
    `;
}

function renderizarCategoria(categoria, selectorContenedor) {
    const contenedor = document.querySelector(selectorContenedor);
    if (!contenedor) return;

    const productos = PRODUCTOS_NA.filter(p => p.categoria === categoria);
    contenedor.innerHTML = productos.map(crearCardHTML).join('');
}

function renderizarTodasLasCards() {
    renderizarCategoria('Proteínas', '.conteTiposProte');
    renderizarCategoria('Creatinas', '.conteTiposCrea');
    renderizarCategoria('Otros', '.conteTiposOtros');
    renderizarCategoria('Combos', '.conteTiposCombos');
}

document.addEventListener('DOMContentLoaded', renderizarTodasLasCards);