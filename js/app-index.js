//Array de productos mas vendidos (al azar por slice)...
const productosMasVendidos = productos.slice(3,7);

//Creamos las cards de articulos mas vendidos utilizando el DOM.
escribirProductosHTML(productosMasVendidos);

//Creamos por DOM los modales de cada producto.
escribirModalesHTML(productosMasVendidos);

//Animacion de bienvenida
$(document).ready($("#bienvenida").fadeOut(2000));

//Animacion portada concatenada.
$("#portada")
    .css({
    "height": "0vh",
    })
    .animate({
    "height": "100vh",
    }, 1000);
//Animaciones sobre texto de la portada.
let textoNum = 0; //Declaro variable para controlar la recursion.
function textosPortada (i) {
    $($(".portada-text")[i]) //1ro hago fadeIn del texto con la clase "portada-text".
    .fadeIn(1000, () => {
        const salida = () =>{ //Esta fn hace un fadeOut del texto y como callback vuelve a llamar la funcion "textosPortada" haciendo recursion.
            $($(".portada-text")[i]).fadeOut(1000, ()=>{
                (textoNum == $(".portada-text").length-1) ? textoNum = 0 : textoNum++;
                textosPortada(textoNum);
            });
        }
        setTimeout(salida , 3000); //2do, pasados 10seg llamo a la funcion salida.
    })
};
textosPortada(textoNum);
//Animacion de boton concatenada
$(".portada-boton")
        .css({
            "background-color": "#343a40",
            "color": "#fff",
            "box-shadow": "0 0 10px black",
            "display": "none"
        })
        .slideDown(1200, function (){
            $(this).css({"background-color": "#b68b23"})
        });