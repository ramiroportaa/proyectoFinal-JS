//Funcion para Escribir por DOM el codigo html de los items en el sidebar del carrito.
//Tambien se incluye el evento de borrar producto del carrito.
const barraCarritoListaItems = document.getElementById("barraCarrito-listaItems");
function escribirProductosCarrito () {
    ordenes[ordenes.length-1].productosOrden.forEach((producto) =>{
        let contenedor = document.createElement("div");
        contenedor.className = "row mb-2 barraCarrito-item align-items-center";
        contenedor.innerHTML = `
        <div class="col-4">
        <img class="img-fluid rounded mx-auto d-block" src="img/product-${producto.idProducto}.jpg" alt="${producto.nombre}">
        </div>
        <div class="col-6">
        <p>${producto.nombre} x ${producto.cantidadCarrito}</p>
        <p>$${producto.precio}.-</p>
        </div>
        <button id="barraCarrito-borrarItem-${producto.idProducto}" class="btn col-2" type="button"><i class="fas fa-trash-alt"></i></button>
        `
        barraCarritoListaItems.appendChild(contenedor);
        //Almacenamos en constante el nodo de cada boton de borrar Item.
        const borrarProducto = document.getElementById(`barraCarrito-borrarItem-${producto.idProducto}`);
        //Añadimos manejador de evento click a dicho nodo.
        borrarProducto.addEventListener("click", () => {
            ordenes[ordenes.length-1].borrarProducto(producto);
        });
    })
    let contenedor = document.createElement("div");
    contenedor.className = "row h5";
    if (ordenes[ordenes.length-1].calcularTotal() == 0) {
        contenedor.innerHTML = `<p>El carrito está vacío</p>`
    }
    else{
        contenedor.innerHTML = `<p>TOTAL $${ordenes[ordenes.length-1].calcularTotal()}.-</p>`
    }
    barraCarritoListaItems.appendChild(contenedor);
}
//Sidebar del carrito.
const navCarrito = document.getElementById("nav-carrito");
//Escribo por DOM la cantidad de productos en el carrito.
navCarrito.innerHTML = `Carrito (${ordenes[ordenes.length-1].contadorProductosAgregados})`
//Mostramos la orden cada vez que hacemos click en el carrito...
navCarrito.addEventListener("click", () => {
    barraCarritoListaItems.innerHTML = "";
    escribirProductosCarrito();
    barraCarritoContainer.classList.toggle("barraCarrito-active");
})
//Evento para abrir y cerrar SideBar del carrito.
const barraCarritoContainer = document.getElementById("barraCarrito-container");
const barraCarrito = document.getElementById("barraCarrito");
const barraCarritoCerrar = document.getElementById("barraCarrito-cerrar");
barraCarritoCerrar.addEventListener("click", ()=>{
    barraCarritoContainer.classList.toggle("barraCarrito-active");
});
barraCarritoContainer.addEventListener("click", ()=>{
    barraCarritoContainer.classList.toggle("barraCarrito-active");
});
barraCarrito.addEventListener("click", (e)=>{
    e.stopPropagation();
});