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
    disminuirStock (cantidad){
        this.stock -= parseInt(cantidad);
    }
    disponible (){
        return this.stock > 0 ? true : false;
    }
}

//Creamos Clase Orden para facilitar la creacion de una orden cada vez que un cliente hace una.
class Orden {
    //Obtengo el valor de id de la ultima orden (y en caso de ser la primera asigno 1)
    static contadorOrdenes = (JSON.parse(localStorage.getItem("id-OrdenJSON")) != null) ? JSON.parse(localStorage.getItem("id-OrdenJSON")) : 1;
    constructor(){
        this.idOrden = Orden.contadorOrdenes++;
        //Array de Productos añadidos a la orden.
        this.productosOrden = [];
        this.contadorProductosAgregados = 0;
    }
    agregarProducto(producto, cantidad){
        if (isNaN(cantidad)){
            alertaInfo(`<p>Debe ingresar el NUMERO de cantidades que desea</p>`);
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
    descuentoYtotal(porcentaje=0){
        let base = this.calcularTotal();
        let descuento = base*porcentaje/100;
        let total = base - descuento;
        const descuentoOrden = [descuento, total];
        return descuentoOrden; 
    }
}

//Creamos un array para agrupar todos los productos que se ofrecen.
const productos = []

//Añadimos por metodo push los productos a ofrecer (a modo de ejemplo).
productos.push(new Producto("Air Force Goretex", "Zapatillas-AirForce", 2800, 7));
productos.push(new Producto("Zapatillas Nike SB Dunk", "Zapatillas-SbDunk", 4500, 3));
productos.push(new Producto("Remera Levis azul", "Remeras-Estampadas", 1500, 2));
productos.push(new Producto("Camisa de fibrana MC", "Camisas-Fibrana", 2500, 3));
productos.push(new Producto("Remera VANS estampada", "Remeras-Estampadas", 1800));
productos.push(new Producto("Zapatillas Nike SB Dunk gris", "Zapatillas-SbDunk", 4500, 4));
productos.push(new Producto("Jogger Gabardina negro AM", "Pantalones-Joggers", 2500, 2));
productos.push(new Producto("Zapatillas Nike SB Dunk Green Eyes", "Zapatillas-SbDunk", 4500, 1));
productos.push(new Producto("Remera VANS estampada", "Remeras-Estampadas", 1800,5));
productos.push(new Producto("Jean Deep Chupin con roturas", "Pantalones-Jeans", 3000, 1));
productos.push(new Producto("Camisa de fibrana MC", "Camisas-Fibrana", 2500, 3));
productos.push(new Producto("Camisa de fibrana MC", "Camisas-Fibrana", 2500));

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
        if (cantidadSeleccionada > 0){
            alertaInfo(`<p>Usted añadio ${cantidad} unidades de ${productos[articuloSeleccionado].nombre} al carrito</p>`); 
        }else if (cantidadSeleccionada < 0){
            alertaInfo(`<p>Usted quitó ${-cantidad} unidades de ${productos[articuloSeleccionado].nombre} del carrito</p>`); 
        }
    }
    else {
        alertaInfo(`<p>NO hay suficiente stock disponible. Quedan ${productos[articuloSeleccionado].stock} unidades</p>`); 
    };
    ordenes[ordenes.length-1].agregarProducto(productos[articuloSeleccionado], cantidadSeleccionada);
    actualizarLocalStorage();
    //Actualizamos DOM del carrito cada vez que agregamos un producto a la orden.
    navCarrito.innerHTML = `Carrito (${ordenes[ordenes.length-1].contadorProductosAgregados})`
}

//Creamos funcion para finalizar la orden luego del pago (el carrito se vacia al pushear nueva orden, esto se almacena en localstorage y luego se refresca la pagina).
function finalizarOrden (){
    ordenes.push(new Orden());
    actualizarLocalStorage();
}

//Funciones para cambiar la clase del dialogoInfo luego de 2 segundos... Estas funciones son llamadas al hacer ejecutar la funcion "comprar".
const dialogoInfo = document.getElementById("dialogoInfo");
function verAlerta() {
    dialogoInfo.classList.toggle("dialogoInfo-active");
}
let identificadorDeTemporizador;
function temporizadorAlerta() {
  identificadorDeTemporizador = setTimeout(verAlerta, 2000);
}
function alertaInfo(contenidoHTML){
    dialogoInfo.innerHTML = contenidoHTML;
    verAlerta();
    temporizadorAlerta();
}