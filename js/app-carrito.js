//Si el array de productos en la ultima orden se encuentra vacio...
if (!ordenes[ordenes.length-1].productosOrden.length){
    $("#productos").append(`<p>EL CARRITO ESTA VACIO</p>`)
    $("#finalizarCompra").css({
        display: "none"
    })
}else{
//Agregamos cada producto del carrito por DOM.
//Tambien el evento click sobre el icono de basurero para llamar el metodo "borrarProducto" de la orden.
//Tambien evento change sobre el input de cantidades para modificar el carrito.
ordenes[ordenes.length-1].productosOrden.forEach(producto => {
    $("#productos").append(`<tr>
                            <th class="pl-0 border-0" scope="row">
                            <div class="media align-items-center"><a id="detalle-${producto.idProducto}" class="reset-anchor d-block" href="detalle.html"><img src="img/product-${producto.idProducto}-detail-1.jpg" alt="${producto.nombre}" width="70"/></a>
                                <div class="media-body ms-3"><strong class="h6"><a id="detalle2-${producto.idProducto}" class="reset-anchor" href="detalle.html">${producto.nombre}</a></strong></div>
                            </div>
                            </th>
                            <td class="align-middle border-0">
                                <p class="mb-0 small">$${producto.precio}</p>
                            </td>
                            <td class="align-middle border-0">
                            <div class="border d-flex align-items-center justify-content-between px-3"><span class="small text-uppercase text-gray headings-font-family">Cantidad</span>
                                <div class="quantity">
                                    <input id="cantidad-carrito-${producto.idProducto}" class="form-control form-control-sm border-0 shadow-0 p-0" type="number" value="${producto.cantidadCarrito}" min="0" max="${producto.stock + producto.cantidadCarrito}"/>
                                </div>
                            </div>
                            </td>
                            <td class="align-middle border-0">
                                <p id="total-${producto.idProducto}" class="mb-0 small">$${producto.precio*producto.cantidadCarrito}</p>
                            </td>
                            <td id="carrito-borrarItem-${producto.idProducto}" class="align-middle border-0"><a class="reset-anchor" href="#"><i class="fas fa-trash-alt small text-muted"></i></a></td>
                        </tr> `);
    
    $(`#carrito-borrarItem-${producto.idProducto}`).click(function(){
        ordenes[ordenes.length-1].borrarProducto(producto);
    });
    $(`#cantidad-carrito-${producto.idProducto}`).change(function() {
        if (parseInt(this.value) > 0){
            comprar(producto.idProducto, (parseInt(this.value) - producto.cantidadCarrito));
            $(`#total-${producto.idProducto}`).text(`$${producto.precio*producto.cantidadCarrito}`);
            //Modificamos el DOM del total de la Orden.
            $("#subtotalOrden").text(`$${ordenes[ordenes.length-1].calcularTotal()}.-`)
            $("#totalOrden").text(`$${ordenes[ordenes.length-1].calcularTotal()}.-`)
        }else if (parseInt(this.value) == 0) {
            ordenes[ordenes.length-1].borrarProducto(producto);
        }
    });
    //Añadimos manejador de evento click para almacenar variable en LocalStorage y transmitirla al js de detalle al hacer click en la imagen o en el nombre.
    $(`#detalle-${producto.idProducto}`).click( () => {
        localStorage.setItem("detalle-id", producto.idProducto);
    });
    $(`#detalle2-${producto.idProducto}`).click( () => {
        localStorage.setItem("detalle-id", producto.idProducto);
    });
});
};
//Modificamos el DOM del total de la orden.
$("#subtotalOrden").text(`$${ordenes[ordenes.length-1].calcularTotal()}.-`)
$("#totalOrden").text(`$${ordenes[ordenes.length-1].calcularTotal()}.-`)

//Formulario de cupon.
