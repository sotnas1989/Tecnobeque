var llaves = new Array(); // Almacena las llaves de los eltos que hay en el localStorage. Muy útil luego de eliminar un producto
var nextAvailableKey = "c0"; // Almacena el proximo valor llave para una futura adicion de cover.

//  MANIPULACION DEL DOM. Agrega los eventos a los elementos HTML.
let inputArchivo = document.getElementsByClassName('archivo'); 
inputArchivo[0].addEventListener('change', leerFichero, false); // Evento change del input file tabla arriba
inputArchivo[1].addEventListener('change', leerFichero, false); // Evento change del input fila tabla abajo
let botonEditar = document.getElementsByClassName("buttonEditar");
botonEditar[0].addEventListener("click", editarCover, false); 
botonEditar[1].addEventListener("click", editarCover, false);
let botonEliminar = document.getElementsByClassName("buttonEliminar");
botonEliminar[0].addEventListener("click", eliminarCover, false);
botonEliminar[1].addEventListener("click", eliminarCover, false);
let botonNuevo = document.getElementsByClassName("buttonNuevo");
botonNuevo[0].addEventListener("click", nuevoCover, false);
botonNuevo[1].addEventListener("click", nuevoCover, false);
let botonVaciar = document.getElementsByClassName("buttonVaciar");
botonVaciar[0].addEventListener("click", vaciarLocalStorage, false);
botonVaciar[1].addEventListener("click", vaciarLocalStorage, false);
let botonExportar = document.getElementsByClassName("buttonExportar");
botonExportar[0].addEventListener("click", exportar2, false);
botonExportar[1].addEventListener("click", exportar2, false);
window.addEventListener('load', iniciar, false);

/**
 * Carga e inicializa los datos. 
 */
function iniciar()
{        
    if(localStorage.getItem("c0") !== null)  // Si el localStorage contiene las llaves de productos (la llave 0 de los productos existe en el localStorage)
    {
        inputArchivo[0].hidden = true; // Ya existen datos en el local storage. Se oculta los botones del cargar fichero
        inputArchivo[1].hidden = true;   
        if(llaves.length === 0) // Si llaves vacio. Llenarlo
        {
            let key;
            for (let i = 0; i < localStorage.length; i++) 
            {            
                key = localStorage.key(i);
                if(key[0] === "c")  llaves.push(key);   // Muy necesario ya que a veces el localStorage agrega sus propias k,v. Se agregan solo las llaves de covers              
            }
            sortLlavesCovers(llaves); // Ordenando el array ya que las llaves en el localStorage se guardan sin orden
        }         
        let parteNumericaLlave = parseInt(llaves[llaves.length-1].substring(1)); // Obteniendo la parte numerica de la ultima llava eje: c17 ---> 17
        nextAvailableKey = "c" + (parteNumericaLlave + 1); // Si la ultima llave almacenada es c20, la proxima sera c21
        crearTabla();
        
        // Manipulando el DOM para agregar los eventListeners a los botones - y +
        addEventListenerBotonesEdicion();
        
    }
    else // LocalStorage no tiene los datos de los productos
    {
        inputArchivo[0].hidden = false;
        inputArchivo[1].hidden = false;
        llaves = new Array(); // Inizializa el array dejando atras viejos valores   
        nextAvailableKey = "c0"; // Como el localStorage esta vacio el proximo elto tendrá llave c0     
    }    
}

/**
 * Ordena el arreglo de llaves de los covers de menor a mayor
 * @param {string[]} llaves 
 */
function sortLlavesCovers(llaves) 
{
    for (let i = 0; i < llaves.length-1; i++) 
    {        
        for (let j = i+1; j < llaves.length; j++) 
        {
            let key_i = parseInt(llaves[i].substring(1)); // Seleccionando la parte numerica de la llave en i
            let key_j = parseInt(llaves[j].substring(1)); // Seleccionando la parte numerica de la llave en j
            if(key_j < key_i) // Hay un elto a la derecha que es menor. Intercambiar posiciones
            {
                let aux = llaves[i];
                llaves[i] = llaves[j];
                llaves[j] = aux;
            }
        }     
    }    
}

function addEventListenerBotonesEdicion() 
{
    let filas = document.querySelectorAll("tr"); // Todas las filas de la tabla <tr>
    for (let f = 1; f < filas.length; f++) // Recorriendo fila por fila a partir de la fila 1. La 0 es el <th> y no se itera
    {
        let filaActual = filas[f]; // Fila en la posición f
        let celdas = filaActual.cells; // Todas las celdas de la fila f
        // Accediendo a los datos de ID, CANTIDAD, - , +
        let key = "c" + celdas[0].innerHTML; // Llave de ese cover en el localStorage. Las llaves de los covers comienzan con "c"
        let cover = celdas[1].innerHTML; // Nombre del cover
        let precio = celdas[2].innerHTML; // Precio del cover
        let cantidad = parseInt(celdas[3].innerHTML); // Cantidad de unidades del tipo de cover de la fila f
        if(cantidad === 0) // El cover se agotó
        {
            filaActual.setAttribute("class","coverAgotado"); // Agregando la clase para que en el CSS se sombree toda esa fila
        }
        else filaActual.removeAttribute("class"); // El producto dejó de estar agotado
        // GESTION BOTON -
        let botonMenos = celdas[4].firstElementChild;
        botonMenos.addEventListener("click", ()=>{            
            if(cantidad > 0)
            {                
                cantidad--;
                localStorage[key] = `${key};${cover};${precio};${cantidad}`;
                // celdas[3].innerHTML = cantidad; // Actualizando la celda cantidad con el nuevo valor
                if(cantidad === 0) // El cover se agotó
                {
                    filaActual.setAttribute("class","coverAgotado"); // Agregando la clase para que en el CSS se sombree toda esa fila
                }
                location.reload();
            }
            else // Cantidad es 0
            {
                alert("Cover AGOTADO!\nImposible decrementar");
            }
        }) ;
        // GESTION BOTON +
        let botonMas = celdas[5].firstElementChild;
        botonMas.addEventListener("click", ()=>{            
            cantidad++;
            localStorage[key] = `${key};${cover};${precio};${cantidad}`;
            // celdas[3].innerHTML = cantidad; // Actualizando la celda cantidad con el nuevo valor
            if(cantidad === 1)
            {
                filaActual.removeAttribute("class"); // El producto dejó de estar agotado
            }
            location.reload();
        }) ;        
    }
}

/**
 * Crea el nodo <table> a partir de la data que que se encuentra en el localStorage y lo agrega al divTabla 
 */
function crearTabla() 
{        
    if(localStorage.getItem("c0") === null) // Si el localStorage no tiene los datos de los covers
    {
        console.log("Local storage sin datos de covers!\n llaves[]: " + llaves);
        return; // Termina la ejecución. Sin datos no tiene sentido hacer mas
    }

    let tabla = '<table id="tabla">';
    let fila;    
    for (let i = 0; i < llaves.length; i++) // Recoriendo las llaves[]
     {
        fila = llaves[i];
        if (fila === "c0") 
        {
            tabla += '<thead>';
            tabla += '<tr>';
        } 
        else 
        {
            tabla += '<tr>';
        }        
        const celdasFila = localStorage[fila].split(';');  // Acediendo a todas las celdas de la fila "fila"
        for (let rowCell = 0; rowCell < celdasFila.length; rowCell++)  // Recorriendo las celdas de "fila"
        {
            if (fila === "c0")
            {
                tabla += '<th>';
                if(rowCell === 0) tabla += '#'; // Para que en la celda [0;0] ponga # y  no c0.                
                else tabla += celdasFila[rowCell];
                if(rowCell === 3) // Celda CANTIDAD
                {
                    tabla += '</th>'; // Cierro etiqueta
                    tabla += '<th colspan="2">' // Abriendo etiqueta de celda doble GESTION 
                    tabla += 'GESTIÓN'; // Agregando celda GESTIÓN luego de la celda CANTIDAD                    
                }                 
                tabla += '</th>';
            }         
            else // cualquier otra fila
            {
                if(rowCell === 3) // Agregando el atributo class en dependencia del valor de cantidad
                {
                    tabla += '<td class = '; 
                    let cantidad = parseInt(celdasFila[rowCell]); // Cantidad de unidades del cover en posicion "fila" 
                    let clase = claseSegunCantidad(cantidad);
                    tabla += `"${clase}">`; 
                }
                else tabla += '<td>';
                if(rowCell === 0)  tabla += celdasFila[rowCell].substring(1); // NO se pone la "c" de la llave cover en la tabla          
                else tabla += celdasFila[rowCell];                
                tabla += '</td>';
                if(rowCell === 3) // Celda CANTIDAD
                {
                    tabla += '<td><button class="decremento">-</button></td>'; // Agregando celda con boton -
                    tabla += '<td><button class="incremento">+</button></td>'; // Agregando celda con boton +
                }
            }
        }
        if (fila === "c0")
        {
            tabla += '</tr>';
            tabla += '</thead>';
            tabla += '<tbody>';
        }
        else
        {
            tabla += '</tr>';
        }
    } 
        tabla += '</tbody>';
        tabla += '</table>';
        document.querySelector('#divTabla').innerHTML = tabla;               
}

/**
 * @returns {string} Devuelve el nombre de la clase CSS que le corresponde 
 * acorde al valor de cantidad. 
 * 
 * cantidad = 0  retorna "agotado"
 * 
 * 0 < cantidad <= 5 retorna "escaso"
 * 
 * 5 < cantidad <= 15 retorna "suficiente"
 * 
 * 15 < cantidad <= 25 retorna "abundante"
 * 
 * cantidad > 25 retorna "exceso"
 * 
 * Si cantidad < 0 o es NaN. Se retorna null.
 * @param {number} cantidad Valor correspondiente a la cantidad de covers
 */
function claseSegunCantidad(cantidad)
{
    let result = null;
    if(cantidad < 0 || isNaN(cantidad)) return result; // Valor no valido return null
    if(cantidad === 0) result = "agotado";
    else if(cantidad > 0 && cantidad <= 5)    result = "escaso";
    else if(cantidad > 5 && cantidad <= 15)   result = "suficiente";
    else if(cantidad > 15 && cantidad <= 25)  result = "abundante";
    else result = "exceso";
    return result;
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
 * Agrega al local storage la información que fue leída del fichero data_covers.cvs
 * @param {String} data Texto con el formato #;COVER;PRECIO;CANTIDAD 
 * .Cada línea corresponde a un cover con la excepción de la linea c0 que 
 * es el encabezado de la tabla. 
 */    
function saveToLocalStorage(data)  
{
    const todasFilas = data.split(/\r?\n|\r/); // Separando el texto por filas
    for (let f = 0; f < todasFilas.length; f++)
    {
        let aux = todasFilas[f].split(";");        
        const llave =  aux[0]; // La llave del producto es el primer valor que aparece en el fichero
        llaves.push(llave);  
        const valor = todasFilas[f];
        localStorage.setItem(llave,valor);
    }    
    let parteNumericaLlave = parseInt(llaves[llaves.length-1].substring(1)); // Obteniendo la parte numerica de la ultima llava eje: c17 ---> 17
    nextAvailableKey = "c" + (parteNumericaLlave + 1); // Si la ultima llave almacenada es c20, la proxima sera c21
    crearTabla();
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
    let fileName = "data_covers.csv";
    exportar(data, fileName);
}

/** 
 * @returns Devuelve el contenido del localStorage en forma de string con los cambios de línea incluidos como
 * caracteres \n. Se sigue el formato LLAVE;COVER;PRECIO;CANTIDAD de fichero data_covers.csv. Se muestran los 
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
    nextAvailableKey = "c0";
    let tabla = document.getElementById("tabla");
    let nodeTbody = tabla.querySelector("tbody");
    if(nodeTbody !== null) nodeTbody.remove(); // Si existe eliminar el nodo <tbody>    
}

function editarCover()
{
    let fila = parseInt(prompt("Inserte el Número del producto a editar: ")); // Como hay un encabezado en la tabla el valor coincide con la fila    
    if(isNaN(fila) || (fila<1) || (fila >= llaves.length)) // Validando fila, que sea un numero   1 <= n < llaves.length. Resuelve problema al eliminar
    {
        alert(`¡Número de cover incorrecto!\nIntroduzca un valor entre 1 y ${llaves.length-1}.`);
        return;
    }
    let opcion = parseInt(prompt("¿Qué valor desea editar? 1-COVER 2-PRECIO 3-CANTIDAD")); // La opcion coincide con la columna
    if(isNaN(opcion) || opcion<1 || opcion>3) // Validando opcion
    {
        alert("¡Valor incorrecto!\nIntroduzca un valor entre 1 y 3");
        return;
    }
    let celdasCover = document.getElementById("tabla").rows[fila].cells; // Obteniendo todas las celdas de la fila
    let llave = "c" + fila; // Las llaves de los covers comienzan con "c"
    let opcion_name = "";
    switch (opcion) {
        case 1:
            opcion_name = "COVER";
            break;
        case 2:
            opcion_name = "PRECIO";
            break;
        case 3:
            opcion_name = "CANTIDAD"; 
            break;   
        default:
            opcion_name = null;
            alert("Valor de OPCION no válido");
            break;
    }
    let valor = prompt(`Inserte nuevo valor de ${opcion_name}: `);
    if(opcion === 1 && valor === "") // Validando el nuevo valor de COVER.
    {
        alert("¡El nombre del COVER NO puede estar VACÍO!");
        return;
    }
    if(opcion === 2) // Validando el nuevo valor de PRECIO
    {
        valor = parseInt(valor); // PRECIO como valor entero
        if(isNaN(valor) || valor<0)
        {
            alert("¡El PRECIO debe ser un número y debe ser positivo!");
            return;
        }
    }
    if(opcion === 3) // Validando el nuevo valor de CANTIDAD
    {
        valor = parseInt(valor); // CANTIDAD como valor entero
        if(isNaN(valor) || valor<0)
        {
            alert("¡La CANTIDAD deve ser un número y debe ser positivo!");
            return;
        }
    }
    // Modificando solamente el nodo a editar y no toda la tabla en si. Actualizar el localStorage
    celdasCover[opcion].innerHTML = valor;
    let aux = "c" + celdasCover[0].innerHTML + ";" + celdasCover[1].innerHTML + ";" + celdasCover[2].innerHTML + ";" + celdasCover[3].innerHTML; // Dando formato
    localStorage[llave] = aux;  
    location.reload();    
}

/**
 * Crea un nuevo cover y lo agrega al local storage en el formato #;COVER;PRECIO;CANTIDAD 
 */
function nuevoCover()
{    
    let nombre = prompt("Inserte el Nombre del Cover: ");
    if(nombre === "" || nombre === null)
    {
        alert("El nombre NO puede ser vacío");
        return;
    }
    let precio = parseInt(prompt(`Inserte el Precio del cover ${nombre}: `));
    if(isNaN(precio) || precio<0)
    {
        alert("¡El PRECIO debe ser un número y debe ser positivo!");
        return;
    }
    let cantidad = parseInt(prompt(`Inserte la CANTIDAD de covers de ${nombre}:`)); 
    if(isNaN(cantidad) || cantidad<0)
    {
        alert("¡La cantidad debe ser un número y debe ser positivo!");
        return;
    }
    let llave = nextAvailableKey;
    llaves.push(llave); // Agregando al array la nueva llave
    let parteNumericaLlave = parseInt(llave.substring(1)); // En la posicion 0 esta "c"
    nextAvailableKey = "c" + (++parteNumericaLlave); // Se incrementa primero el valor y luego se le preconcatena "c"
    
    let valor = `${llave};${nombre};${precio};${cantidad}`;
    localStorage.setItem(llave,valor);
    //iniciar();
    location.reload();
}

/**
 * Elimina el n-ésimo cover
 * @param {number} n Número del cover a eliminar
 */
function eliminarCover(n)
{
    let fila = parseInt(prompt(`Inserte el Número del cover a ELIMINAR.\nEl Número debe estar entre 0 y ${llaves.length-1}`)); // Como hay un encabezado en la tabla el valor coincide con la fila    
    let key = "c" + fila;
    let indexFila = llaves.indexOf(key); // Indice del elto a eliminar. Si no existe el elto devuelve -1
    if(isNaN(fila) || (fila<1) || (fila>=llaves.length) || indexFila === -1) // Validando fila
    {
        alert("¡Número de cover incorrecto!\nNO es posible eliminar");
        return;
    }
    localStorage.removeItem(key); // Eliminando producto del storage
    
    llaves.splice(indexFila,1); // Eliminando la llave "fila" de "llaves[]""
    location.reload();
    // iniciar();
}