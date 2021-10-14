const productosHTML = document.getElementById("productos");
let vistaTienda = parseInt(localStorage.getItem("vista-tienda"));

//Creamos las Cards de articulos desde el DOM.
escribirProductosHTML(productos, vistaTienda);
//Creamos por DOM los modales de cada producto.
escribirModalesHTML(productos);

//Filtros E-Shop.
//Colocamos el select en el valor "default" al iniciar la pagina asi no queda marcando el ultimo filtro pero sin filtrar realmente los productos (uso JQuery).
$("#ordenarPor").val('default');
let productosMostrados = productos;
//Creamos funcion que cree un array con los productos que pasan el filtro, y luego vacie el html para volver a ejecutar la funcion de escribir los productos por DOM con el nuevo array.
function filtroGrupo (grupo) {
    productosMostrados = productos.filter(producto => producto.grupo.startsWith(grupo));
    productosHTML.innerHTML = "";
    (!productosMostrados.length) ? productosHTML.innerHTML = `<h4>No se encontraron ${grupo}</h4> ` : escribirProductosHTML(productosMostrados, vistaTienda);
    //Colocamos el select en el valor "default" cada vez que filtramos asi no queda marcando el ultimo filtro pero sin filtrar realmente los productos (uso JQuery).
    $("#ordenarPor").val('default');
};
//Asignamos el evento click a los nodos de cada categoria y llamamos la funcion recien creada con parametro this.id ya que el id de cada nodo es el string que se quiere pasar como condicion del filtro.
const categorias = document.getElementsByClassName("categorias");
for (i=0; i< categorias.length; i++) {
    categorias[i].addEventListener("click", function () {
        filtroGrupo(this.id);
        window.location.hash = ""; //Modifico el # de la URL por si queda pegado cuando vengo de clickear en las "principales categorias" de la home.
    });
};
//Filtro por rango de precios (use noUiSlider).
function filtroRango (){
    let valorMin = parseInt(range.noUiSlider.get()[0].slice(1));
    let valorMax = parseInt(range.noUiSlider.get()[1].slice(1));
    productosMostrados = productos.filter(producto => producto.precio >= valorMin && producto.precio <= valorMax);
    productosHTML.innerHTML = "";
    (!productosMostrados.length) ? productosHTML.innerHTML = `<h4>No se encontraron productos entre ${valorMin} y ${valorMax}</h4> ` : escribirProductosHTML(productosMostrados, vistaTienda);
};
//Aplico filtro de rango a evento sobre el checkbox. (Uso JQuery).
$("#range-aplicar").change( function () {
    if ($(this).is(":checked")){
        filtroRango();
    }else{
        filtroGrupo(""); //Llamamos filtroGrupo con parametro "" (string vacio) ya que con esto como condicion, todos los productos pasan ese filtro.
    }
});

//Ordenar productos E-Shop (evento del select).
document.getElementById("ordenarPor").addEventListener("change", function () {
    let productosOrdenado;
    switch (this.value) {
        case "default":
            productosOrdenado = productosMostrados.slice();
            break;
        case "low-high":
            //Uso .slice() para que se almacene un nuevo array en productosOrdenado (y no se haga referencia al array de productos y se modifique este ultimo).
            productosOrdenado = productosMostrados.slice().sort((a,b)=>a.precio-b.precio);
            break;
        case "high-low":
            productosOrdenado = productosMostrados.slice().sort((a,b)=>b.precio-a.precio);
            break;
    }
    productosHTML.innerHTML = "";
    escribirProductosHTML(productosOrdenado, 4);
});

//Vista de la tienda (uso JQuery).
$("#vista-3").click(() =>{
    localStorage.setItem("vista-tienda", 4);
    vistaTienda = 4;
    productosHTML.innerHTML = "";
    escribirProductosHTML(productosMostrados, 4);
    $("#ordenarPor").val('default');
});
$("#vista-2").click(() =>{
    localStorage.setItem("vista-tienda", 6);
    vistaTienda = 6;
    productosHTML.innerHTML = "";
    escribirProductosHTML(productosMostrados, 6);
    $("#ordenarPor").val('default');
});

//Filtros segun hash de la URL (para cuando se redirige desde los enlaces de la home).
switch (window.location.hash) {
    case "#Camisas0":
        filtroGrupo("Camisas")
        break;
    case "#Remeras0":
        filtroGrupo("Remeras")
        break;
    case "#Pantalones0":
        filtroGrupo("Pantalones")
        break;
    case "#Zapatillas0":
        filtroGrupo("Zapatillas")
        break;        
};