//Almacenamos nodos a utuilizar.
const formulario = document.getElementById("form-checkout");
const inputOtroDomicilio = document.getElementById("alternateAddressCheckbox");
const otroDomicilio = document.getElementById("alternateAddress");
const iNombre = document.getElementById("nombre");
const iApellido = document.getElementById("apellido");
const iEmail = document.getElementById("email");
const iTel = document.getElementById("tel");
const iDni = document.getElementById("dni");
const iDomicilio = document.getElementById("domicilio");
const iCiudad = document.getElementById("ciudad");
const iProvincia = document.getElementById("provincia");
const iNombreEnvio = document.getElementById("nombreEnvio");
const iApellidoEnvio = document.getElementById("apellidoEnvio");
const iEmailEnvio = document.getElementById("emailEnvio");
const iTelEnvio = document.getElementById("telEnvio");
const iDniEnvio = document.getElementById("dniEnvio");
const iDomicilioEnvio = document.getElementById("domicilioEnvio");
const iCiudadEnvio = document.getElementById("ciudadEnvio");
const iProvinciaEnvio = document.getElementById("provinciaEnvio");
const orden = document.getElementById("productos");
//Bandera para el evento submit del formulario validado.
let bandera = false;

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

formulario.addEventListener("submit", function (e){
    e.preventDefault();
    validarForm();
    if (bandera) {
        Swal.fire({
            title: '<strong>Orden enviada</strong>',
            icon: 'success',
            html:
              `Seras redireccionado` ,
            showCloseButton: true,
            showCancelButton: false,
            showConfirmButton: false,
            focusConfirm: false,
            timer: 2000
          }).then(()=>{
              location.replace("index.html");
          })
        finalizarOrden();
    }
});

function validarForm () {
    let inputs = document.getElementsByClassName("form-input");
    //Revisamos la primera parte del formulario.
    for (let input = 0; input < 8; input++){
        if (inputs[input].value == ""){
            bandera = false;
            inputs[input].classList.add("border-danger");
            Swal.fire({
                title: '<strong>Hay campos <u>vacios</u></strong>',
                icon: 'info',
                html:
                  `Revise los campos en rojo` ,
                showCloseButton: true,
                showCancelButton: false,
                focusConfirm: false,
              });
        } else{
            bandera = true;
        };
        //Borramos la clase border-danger cuando el input tenga algun value.
        inputs[input].addEventListener("change",()=>{
            if (inputs[input].value != ""){
                inputs[input].classList.remove("border-danger");
            }else{
                inputs[input].classList.add("border-danger");
            }
        })
    }
    //Si el checkbox de "enviar a domicilio distinto al de facturacion" esta activo, validamos la 2da parte tambien.
    if (inputOtroDomicilio.checked){
        for (let input = 8; input < 16; input++){
            if (inputs[input].value == ""){
                bandera = false;
                inputs[input].classList.add("border-danger");
                Swal.fire({
                    title: '<strong>Hay campos <u>vacios</u></strong>',
                    icon: 'info',
                    html:
                      `Revise los campos en rojo` ,
                    showCloseButton: true,
                    showCancelButton: false,
                    focusConfirm: false,
                  });
            }else{
                bandera = true;
            };
            //Borramos la clase border-danger cuando el input tenga algun value.
            inputs[input].addEventListener("change",()=>{
                if (inputs[input].value != ""){
                    inputs[input].classList.remove("border-danger");
                }else{
                    inputs[input].classList.add("border-danger");
                }
            })
        }
    }
    
}