// CONTENEDOR DE LOS PRODUCTOS DONDE SE PUSHEAN
const containerProductos = document.querySelector("#productos");

// CONTENEDORES DE CATEGORÍAS
const contenedorProductosBurguers = document.querySelector('#contenedor-burguers');
const contenedorProductosBebidas = document.querySelector('#contenedor-bebidas');
const contenedorProductosFrito = document.querySelector('#contenedor-frito');

// Carrito
const carritoProductos = document.querySelector("#contenedor-productos");
const carritoVacio = document.querySelector("#carrito-vacio");

// BTN de los carritos
const btnEnviarPedido = document.querySelector("#btn-enviar-pedido");

// ARRAY DONDE SE ALMACENAN LOS PRODUCTOS QUE VAMOS AÑADIENDO AL CARRITO
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// CARGAR PRODUCTOS DESDE UN ARCHIVO JSON USANDO FETCH
const cargarProductos = async () => {
    try {
        const response = await fetch('productos.json'); 
        const data = await response.json();
        const { burguers, bebidas, frituras } = data;

        generarProductos(burguers, contenedorProductosBurguers);
        generarProductos(bebidas, contenedorProductosBebidas);
        generarProductos(frituras, contenedorProductosFrito);
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
};

// FUNCION PARA GENERAR PRODUCTOS DINÁMICAMENTE EN EL DOM
const generarProductos = (productos, contenedor) => {
    productos.forEach(({ id, nombre, descripcion, precio, imagen }) => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <div class="contenedor-producto">
                <img src="${imagen}" alt="${nombre}">
                <div class="detalles-productos">
                    <h4 class="nombre-producto">${nombre}</h4>
                    <p class="descripcion-producto">${descripcion || ''}</p>
                    <p class="precio-producto">${precio}</p>
                    <button class="carrito-add"><i class='bx bx-cart-add'></i></button>
                </div>
            </div>
        `;

        const button = div.querySelector(".carrito-add");
        button.addEventListener("click", () => agregarAlCarrito({ id, nombre, descripcion, precio, imagen }));

        contenedor.append(div);
    });
};

// AÑADIR EL ELEMENTO AL CARRITO Y MOSTRAR ALERTA
const agregarAlCarrito = ({ id, nombre, precio, imagen }) => {
    let productoEncarrito = carrito.find(item => item.id === id);

    if (productoEncarrito) {
        // Si ya está en el carrito, solo aumenta la cantidad
        productoEncarrito.cantidad++;
    } else {
        // Si no está, lo agrega con cantidad 1
        carrito.push({ id, nombre, precio, imagen, cantidad: 1 });
    }

    estadoCarrito();

    // Mostrar alerta al agregar un producto al carrito
    Swal.fire({
        icon: 'success',
        title: 'Producto agregado',
        text: `Has agregado ${nombre} al carrito.`,
        showConfirmButton: false,
        timer: 1000
    });
};

// CONTROL DEL ESTADO DEL CARRITO
const estadoCarrito = () => {
    if (carrito.length === 0) {
        carritoVacio.classList.remove("d-none");
        carritoProductos.classList.add("d-none");
        btnEnviarPedido.classList.add("d-none");
    } else {
        carritoVacio.classList.add("d-none");
        carritoProductos.classList.remove("d-none");
        btnEnviarPedido.classList.remove("d-none");

        // Limpiar el contenedor de productos en el carrito antes de añadir nuevos elmentos
        carritoProductos.innerHTML = "";

        carrito.forEach(({ id, imagen, nombre, precio, cantidad }) => {
            const div = document.createElement("div");
            div.classList.add("carrito-productos");
            div.innerHTML = `
                <div class="carrito-productos">       
                    <img src="${imagen}" alt="">
                    <h4 class="nombre-producto">${nombre}</h4>
                    <p class="precio-producto">${precio}</p>
                    <p class="cantidad-producto">${cantidad}</p>
                    <button class="btn-remove" data-id="${id}"><i class='bx bx-x'></i></button>
                </div>
            `;

            carritoProductos.append(div);
        });

        // Añadir eventos de eliminar después de generar el carrito
        document.querySelectorAll(".btn-remove").forEach(button => {
            button.addEventListener("click", (e) => {
                const idProducto = e.target.closest('.btn-remove').dataset.id;
                eliminarElementoDelCarrito(idProducto);
            });
        });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
};
estadoCarrito();

// ELIMINAR ELEMENTO DEL CARRITO
const eliminarElementoDelCarrito = (idProducto) => {
    carrito = carrito.filter(item => item.id !== idProducto);
    estadoCarrito();
    Swal.fire("Producto eliminado!");
};

// BOTÓN PARA ABRIR Y CERRAR EL MENÚ DEL CARRITO
document.addEventListener('DOMContentLoaded', () => {
    const btnCarrito = document.getElementById('btn-carrito');
    const btnClosed = document.getElementById('btn-closed');
    const menuToggle = document.getElementById('menu-carrito');

    btnCarrito.addEventListener('click', () => menuToggle.classList.toggle('active'));
    btnClosed.addEventListener('click', () => menuToggle.classList.toggle('active'));

    cargarProductos(); // Cargar productos desde JSON al iniciar
});

// FUNCIONALIDAD PARA EL BOTÓN DE ENVIAR PEDIDO
btnEnviarPedido.addEventListener('click', () => {
    if (carrito.length > 0) {
        Swal.fire({
            icon: 'success',
            title: 'Pedido enviado',
            text: 'El pedido fue enviado correctamente.',
            showConfirmButton: true
        }).then(() => {
            carrito = []; // Vaciar el carrito
            localStorage.removeItem("carrito"); // Remover carrito del localStorage
            estadoCarrito(); // Actualizar la vista del carrito
        });
    }
});
