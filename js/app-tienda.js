// Creamos Clase Producto para facilitar la creacion de los productos a ofrecer.
class Producto {
    static contadorProductos = 0;
    constructor(nombre, grupo, precio, stock=0){
        this.idProducto = ++Producto.contadorProductos;
        this.nombre = nombre.toUpperCase();
        this.grupo = grupo;
        this.precio = parseFloat(precio);
        this.stock = parseInt(stock);
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
        return `idProducto: ${this.idProducto}, nombre: ${this.nombre}, precio: $${this.precio}.-`;
    }
}

//Creamos Clase Orden para facilitar la creacion de una orden cada vez que un cliente hace una.
class Orden {
    static contadorOrdenes = 0;
    constructor(){
        this.idOrden = ++Orden.contadorOrdenes;
        this.productosOrden = []; //Array de Productos añadidos a la orden.
        this.contadorProductosAgregados = 0;
    }
    agregarProducto(producto, cantidad){
        if (producto.stock >= cantidad){
            for ( var i=0; i<cantidad; i++){
                this.productosOrden.push(producto)
            }
        }
        else{
        alert(`NO hay suficiente stock disponible. Quedan ${producto.stock} unidades`);
        }
    }
    calcularTotal(){
        let total = 0;
        for (let producto of this.productosOrden){
            total += producto.precio;
        }
        return total;
    }
    mostrarOrden(){
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

//Texto con las opciones de productos a mostrar en el prompt al iniciar.
let textoPrompt =
`Ingrese el articulo que desea:`;
for (let producto of productos){
    textoPrompt +=
    `
    Ingrese ${producto.idProducto} para ${producto.nombre} ($${producto.precio}.-)`
};
textoPrompt +=
`
Ingrese ${productos.length + 1} para SALIR.
`;

//Array de Ordenes
const ordenes = []

//Funcion Comprar.
function comprar () {
    //Generamos una nueva Orden
    ordenes.push(new Orden());
    //Creamos variable para controlar el bucle while de Compra.
    let seguirComprando = "Y";
    //bucle While de compra.
    while (seguirComprando == "Y"){
        let articuloSeleccionado = parseInt(prompt(textoPrompt)-1);
        while ( articuloSeleccionado < 0 || articuloSeleccionado > (productos.length) || isNaN(articuloSeleccionado) ){
            alert(`Numero incorrecto. Ingrese un numero entre 1 y ${productos.length+1}`);
            articuloSeleccionado = parseInt(prompt(textoPrompt)-1);
        }
        let cantidadSeleccionada = parseInt(prompt(`Ingrese la cantidad de ${productos[articuloSeleccionado].nombre} que desea: `));
        ordenes[ordenes.length-1].agregarProducto(productos[articuloSeleccionado], cantidadSeleccionada);
        if (productos[articuloSeleccionado].stock >= cantidadSeleccionada){
            alert(`Usted añadio ${cantidadSeleccionada} unidades de ${productos[articuloSeleccionado].nombre} al carrito`);
        }
        seguirComprando = prompt("Desea seguir comprando? Y/N").toUpperCase();
    }
    ordenes[ordenes.length-1].mostrarOrden();
}

//Genero por codigo una compra a modo de ejemplo
//comprar();

//Creamos las cartas de articulos desde JS a partir del array de productos.
const productosHTML = document.getElementById("productos");
productos.forEach((producto) => {
    let contenedor = document.createElement("div");
    contenedor.className = "col-lg-4 col-sm-6"
    //Definimos el innerHTML del elemento con una plantilla de texto
    contenedor.innerHTML = `<!-- PRODUCT-->
                    <div class="product text-center">
                      <div class="mb-3 position-relative">
                        <div class="badge text-black badge-primary">${(producto.disponible()) ? "DISPONIBLE" : "AGOTADO"}</div><a class="d-block" href="detalle.html"><img class="img-fluid w-100" src="img/product-${producto.idProducto}.jpg" alt="${producto.nombre}"></a>
                        <div class="product-overlay">
                          <ul class="mb-0 list-inline">
                            <li class="list-inline-item m-0 p-0"><a class="btn btn-sm btn-outline-dark" href="#"><i class="far fa-star"></i></a></li>
                            <li class="list-inline-item m-0 p-0"><a class="btn btn-sm btn-dark" href="carrito.html">Agregar al carrito</a></li>
                            <li class="list-inline-item mr-0"><a class="btn btn-sm btn-outline-dark" href="#productView" data-bs-toggle="modal"><i class="fas fa-expand"></i></a></li>
                          </ul>
                        </div>
                      </div>
                      <h6> <a class="reset-anchor" href="detail.html">${producto.nombre}</a></h6>
                      <p class="small text-muted">$${producto.precio}.-</p>
                    </div>`;
    productosHTML.appendChild(contenedor);
})