//DOMContentLoaded, se usa para que esto arranque cuando el html haya cargado totalmente.
const contenedor = document.querySelector('#accordionExample');
const contenedorVestimenta = document.querySelector('.mainVesti');
let productosArray = [];

document.addEventListener('DOMContentLoaded', function () {
    eventListeners();
    actualizarContadoresCard();
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
    /*if (e.target.classList.contains('botonSupJs')) {
        const elementosHtml = e.target.closest('.card');
        seleccionarDatos(elementosHtml);
    };*/

    const boton = e.target.closest('.botonSupJs');

    if (boton) {
        const card = boton.closest('.card');
        seleccionarDatos(card, boton);
    }
};

function capturarVestimenta(e) {
    const boton = e.target.closest('.botonVestiJs');

    if (boton) {
        const card = boton.closest('.cardVesti');
        seleccionarDatosVestimenta(card, boton);
    }
};

function seleccionarDatos(productos, boton) {
    const select = productos.querySelector('select[name="suple"]');
    if (!select || !select.value) {
        mostrarToast('Seleccioná un Sabor', 'warning');
        return;
    }

    const producto = {
        img: productos.querySelector('img').src,
        titulo: productos.querySelector('h4').textContent,
        precio: parseFloat(productos.querySelector('h3').textContent.replace('$', '').replace('.', '')),
        marca: productos.querySelector('h6').textContent,
        //condicion ? valorTrue : valorFalse (TERNARIO)
        sabor: select && select.value ? select.value : 'Sin seleccionar',
        id: parseInt(boton.dataset.id, 10),
        cantidad: parseInt(productos.querySelector('.cantidad-card').textContent)
    };
    guardarEnCarrito(producto);
};

function seleccionarDatosVestimenta(card, boton) {
    const talle = card.querySelector('input[name^="talle"]:checked');
    const color = card.querySelector('input[name^="color"]:checked');

    //si o si eligan talle
    if (!talle) {
        mostrarToast('Seleccioná un talle 👕', 'warning');
        return;
    }
    //hacer lo mismo con color

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
        cantidad: parseInt(card.querySelector('.cantidad-card').textContent)
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
        mostrarToast('Producto agregado al carrito 🛒', 'success');
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();

    actualizarContadoresCard();

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

        let infoProducto = '';

        if (producto.sabor) {
            infoProducto = `Sabor: ${producto.sabor}`;
        } else if (producto.detalles) {
            infoProducto = producto.detalles.replace(/\n/g, ' | ');
        }

        li.textContent = `- ${producto.titulo} | ${infoProducto} | Cantidad: ${producto.cantidad} | Subtotal: $${subtotal.toLocaleString('es-AR')}`;
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
                    <p class="caracteProd" >Cantidad: ${producto.cantidad}</p>
                    <p class="fw-bold caracteProd"> Precio: $${producto.precio.toLocaleString('es-AR')}</p>
                    <button class="btn btn-danger btn-sm btnEliminarProduc"  
                        data-id="${producto.id}"
                        data-key="${producto.sabor || producto.detalles || ''}">
                        <i class="fa-regular fa-trash-can iconoBorrar" style="color: rgb(255, 255, 255);"></i>
                    </button>
                </div>
            </div>
            `;
        contenedorCarrito.appendChild(div);
    });
    mostrarResumenCompra();
    actualizarContadoresCard();
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

    actualizarContadoresCard();
};


//vaciar carrito
document.addEventListener('click', e => {
    const botonVaciar = e.target.closest('#vaciarCarrito');

    if (botonVaciar) {
        localStorage.removeItem('carrito');
        mostrarCarrito();
        mostrarResumenCompra();
        mostrarToast('Carrito vaciado 🗑️', 'danger');
    }
});

//enviar todo por whatsapp
document.addEventListener('click', e => {
    if (e.target.id === 'enviarWhatsapp') {
        enviarProductoWhatsapp();
    };
});

//btn eliminar producto indiv
document.addEventListener('click', e => {
    const botonEliminar = e.target.closest('.btnEliminarProduc');

    if (botonEliminar) {
        const id = parseInt(botonEliminar.dataset.id);
        const key = botonEliminar.dataset.key;
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

function mostrarToast(mensaje, tipo = 'success') {
    const toastEl = document.getElementById('toastCarrito');
    const toastMsg = document.getElementById('toastMensaje');

    if (!toastEl || !toastMsg) return;

    toastEl.className = `toast align-items-center diseñoToast text-bg-${tipo} border-0`;
    toastMsg.textContent = mensaje;

    const toast = new bootstrap.Toast(toastEl, { delay: 2000 });
    toast.show();
}

function actualizarContadoresCard() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const contadores = document.querySelectorAll('.contador-card');

    contadores.forEach(contador => {
        const id = parseInt(contador.dataset.id);
        const cantidadSpan = contador.querySelector('.cantidad-card');

        const total = carrito
            .filter(p => p.id === id)
            .reduce((acc, p) => acc + p.cantidad, 0);

        if (total > 0) {
            cantidadSpan.textContent = total;
            contador.style.display = 'flex';
        } else {
            contador.style.display = 'none';
        }

        /* const productos = carrito.filter(p => p.id === id);
 
         let total = 0;
         productos.forEach(p => {
             total += p.cantidad;
         });
 
         cantidadSpan.textContent = total;
 
         if(total === 0) {
             contador.style.display = 'none';
         } else {
             contador.style.display = 'flex';
         }*/
    });
}

function modificarCantidadesCard(id, cambio) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    carrito = carrito.map(producto => {
        if (producto.id === id) {
            producto.cantidad += cambio;
            if (producto.cantidad < 1) producto.cantidad = 1;
        }
        return producto;
    });

    localStorage.setItem('carrito', JSON.stringify(carrito));

    actualizarContadoresCard();
    mostrarCarrito();
    mostrarResumenCompra();
}

// sumar y restar la cantidad
document.addEventListener('click', e => {
    if (e.target.classList.contains('btn-sumar-card')) {
        const card = e.target.closest('.contador-card');
        const spanCantidad = card.querySelector('.cantidad-card');
        let cantidad = parseInt(spanCantidad.textContent);
        cantidad++;
        spanCantidad.textContent = cantidad;
    };

    if (e.target.classList.contains('btn-restar-card')) {
        const card = e.target.closest('.contador-card');
        const spanCantidad = card.querySelector('.cantidad-card');
        let cantidad = parseInt(spanCantidad.textContent);
        if (cantidad > 1) {
            cantidad--;
            spanCantidad.textContent = cantidad;
        }
    };
});



/*<div class="d-flex align-items-center gap-2 my-2">
                        <button class="btn btn-outline-secondary btn-sm btn-restar" type="button"
                            data-id="${producto.id}" data-key="${producto.sabor || producto.detalles}">−</button>
                        <span class="fw-bold">${producto.cantidad}</span>
                        <button class="btn btn-outline-secondary btn-sm btn-sumar" type="button"
                            data-id="${producto.id}" data-key="${producto.sabor || producto.detalles}">+</button>
                    </div>





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

*/