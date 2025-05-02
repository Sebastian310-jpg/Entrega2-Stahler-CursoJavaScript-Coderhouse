const productosSupermercado = [
    {
        id: 1,
        emoji: "🍞",
        nombre: "Pan",
        precio: 1.5,
        stock: 20,
        categoria: "Panadería"
    },
    {
        id: 2,
        emoji: "🥩",
        nombre: "Carne",
        precio: 10.99,
        stock: 12,
        categoria: "Carnicería"
    },
    {
        id: 3,
        emoji: "🥛",
        nombre: "Leche",
        precio: 0.99,
        stock: 30,
        categoria: "Lácteos"
    },
    {
        id: 4,
        emoji: "🍎",
        nombre: "Manzana",
        precio: 0.5,
        stock: 50,
        categoria: "Frutas"
    },
    {
        id: 5,
        emoji: "🍗",
        nombre: "Pollo",
        precio: 7.5,
        stock: 15,
        categoria: "Carnicería"
    },
    {
        id: 6,
        emoji: "🥔",
        nombre: "Papa",
        precio: 0.6,
        stock: 40,
        categoria: "Verduras"
    },
    {
        id: 7,
        emoji: "🍝",
        nombre: "Pasta",
        precio: 1.2,
        stock: 25,
        categoria: "Despensa"
    },
    {
        id: 8,
        emoji: "🧀",
        nombre: "Queso",
        precio: 2.75,
        stock: 10,
        categoria: "Lácteos"
    },
    {
        id: 9,
        emoji: "🥫",
        nombre: "Atún",
        precio: 1.8,
        stock: 18,
        categoria: "Conservas"
    },
    {
        id: 10,
        emoji: "🍺",
        nombre: "Cerveza",
        precio: 4.99,
        stock: 22,
        categoria: "Bebidas"
    }
];

/* ----------------- AGREGAR PRODUCTOS A LA TIENDA ---------------------- */
const contenedorProductos = document.getElementById("contenedor-productos");

const refrescarTienda = () => {
    mostrarLista();
    actualizarBotones();
}

const mostrarLista = () => {
    let productosElementos = "";

    productosSupermercado.forEach((producto) => {
        if (producto.stock > 0){
            productosElementos += `
                <div class="tarjeta-producto" id="producto-${producto.id}">
                    <h3>${producto.emoji} ${producto.nombre}</h3>
                    <p>Precio: $${producto.precio.toFixed(2)}</p>
                    <p>Stock: ${producto.stock}</p>
                    <input type="number" placeholder="Cantidad" class="inputs-cantidad" id="input-${producto.id}">
                    <button class="btn-agregar">Agregar al Carrito</button>
                </div>
            `;
        }
    });

    contenedorProductos.innerHTML = productosElementos;
}

/* ----------------- MOSTRAR EL CARRITO ---------------------- */
const carritoContenido = document.getElementById("carrito-contenido");

const carrito = [];
const carritoGuardado = JSON.parse(localStorage.getItem("carrito"));

const agregarAlCarrito = () => {
    let carritoElementos = "";

    carrito.forEach((producto) => {
        carritoElementos += `
            <p>${producto.emoji} ${producto.nombre} | Cantidad: ${producto.cantidad} | Precio: $${(producto.cantidad * producto.precio).toFixed(2)}</p>
        `;
    });

    carritoContenido.innerHTML = carritoElementos;

    if (carrito.length === 0) {
        carritoContenido.innerHTML = "<p>El carrito está vacío.</p>";
    } else {
        let total = carrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    
        let elementoTotal = `<h3 class="total">Total: $${total.toFixed(2)}</h3>`;
        carritoContenido.innerHTML += elementoTotal;
    }


    localStorage.setItem("carrito", JSON.stringify(carrito));
}

if (carritoGuardado) {
    carrito.push(...carritoGuardado);

    carritoGuardado.forEach((producto) => {
        const productoEnStock = productosSupermercado.find((prod) => prod.id === producto.id);

        if (productoEnStock) {
            productoEnStock.stock -= producto.cantidad;
        }
    });

    agregarAlCarrito();
}

mostrarLista();

/* ----------------- AGREGAR PRODUCTOS AL CARRITO ---------------------- */
const actualizarBotones = () => {
    const botonesAgregar = document.querySelectorAll(".btn-agregar");
    const inputsCantidad = document.querySelectorAll(".inputs-cantidad");

    botonesAgregar.forEach((boton) => {
        boton.addEventListener("click", () => {
            const productoId = Number(boton.parentElement.id.split("-")[1]);

            let cantidad = 0;

            inputsCantidad.forEach((input) => {
                const inputId = Number(input.getAttribute("id").split("-")[1]);

                if (inputId === productoId){
                    cantidad = input.value;
                }
            });
            
            productosSupermercado.forEach((producto) => {
                if (producto.id === productoId) {
                    if (cantidad <= producto.stock) {
                        comprobarSiEstaEnCarrito(producto, cantidad);
                    } else {
                        alert("No hay suficiente cantidad de ese producto.");
                    }
                }
            });
        });
    });
}

actualizarBotones();

const comprobarSiEstaEnCarrito = (producto, cantidad) => {
    const productoEnElCarrito = carrito.find((prod) => prod.id === producto.id);

    if (productoEnElCarrito) {
        productoEnElCarrito.cantidad += Number(cantidad);
        producto.stock -= cantidad;

        refrescarTienda();
        agregarAlCarrito();
    } else {
        if (cantidad > 0){
            const nuevoProducto = {
                ...producto,
                cantidad: Number(cantidad)
            }

            producto.stock -= cantidad;
    
            refrescarTienda();
            
            carrito.push(nuevoProducto);

            agregarAlCarrito();
        }
    }  
}

/* ----------------- VACIAR EL CARRITO ---------------------- */
const btnVaciarCarrito = document.getElementById("btn-vaciar-carrito");

btnVaciarCarrito.addEventListener("click", () => {
    carrito.length = 0;

    localStorage.removeItem("carrito");

    refrescarTienda();
    agregarAlCarrito();
});

/* ----------------- COMPRAR EL CARRITO ---------------------- */
const btnComprarCarrito = document.getElementById("btn-comprar");

btnComprarCarrito.addEventListener("click", () => {
    if (carrito.length === 0) {
        carritoContenido.innerHTML = `<p>Agrega productos antes de comprar.</p>`;
    } else {
        carrito.length = 0;
    
        localStorage.removeItem("carrito");
    
        refrescarTienda();
        agregarAlCarrito();
        
        carritoContenido.innerHTML = `<p>Gracias por tu Compra!</p>`;
    }
});