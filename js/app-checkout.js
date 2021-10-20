//Almacenamos nodos a utuilizar.
const formulario = document.getElementById("form-checkout");
const inputOtroDomicilio = document.getElementById("alternateAddressCheckbox");
const otroDomicilio = document.getElementById("alternateAddress");
const orden = document.getElementById("productos");

//RESUMEN DE ORDEN.
//Agregamos al DOM cada producto en la orden.
ordenes[ordenes.length-1].productosOrden.forEach(producto =>{
    let liProducto = document.createElement("li");
    liProducto.className = "d-flex align-items-center justify-content-between";
    let liSeparador = document.createElement("li");
    liSeparador.className = "border-bottom my-2";
    liProducto.innerHTML = `<strong class="small font-weight-bold">(${producto.cantidadCarrito})-${producto.nombre}</strong><span class="text-muted small">$${producto.precio*producto.cantidadCarrito}</span>`;
    orden.appendChild(liProducto);
    orden.appendChild(liSeparador);
});
//Recuperamos existencia de descuento desde localSotrage.
let porcentaje = parseInt(localStorage.getItem("desc"));
//Si existe descuento, se calcula y muestra.
if (porcentaje > 0) {
    let descuento = document.createElement("li");
    descuento.className = "d-flex align-items-center justify-content-between mt-2";
    descuento.innerHTML = `<strong class="text-uppercase small font-weight-bold">Descuento ${porcentaje}%</strong><span>$(${ordenes[ordenes.length-1].descuentoYtotal(porcentaje)[0]})</span>`;
    orden.appendChild(descuento);
}
//Se muestra el total.
let total = document.createElement("li");
total.className = "d-flex align-items-center justify-content-between mt-2 p-2 bg-dark text-white";
total.innerHTML = `<strong class="text-uppercase small font-weight-bold">Total</strong><span>$${ordenes[ordenes.length-1].descuentoYtotal(porcentaje)[1]}</span>`;
orden.appendChild(total);

//FORMULARIO.
//Mostramos la parte del formulario para envio a otro domicilio en caso de estar activado el checkbox.
(inputOtroDomicilio.checked) ? otroDomicilio.classList.remove("d-none") : otroDomicilio.classList.add("d-none");
inputOtroDomicilio.addEventListener("change",()=>{
    otroDomicilio.classList.toggle("d-none");
});