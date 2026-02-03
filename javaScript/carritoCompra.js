//DOMContentLoaded, se usa para que esto arranque cuando el html haya cargado totalmente.
const contenedor = document.querySelector('#accordionExample');
const contenedorVestimenta = document.querySelector('.mainVesti');
let productosArray = [];

document.addEventListener('DOMContentLoaded', function () {
    eventListeners();
});

function eventListeners() {
    // pag. suplementos
    if (contenedor) {
        contenedor.addEventListener('click', capturarProductos);
    };

    //pag. carrito
    const contenedorCarrito = document.querySelector('#contenedorCarrito')
    if (contenedorCarrito) {
        mostrarCarrito();
    };
    // pag.Vestimenta
    if (contenedorVestimenta) {
        contenedorVestimenta.addEventListener('click', capturarVestimenta);
    };
};

function capturarProductos(e) {
    if (e.target.classList.contains('botonSupJs')) {
        const elementosHtml = e.target.parentElement.parentElement;
        seleccionarDatos(elementosHtml);
    };
};

function capturarVestimenta(e) {
    if (e.target.classList.contains('botonVestiJs')) {
        const card = e.target.closest('.cardVesti');
        seleccionarDatosVestimenta(card, e.target);
    };
};

function seleccionarDatos(productos) {
    const saborSeleccionado = productos.querySelector(
        'input[type="radio"]:checked'
    );

    const producto = {
        img: productos.querySelector('img').src,
        titulo: productos.querySelector('h4').textContent,
        precio: parseFloat(productos.querySelector('h3').textContent.replace('$', '').replace('.', '')),
        marca: productos.querySelector('h6').textContent,
        //condicion ? valorTrue : valorFalse (TERNARIO)
        sabor: saborSeleccionado ? saborSeleccionado.value : 'Sin seleccionar',
        id: parseInt(productos.querySelector('button[type="button"]').dataset.id, 10),
        cantidad: 1
    };
    guardarEnCarrito(producto);
};

function seleccionarDatosVestimenta(card, boton) {
    const talle = card.querySelector('input[name^="talle"]:checked');
    const color = card.querySelector('input[name^="color"]:checked');

    //si o si eligan talle
    if (!talle) {
        mostrarToast('Seleccioná un talle 👕', 'danger');
        return;
    }

    const producto = {
        img: card.querySelector('.imag').src,
        titulo: card.querySelector('.card-title-vesti').textContent,
        marca: '- Marca: NA',
        precio: parseFloat(
            card.querySelector('.precios-vesti').textContent
                .replace('$', '')
                .replace('.', '')
        ),
        detalles: [
            `Talle: ${talle.value}`,
            color ? `Color: ${color.value}` : null
        ].filter(linea => linea).join('\n'),
        id: parseInt(boton.dataset.id),
        cantidad: 1
    };
    guardarEnCarrito(producto);

};


// guardar en localstorage
function guardarEnCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const key = producto.sabor || producto.detalles || '';

    const existe = carrito.find(
        p => p.id === producto.id && (p.sabor || p.detalles) === key
    );

    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push(producto);
        mostrarToast('Producto agregado al carrito 🛒');
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
};

function mostrarResumenCompra() {
    const listaResumen = document.querySelector('#listaResumen');
    const totalCompra = document.querySelector('#totalCompra');

    if (!listaResumen || !totalCompra) return;

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    listaResumen.innerHTML = '';

    let total = 0;

    carrito.forEach(producto => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');

        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;

        li.textContent = `- ${producto.titulo} | Sabor: ${producto.sabor} | Cantidad: ${producto.cantidad} | Subtotal: $${subtotal.toLocaleString('es-AR')}`;
        listaResumen.appendChild(li);
    });

    totalCompra.textContent = `$${total.toLocaleString('es-AR')}`;
};


//mostrar carrito
function mostrarCarrito() {
    const contenedorCarrito = document.querySelector('#contenedorCarrito');
    if (!contenedorCarrito) return;

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    contenedorCarrito.innerHTML = '';

    carrito.forEach(producto => {
        const div = document.createElement('div');
        div.classList.add('col-md-4', 'mb-4', 'tamañoCard');

        div.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${producto.img}" class="card-img-top">
                <div class="card-body bodyCarrito">
                    <h5 class="card-title tituloCarrito">${producto.titulo}</h5>
                    <p class="card-text caracteProd">${producto.marca}</p>
                    ${producto.sabor ? `<p class="caracteProd"> Sabor: ${producto.sabor}</p>` : ''}
                    ${producto.detalles
                         ? producto.detalles.split('\n')
                        .map(linea => `<p class="caracteProd">${linea}</p>`)
                        .join('')
                    : ''}
                    <p class="fw-bold caracteProd"> Precio: $${producto.precio.toLocaleString('es-AR')}</p>
                    <div class="d-flex align-items-center gap-2 my-2">
                        <button class="btn btn-outline-secondary btn-sm btn-restar" type="button"
                            data-id="${producto.id}" data-key="${producto.sabor || producto.detalles}">−</button>
                        <span class="fw-bold">${producto.cantidad}</span>
                        <button class="btn btn-outline-secondary btn-sm btn-sumar" type="button"
                            data-id="${producto.id}" data-key="${producto.sabor || producto.detalles}">+</button>
                    </div>
                    <button class="btn btn-danger btn-sm btnEliminarProduc"  
                        data-id="${producto.id}"
                        data-key="${producto.sabor || producto.detalles}">
                        Eliminar
                    </button>
                </div>
            </div>
            `;
        contenedorCarrito.appendChild(div);
    });
    mostrarResumenCompra();
};

function eliminarProducto(id, info) {
    id = parseInt(id);
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    carrito = carrito.filter(
        producto => {
            const key = producto.sabor || producto.detalles || '';
            return !(producto.id === id && key === info);
        }
    );
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
    mostrarResumenCompra();
    mostrarToast('Producto eliminado ❌', 'danger');
};


//vaciar carrito
document.addEventListener('click', e => {
    if (e.target.id === 'vaciarCarrito') {
        localStorage.removeItem('carrito');
        mostrarCarrito();
        mostrarResumenCompra();
    };
});

//enviar todo por whatsapp
document.addEventListener('click', e => {
    if (e.target.id === 'enviarWhatsapp') {
        enviarProductoWhatsapp();
    };
});

document.addEventListener('click', e => {
    if (e.target.classList.contains('btnEliminarProduc')) {
        const id = parseInt(e.target.dataset.id);
        const key = e.target.dataset.key;
        eliminarProducto(id, key);
    }
});

function enviarProductoWhatsapp() {
    const numeroWhatsApp = '5493518104131';

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) return;
    let mensaje = '* NA | NUEVA COMPRA*\n\n';
    let total = 0;

    carrito.forEach((p, i) => {
        const subtotal = p.precio * p.cantidad;
        total += subtotal;

        let infoProducto = '';
        if (p.sabor) {
            infoProducto = `Sabor: ${p.sabor}`;
        } else if (p.detalles) {
            const detalleLimpio = p.detalles
                .split('\n')
                .map(linea => linea.trim()) //quita estacios innecesarios
                .filter(linea => linea) // elimina lineas vacias
                .join('\n'); //une con salto de linea
            infoProducto = detalleLimpio;
        }


        mensaje += `${i + 1} - ${p.titulo}
            ${p.marca.trim()}
            ${infoProducto ? infoProducto + '\n' : ''}
            Precio: $${p.precio}
            Cantidad: ${p.cantidad}
            Subtotal: $${subtotal.toLocaleString('es-AR')}\n\n
        `;
    });

    mensaje += `*TOTAL: $${total.toLocaleString('es-AR')}*`;


    const mensajeCodificado = encodeURIComponent(mensaje);
    const urlWhatsapp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensajeCodificado}`;
    window.open(urlWhatsapp, '_blank');
};

// sumar y restar la cantidad
document.addEventListener('click', e => {
    if (e.target.classList.contains('btn-sumar')) {
        modificarCantidad(parseInt(e.target.dataset.id), e.target.dataset.key, 1);
    };

    if (e.target.classList.contains('btn-restar')) {
        modificarCantidad(parseInt(e.target.dataset.id), e.target.dataset.key, -1);
    };
});

function modificarCantidad(id, key, cambio) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    carrito = carrito.map(producto => {
        const productKey = producto.sabor || producto.detalles || '';
        if (producto.id == id && productKey === key) {
            producto.cantidad += cambio;
            if (producto.cantidad < 1) producto.cantidad = 1;
        };
        return producto;
    });

    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
    mostrarResumenCompra();
};

function mostrarToast(mensaje, tipo = 'success') {
    const toastEl = document.getElementById('toastCarrito');
    const toastMsg = document.getElementById('toastMensaje');

    if (!toastEl || !toastMsg) return;

    toastEl.className = `toast align-items-center diseñoToast ${tipo} border-0`;
    toastMsg.textContent = mensaje;

    const toast = new bootstrap.Toast(toastEl, { delay: 2000 });
    toast.show();
}

