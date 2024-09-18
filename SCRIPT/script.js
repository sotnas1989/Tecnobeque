var llaves = new Array(); // Almacena las llaves de los eltos que hay en el localStorage. Muy útil luego de eliminar un producto
var nextAvailableKey = 0; // Almacena el proximo valor llave para una futura adicion de producto.

//  MANIPULACION DEL DOM. Agrega los eventos a los elementos HTML.
let inputArchivo = document.getElementsByClassName('archivo'); 
inputArchivo[0].addEventListener('change', leerFichero, false); // Evento change del input file tabla arriba
inputArchivo[1].addEventListener('change', leerFichero, false); // Evento change del input fila tabla abajo
let botonEditar = document.getElementsByClassName("buttonEditar");
botonEditar[0].addEventListener("click", editarProducto, false); 
botonEditar[1].addEventListener("click", editarProducto, false);
let botonEliminar = document.getElementsByClassName("buttonEliminar");
botonEliminar[0].addEventListener("click", eliminarProducto, false);
botonEliminar[1].addEventListener("click", eliminarProducto, false);
let botonNuevo = document.getElementsByClassName("buttonNuevo");
botonNuevo[0].addEventListener("click", nuevoProducto, false);
botonNuevo[1].addEventListener("click", nuevoProducto, false);
let botonVaciar = document.getElementsByClassName("buttonVaciar");
botonVaciar[0].addEventListener("click", vaciarLocalStorage, false);
botonVaciar[1].addEventListener("click", vaciarLocalStorage, false);
let botonExportar = document.getElementsByClassName("buttonExportar");
botonExportar[0].addEventListener("click", exportar2, false);
botonExportar[1].addEventListener("click", exportar2, false);
window.addEventListener('load', iniciar, false);
//window.addEventListener("storage", iniciar, false);

/**
 * Crea el nodo <table> a partir de la data que que se encuentra en el localStorage y lo agrega al divTabla 
 */
function crearTabla() 
{        
    if(localStorage.getItem("0") === null) // Si el localStorage no tiene los datos de los productos
    {
        console.log(`Local storage sin datos de productos!\n llaves[]: ${llaves}`);
        return; // Termina la ejecución. Sin datos no tiene sentido hacer mas
    }
    const tabla = document.getElementById("tabla");
    const tBody = document.createElement("tbody");
    // Recorriendo las llaves 
    for (let i = 1; i < llaves.length; i++) // Se empieza en 1 porque el 0 es el th
    {
        let key = llaves[i];
        const celdasFila = localStorage[key].split(';');  // Acediendo a todas las celdas de la fila
        const tr = document.createElement("tr"); // Creando elemento row
        for (let rowCell = 0; rowCell < celdasFila.length; rowCell++)
        {
            const td = document.createElement("td"); // Create new cell
            td.textContent = celdasFila[rowCell];
            tr.appendChild(td); // Adding cell to row
        }
        tBody.appendChild(tr); // Agregando row
    }
    tabla.appendChild(tBody); // Agregando tbody a la la tabla        
}

function leerFichero(evt) 
{
    let file = evt.target.files[0];
      let reader = new FileReader();
      reader.onload = (e) => {
        // Cuando el archivo se terminó de cargar
        let fileText = e.target.result; // Texto del fichero data.csv
        saveToLocalStorage(fileText); // Actualizando localStorage con la nueva información
        location.reload();
        //crearTabla(e.target.result)
      };
      // Leemos el contenido del archivo seleccionado
      reader.readAsText(file);
}



/**
 * Agrega al local storage la información que fue leída del fichero data.cvs
 * @param {String} data Texto con el formato #;NOMBRE;PRECIO;DESCRIPCION 
 * .Cada línea corresponde a un producto con la excepción de la linea índice 0 que 
 * es el encabezado de la tabla. 
 */    
function saveToLocalStorage(data)  
{
    const todasFilas = data.split(/\r?\n|\r/); // Separando el texto por filas
    for (let f = 0; f < todasFilas.length; f++)
    {
        let aux = todasFilas[f].split(";");        
        const llave =  aux[0]; // La llave del producto es el primer valor que aparece en el fichero
        llaves.push(parseInt(llave)); // Quiero que el array de llaves almacene valores enteros. 
        const valor = todasFilas[f];
        localStorage.setItem(llave,valor);
    }
    nextAvailableKey = llaves[llaves.length-1] + 1; // Si la ultima llave almacenada es 20, la proxima sera 21
    crearTabla();
}

function editarProducto()
{
    let fila = parseInt(prompt("Inserte el Número del producto a editar: ")); // Como hay un encabezado en la tabla el valor coincide con la fila    
    if(isNaN(fila) || (fila<1) || (fila >= llaves.length)) // Validando fila, que sea un numero   1 <= n < llaves.length. Resuelve problema al eliminar
    {
        alert("¡Número de producto incorrecto!");
        return;
    }
    let opcion = parseInt(prompt("¿Qué valor desea editar? 1-PRODUCTO 2-PRECIO 3-DESCRIPCION")); // La opcion coincide con la columna
    if(isNaN(opcion) || opcion<1 || opcion>3) // Validando opcion
    {
        alert("¡Valor incorrecto!\nIntroduzca un valor entre 1 y 3");
        return;
    }
    let celdasProducto = document.getElementById("tabla").rows[fila].cells; // Obteniendo todas las celdas de la fila
    let llave = fila;
    let valor = prompt("Inserte nuevo valor: ");    
    // Modificando solamente el nodo a editar y no toda la tabla en si. Actualizar el localStorage
    celdasProducto[opcion].innerHTML = valor;
    let aux = celdasProducto[0].innerHTML + ";" + celdasProducto[1].innerHTML + ";" + celdasProducto[2].innerHTML + ";" + celdasProducto[3].innerHTML; // Dando formato
    localStorage[llave] = aux; 
    
}

/**
 * Elimina el n-ésimo producto
 * @param {number} n Número del producto a eliminar
 */
function eliminarProducto(n)
{
    let fila = parseInt(prompt(`Inserte el Número del producto a ELIMINAR.\nEl Número debe estar entre 0 y ${llaves.length-1}`)); // Como hay un encabezado en la tabla el valor coincide con la fila    
    let indexFila = llaves.indexOf(fila); // Indice del elto a eliminar. Si no existe el elto devuelve -1
    if(isNaN(fila) || (fila<1) || (fila>=llaves.length) || indexFila === -1) // Validando fila
    {
        alert("¡Número de producto incorrecto!\nNO es posible eliminar");
        return;
    }
    localStorage.removeItem(fila); // Eliminando producto del storage
    
    llaves.splice(indexFila,1); // Eliminando la llave "fila" de "llaves[]""
    location.reload();
    // iniciar();
}

/**
 * Crea un nuevo producto y lo agrega al final del local storage en el formato nombre;precio;descripción 
 */
function nuevoProducto()
{    
    let nombre = prompt("Inserte el Nombre del Producto: ");
    if(nombre === "" || nombre === null) // Si el usuario no escribe nada y acepta nombre ="". Si el usuario cancela nombre = null
    {
        alert("El nombre NO puede ser vacío");
        return;
    }
    let precio = prompt(`Inserte el Precio de ${nombre}: `);
    if(precio === "" || precio === null)
    {
        alert("¡El precio NO puede estar vació!");
        return;
    }
    let descripcion = prompt("Inserte la Descripción del Producto: "); // NO importa que la descripción sea vacía
    if(descripcion === null) descripcion = ""; // Para evitar guardar valores null en la tabla
    // Procesando la información
    let llave = nextAvailableKey++;
    llaves.push(llave);
    let valor = `${llave};${nombre};${precio};${descripcion}`;
    localStorage.setItem(llave,valor);
    location.reload();
    // iniciar();
}

function vaciarLocalStorage()
{
    if(localStorage.length === 0)
    {
        alert("La tabla se encuentra ya VACÍA");
        return;
    }
    inputArchivo[0].hidden = false; // Visualizando nuevamente el input para que se pueda cargar el fichero data_covers.csv
    inputArchivo[1].hidden = false;
    localStorage.clear();
    llaves = new Array();
    nextAvailableKey = 0;
    let tabla = document.getElementById("tabla");
    let nodeTbody = tabla.querySelector("tbody");
    if(nodeTbody !== null) nodeTbody.remove(); // Si existe eliminar el nodo <tbody>    
}

/** 
 * @returns Devuelve el contenido del localStorage en forma de string con los cambios de línea incluidos como
 * caracteres \n. Se sigue el formato LLAVE;PRODUCTO;PRECIO;DESCRIPCION de fichero data.csv. Se muestran los 
 * productos ordenados descendentemente segun su llave, ya que el localStorage muestra la información desordenada
 */
function localStorageToString()
{
    let result = "";
    for (let index = 0; index < llaves.length; index++) 
    {
	    let key = llaves[index];
        if(index === 0) result = localStorage[key]; // Agrego la primera linea
        else result += "\n" + localStorage[key];  // Agrego un cambio de linea y luego la proxima linea
    }
    return result;
}

/**
 * Exporta la información de un string a un fichero de texto. El fichero se guarda en la carpeta "Downloads"
 * @param {string} data Texto a exportar
 * @param {string} fileName Nombre del fichero resultado de la exportación
 */
    function exportar (data, fileName) 
    {
        const a = document.createElement("a");
        const contenido = data,
        blob = new Blob([contenido], {type: "octet/stream"}),
        url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);    
    }

    function exportar2() 
    {
        if(localStorage.length === 0) // LocalStorage Vacío
        {
            alert("Tabla VACÍA.\nNada que exportar");
            return; // fin de ejecución
        }
        let data = localStorageToString();
        let fileName = "data.csv";
        exportar(data, fileName);
    }

/**
 * Carga e inicializa los datos. 
 */
function iniciar()
{        
    if(localStorage.getItem("0") !== null)  // Si el localStorage contiene las llaves de productos (la llave 0 de los productos existe en el localStorage)
    {
        inputArchivo[0].hidden = true; // Ya existen datos en el local storage. Se oculta los botones del cargar fichero
        inputArchivo[1].hidden = true;        
        if(llaves.length === 0) // Si llaves vacio. Llenarlo
        {
            let key;
            for (let i = 0; i < localStorage.length; i++) 
            {            
                key = parseInt(localStorage.key(i));
                if(!isNaN(key))  llaves.push(key);   // Muy necesario ya que a veces el localStorage agrega sus propias k,v               
            }
            llaves.sort((a, b) => a - b); // Ordenando el array ya que las llaves en el localStorage se guardan sin orden
        }         
        nextAvailableKey = llaves[llaves.length-1] + 1; // Si la ultima llave almacenada es 20, la proxima sera 21
        crearTabla();
    }
    else // LocalStorage no tiene los datos de los productos
    {
        inputArchivo[0].hidden = false;
        inputArchivo[1].hidden = false;
        llaves = new Array(); // Inizializa el array dejando atras viejos valores   
        nextAvailableKey = 0; // Como el localStorage esta vacio el proximo elto tendrá llave 0     
    }    
}
