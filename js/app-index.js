//Array de productos mas vendidos (al azar por slice)...
const productosMasVendidos = productos.slice(3,7);

//Creamos las cards de articulos mas vendidos utilizando el DOM.
escribirProductosHTML(productosMasVendidos);

//Creamos por DOM los modales de cada producto.
escribirModalesHTML(productosMasVendidos);
