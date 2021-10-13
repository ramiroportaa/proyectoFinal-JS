//Creamos las Cards de articulos desde el DOM.
const productosHTML = document.getElementById("productos");
escribirProductosHTML(productos, 4);

//Creamos por DOM los modales de cada producto.
escribirModalesHTML(productos);

//Filtros E-Shop.
//Creamos funcion que cree un array con los productos que pasan el filtro, y luego vacie el html para volver a ejecutar la funcion de escribir los productos por DOM con el nuevo array.
function filtroGrupo (grupo) {
    const lista = productos.filter(producto => producto.grupo.startsWith(grupo));
    productosHTML.innerHTML = "";
    (!lista.length) ? productosHTML.innerHTML = `<h4>No se encontraron ${grupo}</h4> ` : escribirProductosHTML(lista, 4);
};
//Asignamos el evento click a los nodos de cada categoria y llamamos la funcion recien creada con parametro this.id ya que el id de cada nodo es el string que se quiere pasar como condicion del filtro.
const categorias = document.getElementsByClassName("categorias");
for (i=0; i< categorias.length; i++) {
    categorias[i].addEventListener("click", function () {
        filtroGrupo(this.id);
    });
};

//Ordenar productos E-Shop (evento del select).
document.getElementById("ordenarPor").addEventListener("change", function () {
    let productosOrdenado;
    switch (this.value) {
        case "default":
            productosOrdenado = productos.slice();
            break;
        case "low-high":
            //Uso .slice() para que se almacene un nuevo array en productosOrdenado (y no se haga referencia al array de productos y se modifique este ultimo).
            productosOrdenado = productos.slice().sort((a,b)=>a.precio-b.precio);
            break;
        case "high-low":
            productosOrdenado = productos.slice().sort((a,b)=>b.precio-a.precio);
            break;
    }
    productosHTML.innerHTML = "";
    escribirProductosHTML(productosOrdenado, 4);
});