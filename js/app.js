// Creamos Clase Producto para facilitar la creacion de los productos a ofrecer.
class Producto {
    static contadorProductos = 0;
    constructor(nombre, grupo, precio, stock=0){
        this.idProducto = ++Producto.contadorProductos;
        this.nombre = nombre.toUpperCase();
        this.grupo = grupo;
        this.precio = parseFloat(precio);
        this.stock = parseInt(stock);
        this.cantidadCarrito = 0; //Cantidad del producto que se agrega al carrito en una orden. (esta propiedad se modifica con el metodo "agregarProducto" de la calse Orden).
    }
    aumentarStock (cantidad){
        this.stock += parseInt(cantidad);
    }
    disminuirStock (cantidad){
        this.stock -= parseInt(cantidad);
    }
    disponible (){
        return this.stock > 0 ? true : false;
    }
    actualizarPrecio (porcentaje){
        this.precio = this.precio + this.precio*porcentaje/100;
    }
    toString(){
        return `idProducto: ${this.idProducto}, nombre: ${this.nombre}, precio: $${this.precio}.- , cantidad: ${this.cantidadCarrito}`;
    }
}

//Creamos Clase Orden para facilitar la creacion de una orden cada vez que un cliente hace una.
class Orden {
    static contadorOrdenes = (JSON.parse(localStorage.getItem("id-OrdenJSON")) != null) ? JSON.parse(localStorage.getItem("id-OrdenJSON")) : 1; //Obtengo el valor de id de la ultima orden (y en caso de ser la primera asigno 1)
    constructor(){
        this.idOrden = Orden.contadorOrdenes++;
        this.productosOrden = []; //Array de Productos añadidos a la orden.
        this.contadorProductosAgregados = 0;
    }
    agregarProducto(producto, cantidad){
        if (isNaN(cantidad)){
            alert("Debe ingresar el NUMERO de cantidades que desea")
        }
        else if (producto.stock >= cantidad){
            //Si el producto ya esta agregado al carrito... Solo aumentamos la cantidad.
            if (this.productosOrden.some(prod => prod.idProducto == producto.idProducto)){
                let posicionProductoEnLaOrden = this.productosOrden.indexOf(producto);
                this.productosOrden[posicionProductoEnLaOrden].cantidadCarrito += cantidad;
            }
            //Si no, pusheamos el producto a la orden y luego cambiamos las cantidades.
            else{
                this.productosOrden.push(producto);
                this.productosOrden[this.productosOrden.length-1].cantidadCarrito += cantidad;
            }
            producto.disminuirStock(cantidad);
            this.contadorProductosAgregados += parseInt(cantidad);
        }
        else{
        console.log(`NO hay suficiente stock disponible. Quedan ${producto.stock} unidades`);
        }
    }
    borrarProducto (producto){
        let posicionProductoEnLaOrden = this.productosOrden.indexOf(producto);
        this.productosOrden.splice(posicionProductoEnLaOrden, 1);
        actualizarLocalStorage();
        location.reload();
    }
    calcularTotal(){
        let total = 0;
        for (let producto of this.productosOrden){
            total += producto.precio * producto.cantidadCarrito;
        }
        return total;
    }
    mostrarOrden(){ //Muestra de la orden por alert
        let productosOrden = "";
        for (let producto of this.productosOrden){
            productosOrden += "\n→ " + producto.toString();
        }
        alert(`Orden n°${this.idOrden} TOTAL: $${this.calcularTotal()}, Detalle: ${productosOrden}`);
    }
}

//Creamos un array para agrupar todos los productos que se ofrecen.
const productos = []

//Añadimos por metodo push los productos a ofrecer (a modo de ejemplo).
productos.push(new Producto("Air Force Goretex", "Zapatillas", 2800, 7));
productos.push(new Producto("Zapatillas Nike SB Dunk", "Zapatillas", 4500, 3));
productos.push(new Producto("Remera Levis azul", "Remeras", 1500, 2));
productos.push(new Producto("Camisa de fibrana MC", "Camisas", 2500, 3));
productos.push(new Producto("Remera VANS estampada", "Remeras", 1800));
productos.push(new Producto("Zapatillas Nike SB Dunk gris", "Zapatillas", 4500, 4));
productos.push(new Producto("Jogger Gabardina negro AM", "Pantalones", 2500, 2));
productos.push(new Producto("Zapatillas Nike SB Dunk Green Eyes", "Zapatillas", 4500, 1));
productos.push(new Producto("Remera VANS estampada", "Remeras", 1800,5));
productos.push(new Producto("Jean Deep Chupin con roturas", "Pantalones", 3000, 1));
productos.push(new Producto("Camisa de fibrana MC", "Camisas", 2500, 3));
productos.push(new Producto("Camisa de fibrana MC", "Camisas", 2500));

//Array de Ordenes
const ordenes = []

//RECUPERO LOS DATOS DEL LOCAL STORAGE AL CAMBIAR DE PAGINA O REFRESCAR PARA LUEGO ASIGNARLOS COMO OBJETO EN UNA NUEVA INSTANCIA DE LA CLASE ORDEN (Y NO PERDER ACCESO A SUS METODOS).
//Lo que hago aca es pushear una nueva orden y cambiarle el id por el que tenia antes de cambiar de pagina.
ordenes.push(new Orden())
if(JSON.parse(localStorage.getItem("id-OrdenJSON")) != null){
    ordenes[ordenes.length-1].idOrden = JSON.parse(localStorage.getItem("id-OrdenJSON"));
}
//Aqui, si hay algo en el localStorage, agrego los productos del array almacenado en el Storage a la nueva orden recien creada.
if(JSON.parse(localStorage.getItem("id-OrdenJSON")) != null){
    for (let producto of JSON.parse(localStorage.getItem("productos-OrdenJSON"))){
        let articuloSeleccionado = producto.idProducto-1;
        let cantidadSeleccionada = producto.cantidadCarrito;
        ordenes[ordenes.length-1].agregarProducto(productos[articuloSeleccionado], cantidadSeleccionada);
    }
}

//Creo una funcion para actualizar los datos almacenados en localstorage cada vez que agregamos un producto al carrito o finalizamos una orden.
function actualizarLocalStorage () {
    //Guardo en LocalStorage la ultima orden para luego recuperarla al cambiar de pagina.
    localStorage.setItem("id-OrdenJSON", JSON.stringify(ordenes[ordenes.length-1].idOrden));
    localStorage.setItem("productos-OrdenJSON", JSON.stringify(ordenes[ordenes.length-1].productosOrden));
    localStorage.setItem("contador-OrdenJSON", JSON.stringify(ordenes[ordenes.length-1].contadorProductosAgregados));
}

//Creamos la funcion comprar (para argregar un producto al carrito).
function comprar (idProducto, cantidad=1) {
    //Generamos una nueva Orden en caso de no haber niguna.
    (!ordenes.length) ? ordenes.push(new Orden()) : console.log(`Se continuara agregando productos a la orden n° ${ordenes.length}`) ;
    let articuloSeleccionado = idProducto-1;
    let cantidadSeleccionada = cantidad;
    if (productos[articuloSeleccionado].stock >= cantidadSeleccionada){
        dialogoInfo.innerHTML = `<p>Usted añadio ${cantidad} unidades de ${productos[articuloSeleccionado].nombre} al carrito</p>`
    }
    else {
        dialogoInfo.innerHTML = `NO hay suficiente stock disponible. Quedan ${productos[articuloSeleccionado].stock} unidades`;
    };
    alertaCarrito();
    temporizadorAlerta();
    ordenes[ordenes.length-1].agregarProducto(productos[articuloSeleccionado], cantidadSeleccionada);
    actualizarLocalStorage();
    //Actualizamos DOM del carrito cada vez que agregamos un producto a la orden.
    navCarrito.innerHTML = `Carrito (${ordenes[ordenes.length-1].contadorProductosAgregados})`
}

//Creamos funcion para finalizar la orden luego del pago (el carrito se vacia al pushear nueva orden, esto se almacena en localstorage y luego se refresca la pagina).
function finalizarOrden (){
    ordenes.push(new Orden());
    actualizarLocalStorage();
    location.reload();
}

//Creamos funcion para no repetir codigo que cree por DOM las cards de los productos en cada pagina.
//Ademas contiene las instrucciones de ejecutar la funcion de compra cada vez que clickeamos en el boton de agregar al carrito.
function escribirProductosHTML (arrayProductos, columnas=3) {
    const productosHTML = document.getElementById("productos");
    arrayProductos.forEach((producto) => {
    let contenedor = document.createElement("div");
    contenedor.className = `col-xl-${columnas} col-lg-4 col-sm-6`
    //Definimos el innerHTML del elemento con una plantilla de texto
    contenedor.innerHTML = `<!-- PRODUCT ${producto.idProducto}-->
                    <div class="product text-center">
                      <div class="mb-3 position-relative">
                        <div class="badge text-black badge-primary">${(producto.disponible()) ? "DISPONIBLE" : "AGOTADO"}</div><a id="detalle-${producto.idProducto}" class="d-block" href="detalle.html"><img class="img-fluid w-100" src="img/product-${producto.idProducto}.jpg" alt="${producto.nombre}"></a>
                        <div class="product-overlay">
                          <ul class="mb-0 list-inline">
                            <li class="list-inline-item m-0 p-0"><a class="btn btn-sm btn-outline-dark" href="#"><i class="far fa-star"></i></a></li>
                            <li class="list-inline-item m-0 p-0"><a id="agregarProducto-${producto.idProducto}" class="btn btn-sm btn-dark" href="#">Agregar al carrito</a></li>
                            <li class="list-inline-item mr-0"><a class="btn btn-sm btn-outline-dark" href="#productView-${producto.idProducto}" data-bs-toggle="modal"><i class="fas fa-expand"></i></a></li>
                          </ul>
                        </div>
                      </div>
                      <h6 class="reset-anchor"> <a  href="#productView-${producto.idProducto}" data-bs-toggle="modal">${producto.nombre}</a></h6>
                      <p class="small text-muted">$${producto.precio}.-</p>
                            </div>`;
    productosHTML.appendChild(contenedor);
    //Almacenamos en constante el nodo de cada boton "agregar al carrito"
    const agregarProducto = document.getElementById(`agregarProducto-${producto.idProducto}`);
    //Añadimos manejador de evento click a dicho nodo.
    agregarProducto.addEventListener("click", () => {
        comprar(producto.idProducto);
    });
    //Almacenamos en constante el nodo de cada imagen de producto...
    const detalle = document.getElementById(`detalle-${producto.idProducto}`);
    //Añadimos manejador de evento click para almacenar variable en LocalStorage y transmitirla al js de detalle al hacer click en la imagen.
    detalle.addEventListener("click", () => {
        localStorage.setItem("detalle-id", producto.idProducto);
    })
})
}
//Creamos funcion para no repetir codigo que cree por DOM los modales de los productos en cada pagina.
function escribirModalesHTML (arrayProductos){
    const modales = document.getElementById("modales");
    arrayProductos.forEach((producto) => {
        let contenedor = document.createElement("div");
        contenedor.className = "modal fade"
        contenedor.id = `productView-${producto.idProducto}`
        contenedor.tabIndex = "-1"
        contenedor.role = "dialog"
        contenedor.ariaHidden = "true"
        //Definimos el innerHTML del elemento con una plantilla de texto
        contenedor.innerHTML = `<!-- modal producto-${producto.idProducto}-->
                                <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                                    <div class="modal-content">
                                        <div class="modal-body p-0">
                                            <div class="row align-items-stretch">
                                            <div class="col-lg-6 p-lg-0"><a class="product-view d-block h-100 bg-cover bg-center" style="background: url(img/product-${producto.idProducto}.jpg)" href="img/product-${producto.idProducto}.jpg" data-lightbox="productview-${producto.idProducto}" title="${producto.nombre}"></a><a class="d-none" href="img/product-${producto.idProducto}-alt-1.jpg" title="${producto.nombre}" data-lightbox="productview-${producto.idProducto}"></a><a class="d-none" href="img/product-${producto.idProducto}-alt-2.jpg" title="${producto.nombre}" data-lightbox="productview-${producto.idProducto}"></a></div>
                                                <div class="col-lg-6">
                                                    <button class="btn-close p-4" type="button" data-bs-dismiss="modal" aria-label="Close"><span aria-hidden="true"></span></button>
                                                        <div class="p-5 my-md-4">
                                                            <ul class="list-inline mb-2">
                                                                <li class="list-inline-item m-0"><i class="fas fa-star small text-warning"></i></li>
                                                                <li class="list-inline-item m-0"><i class="fas fa-star small text-warning"></i></li>
                                                                <li class="list-inline-item m-0"><i class="fas fa-star small text-warning"></i></li>
                                                                <li class="list-inline-item m-0"><i class="fas fa-star small text-warning"></i></li>
                                                                <li class="list-inline-item m-0"><i class="fas fa-star small text-warning"></i></li>
                                                            </ul>
                                                            <h2 class="h4">${producto.nombre}</h2>
                                                            <p class="text-muted">$${producto.precio}.-</p>
                                                            <p class="text-small mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut ullamcorper leo, eget euismod orci. Cum sociis natoque penatibus et magnis dis parturient montes nascetur ridiculus mus. Vestibulum ultricies aliquam convallis.</p>
                                                                <div class="row align-items-stretch mb-4">
                                                                    <div class="col-sm-7 pr-sm-0">
                                                                        <div class="border d-flex align-items-center justify-content-between py-1 px-3"><span class="small text-uppercase text-gray mr-4 no-select">Cantidad</span>
                                                                            <div class="quantity">
                                                                            <button class="dec-btn p-0"><i class="fas fa-caret-left"></i></button>
                                                                            <input class="form-control border-0 shadow-0 p-0" type="text" value="1">
                                                                            <button class="inc-btn p-0"><i class="fas fa-caret-right"></i></button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="col-sm-5 pl-sm-0"><a id="agregarProducto-${producto.idProducto}-modal" class="btn btn-dark btn-sm btn-block h-100 d-flex align-items-center justify-content-center px-0" href="#">Agregar al carrito</a></div>
                                                                </div>
                                                                <a class="btn btn-link text-dark p-0" href="#"><i class="far fa-star mr-2"></i>Añadir a favoritos</a>
                                                        </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
        modales.appendChild(contenedor);
})
}

//Funciones para cambiar la clase del dialogoInfo luego de 2 segundos... Estas funciones son llamadas al hacer ejecutar la funcion "comprar".
const dialogoInfo = document.getElementById("dialogoInfo");
let identificadorDeTemporizador;
function temporizadorAlerta() {
  identificadorDeTemporizador = setTimeout(alertaCarrito, 2000);
}
function alertaCarrito() {
  dialogoInfo.classList.toggle("dialogoInfo-active");
}

//Sidebar del carrito.
const navCarrito = document.getElementById("nav-carrito");
//Escribo por DOM la cantidad de productos en el carrito.
navCarrito.innerHTML = `Carrito (${ordenes[ordenes.length-1].contadorProductosAgregados})`
//Mostramos la orden por alert cada vez que hacemos click en el carrito...
navCarrito.addEventListener("click", () => {
    //(!ordenes[ordenes.length-1].productosOrden.length) ? alert("El carrito esta vacio") : ordenes[ordenes.length-1].mostrarOrden();
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
})
barraCarrito.addEventListener("click", (e)=>{
    e.stopPropagation();
})

//Funcion para Escribir por DOM el codigo html de los items en el carrito.
//Tambien se incluye la el evento de borrar producto del carrito.
const barraCarritoListaItems = document.getElementById("barraCarrito-listaItems");
function escribirProductosCarrito () {
    ordenes[ordenes.length-1].productosOrden.forEach((producto) =>{
        let contenedor = document.createElement("div");
        contenedor.className = "row mb-2 barraCarrito-item";
        contenedor.innerHTML = `
        <img class="col-3" src="img/product-${producto.idProducto}.jpg" alt="${producto.nombre}" width="50px">
        <div class="col-7">
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
        contenedor.innerHTML = `<p>EL CARRITO ESTA VACIO</p>`
    }
    else{
        contenedor.innerHTML = `<p>TOTAL $${ordenes[ordenes.length-1].calcularTotal()}.-</p>`
    }
    barraCarritoListaItems.appendChild(contenedor);
}