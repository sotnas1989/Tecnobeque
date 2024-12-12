var llaves = new Array(); // Almacena las llaves de los eltos que hay en el localStorage. Muy útil luego de eliminar un producto
var nextAvailableKey = "c1"; // Almacena el proximo valor llave para una futura adicion de cover.

//  MANIPULACION DEL DOM. Agrega los eventos a los elementos HTML.
let inputArchivo = document.querySelector('.archivo');
inputArchivo.addEventListener('change', leerFichero, false); // Evento change del input file tabla arriba
const botonArchivo = document.getElementsByClassName("buttonArchivo");
botonArchivo[0].addEventListener('click', abrirChooseFile, false);
botonArchivo[1].addEventListener('click', abrirChooseFile, false);

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
 * Abre la ventana de abrir archivo
 */
function abrirChooseFile() {
    inputArchivo.click();
}

// ******* CONFIGURANDO EVENTOS de los botones MODAL 'Editar Cover'
const modalEditCov = document.getElementById('modalEditCov');

// Input precio de cover
const inputPrecio = document.getElementById('precCovModalEdit');
inputPrecio.addEventListener('input', ()=> {
    // Usando regex para validar el valor del input
    inputPrecio.value = inputPrecio.value.replace(/[^0-9]/g, '');
});

// Input cantidad de covers
const inputCant = document.getElementById('cantCovModalEdit');
inputCant.addEventListener('input', ()=> {
    // Usando regex para validar el valor del input
    inputCant.value = inputCant.value.replace(/[^0-9]/g, '');
});

// Boton Cancelar
const btnCancelarEditCov = document.getElementById('btnCancelarModEdit');
btnCancelarEditCov.addEventListener('click', () => {
    modalEditCov.close();
});

// Boton Aceptar del MODAL Editar Cover
const btnAceptarEdit = document.getElementById('btnAceptarModEdit');
btnAceptarEdit.addEventListener('click', () => {
    // Accediendo a la llave del cover representado en el modal
    let key = modalEditCov.getAttribute('llave');
    const nombCover = document.getElementById('covModalEdit');
    const precio = document.getElementById('precCovModalEdit');
    const cantidad = document.getElementById('cantCovModalEdit');
    if (nombCover.value === '') {
        alert('¡Nombre de cover NO puede ser VACÍO!');
        return; // Fin de ejecución
    }
    if(precio.value === '') {
        alert('Precio de cover NO puede ser VACÍO');
        return;
    }
    if(cantidad.value === '') {
        alert('Cantidad de cover NO puede ser VACÍA');
        return;
    }
    // Salvando data en el localStorage
    let data = `${key};${nombCover.value};${precio.value};${cantidad.value}`;
    localStorage[key] = data;
    // Salvando nuevos datos al DOM
    const tdLista = document.querySelectorAll('tbody tr td:first-child');
    for (const td of tdLista) {
        if (`c${td.textContent}` === key) // Concantenando 'c' para que coincida con la llave
        {
           // Accediendo a toda la fila (nodo padre)
           const tr = td.parentElement;
           // Escribiendo campos del modal a su fila en la tabla
           tr.children[1].textContent = nombCover.value;
           tr.children[2].textContent = precio.value;
           tr.children[3].textContent = cantidad.value;
           if(cantidad.value === "0")  tr.setAttribute("class", "coverAgotado");    
           else tr.removeAttribute("class");
           let clase = claseSegunCantidad(parseInt(cantidad.value));
           tr.children[3].setAttribute("class", clase);
           break;
        }
    }
    modalEditCov.close(); 
});

// Boton Eliminar del MODAL Editar Cover
const btnEliminar = document.getElementById('btnEliminarModEdit');
btnEliminar.addEventListener('click', () => {
    // Accediendo a la llave del producto representado en el modal como atributo
    let key = modalEditCov.getAttribute('llave'); // llave con formato c# ejemplo c3
    // Indice de la llave a eliminar del arrego de llaves. Si no existe el elto devuelve -1
    let indexLlave = llaves.indexOf(key);
    if (indexLlave === -1) // No existe la llave
    {
        alert("¡Número de cover incorrecto!\nNO es posible eliminar");
        return;
    }
    if (confirm(`¿Desea ELIMINAR el Cover #${key.substring(1)}?`)) {
        // Eliminando cover del storage
        localStorage.removeItem(key);        
        llaves.splice(indexLlave, 1);
        // Eliminando nodo del DOM
        const tdLista = document.querySelectorAll('tbody tr td:first-child');
        for (const td of tdLista) {            
            if (`c${td.textContent}` === key) {
                // Accediendo a toda la fila (nodo padre)
                const tr = td.parentElement;                
                tr.parentElement.removeChild(tr); // Eliminando producto del DOM. No reload de pagina
                break;
            }
        }
        modalEditCov.close();
    }
});

// ***** Configurando EVENTOS MODAL NUEVO COVER
const modalNuevCov = document.getElementById('modalNuevoCover');

// Input precio del nuevo cover
const inputPrecNewCov = document.getElementById('precCovModalNuevo');
inputPrecNewCov.addEventListener('input', ()=> {
    // Usando regex para validar el valor del input
    inputPrecNewCov.value = inputPrecNewCov.value.replace(/[^0-9]/g, '');
});

// Input cantidad de covers
const inputCantNewCov = document.getElementById('cantCovModalNuevo');
inputCantNewCov.addEventListener('input', ()=> {
    // Usando regex para validar el valor del input
    inputCantNewCov.value = inputCantNewCov.value.replace(/[^0-9]/g, '');
});


// Boton Cancelar
const btnCancelarNuevCov = document.getElementById('btnCancelarModNuevo');
btnCancelarNuevCov.addEventListener('click', ()=> {
    modalNuevCov.close();
});

// Boton Aceptar del MODAL NUEVO COVER
const btnAceptNuevCov = document.getElementById('btnAceptarModNuevo');
btnAceptNuevCov.addEventListener('click', ()=> {
    let key = nextAvailableKey;
    const cover = document.getElementById('covModalNuevo');
    const precio = document.getElementById('precCovModalNuevo');
    const cantidad = document.getElementById('cantCovModalNuevo');
    if(cover.value === '') {
        alert('¡Nombre de cover NO puede ser VACÍO!');
        return; // Fin de ejecución
    }
    if(precio.value === '') {
        alert('Precio de cover NO puede ser VACÍO');
        return;
    }
    if(cantidad.value === '') {
        alert('Cantidad de cover NO puede ser VACÍA');
        return;
    }
    //  AGREGANDO NUEVO COVER AL DOM
    const nuevoCover = document.createElement('tr');
    // Columna llave
    const tdKey = document.createElement('td');
    tdKey.textContent = key.substring(1);
    nuevoCover.appendChild(tdKey);
    // Columna Nombre
    const tdNombre = document.createElement('td');
    tdNombre.textContent = cover.value;
    nuevoCover.appendChild(tdNombre);
    // Columna Precio
    const tdPrecio = document.createElement('td');
    tdPrecio.textContent = precio.value;
    nuevoCover.appendChild(tdPrecio);
    // Columna Cantidad
    const tdCant = document.createElement('td');
    let cant = parseInt(cantidad.value);
    tdCant.textContent = cant;
    tdCant.setAttribute('class', claseSegunCantidad(cant));
    nuevoCover.append(tdCant);
    // Columna boton -
    const tdMenos = document.createElement('td');
    const btnMenos = document.createElement('button');
    btnMenos.textContent = '-';
    btnMenos.setAttribute('class', 'decremento');
    tdMenos.appendChild(btnMenos);
    nuevoCover.appendChild(tdMenos);
    // Columna boton +
    const tdMas = document.createElement('td');
    const btnMas = document.createElement('button');
    btnMas.textContent = '+';
    btnMas.setAttribute('class', 'incremento');
    tdMas.appendChild(btnMas);
    nuevoCover.appendChild(tdMas);
    // AGREGANDO EVENTOS botones - + y al <tr> nuevoCover
    agregarEventosBtnMenos(nuevoCover, btnMenos, key);
    agregarEventosBtnMas(nuevoCover,btnMas,key);
    agregarEventosFila(nuevoCover, key);
    // nuevoCover.addEventListener('click', agregarEventosCover);

    // Agregando nuevo cover al tbody
    let tbody = document.querySelector('#tabla tbody');
    if(tbody === null) { // Esta vacio el tbody
        tbody = document.createElement("tbody");
        const tabla = document.getElementById("tabla");
        tabla.append(tbody);
    }
    tbody.appendChild(nuevoCover);

    // Si esta vacio las llaves insertar primero la llave c0     
    if(llaves.length === 0) {
        llaves.push("c0");
        localStorage.setItem("c0", "c0;COVER;PRECIO (CUP);CANTIDAD");
        // Ocultando botones 'Abrir Archivo'
        botonArchivo[0].hidden = true;
        botonArchivo[1].hidden = true;
    }
    llaves.push(key); // Agregando al array la nueva llave
    let parteNumericaLlave = parseInt(key.substring(1)); // En la posicion 0 esta "c"
    nextAvailableKey = "c" + (++parteNumericaLlave); // Se incrementa primero el valor y luego se le preconcatena "c"
    // Salvando data en el localStorage
    let valor = `${key};${cover.value};${precio.value};${cant}`;
    localStorage.setItem(key,valor);    
    
    modalNuevCov.close();
});

/**
 * 
 * @param {HTMLTableRowElement} nuevoCover Fila del nuevo cover en la tabla
 * @param {HTMLButtonElement} btnMenos Boton - en la tabla
 * @param {string} key Llave del nuevo cover en la tabla 
 */
function agregarEventosBtnMenos(nuevoCover, btnMenos, key) {
    btnMenos.addEventListener('click', (evt)=> {
        evt.stopPropagation();
        let celdas = nuevoCover.cells;
        let cover = celdas[1].textContent; // Nombre del cover
        let precio = celdas[2].textContent; // Precio del cover
        let cantidad = parseInt(celdas[3].textContent);
        if(cantidad > 0) {
            // cantidad--;
            localStorage[key] = `${key};${cover};${precio};${--cantidad}`;
            celdas[3].textContent = cantidad; // Actualizando la celda cantidad con el nuevo valor
            // Actualizando el color de celda cantidad
            let clase = claseSegunCantidad(cantidad);                
            celdas[3].setAttribute("class", clase);
            // El cover se agotó
            if(cantidad === 0) {
                nuevoCover.setAttribute("class","coverAgotado"); // Agregando la clase para que en el CSS se sombree toda esa fila
            }
        }
        else // Cantidad es 0
        {
            alert("Cover AGOTADO!\nImposible decrementar");
        }
    });
}

/**
 * 
 * @param {HTMLTableRowElement} nuevoCover Fila del nuevo cover en la tabla
 * @param {HTMLButtonElement} btnMas Boton + en la tabla
 * @param {string} key Llave del nuevo cover en la tabla 
 */
function agregarEventosBtnMas(nuevoCover, btnMas, key) {
    btnMas.addEventListener('click', (evt) => {
        evt.stopPropagation();
        let celdas = nuevoCover.cells;
        let cover = celdas[1].textContent; // Nombre del cover
        let precio = celdas[2].textContent; // Precio del cover
        let cantidad = parseInt(celdas[3].textContent);
        if (cantidad === 0) nuevoCover.removeAttribute("class", "coverAgotado"); // Se elimina el sombreado rojo de la fila
        // cantidad++;
        localStorage[key] = `${key};${cover};${precio};${++cantidad}`;
        celdas[3].textContent = cantidad; // Actualizando la celda cantidad con el nuevo valor
        // Actualizando el color de celda cantidad
        let clase = claseSegunCantidad(cantidad);
        celdas[3].setAttribute("class", clase);
    });
}

/**
 * Agrega el evento 'click' en la tabla para el nuevo cover.
 * @param {HTMLTableRowElement} nuevoCover Fila de la tabla que contiene los datos del nuevo cover
 * @param {string} key Llave del nuevo cover.
 */
function agregarEventosFila(nuevoCover, key) {
    nuevoCover.addEventListener('click', () => {
        const celdas = nuevoCover.cells;
        const textoH2 = modalEditCov.querySelector('h2');
        const cover = document.getElementById('covModalEdit');
        const precio = document.getElementById('precCovModalEdit');
        const cantidad = document.getElementById('cantCovModalEdit');
        // Agregando nuevo atributo al modal. Facilita el salvar info al localStorage
        modalEditCov.setAttribute("llave", key);
        // Llenando modal con info del producto
        textoH2.textContent = `Editar Cover #${key.substring(1)}`; // Agregando #cov al modal
        cover.value = celdas[1];
        precio.value = celdas[2];
        cantidad.value = celdas[3];
        modalEditCov.showModal();
    });
}

/**
 * Carga e inicializa los datos. 
 */
function iniciar()
{        
    if(localStorage.getItem("c0") !== null)  // Si el localStorage contiene las llaves de productos (la llave 0 de los productos existe en el localStorage)
    {
        // Ya existen datos en el local storage. Se oculta los botones del cargar fichero
        botonArchivo[0].hidden = true;
        botonArchivo[1].hidden = true;

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
        // inputArchivo[0].hidden = false;
        // inputArchivo[1].hidden = false;
        botonArchivo[0].hidden = false;
        botonArchivo[1].hidden = false;
        llaves = new Array(); // Inizializa el array dejando atras viejos valores   
        nextAvailableKey = "c1"; // Como el localStorage esta vacio el proximo elto tendrá llave c1     
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
        
        let cantidad = parseInt(celdas[3].innerHTML); // Cantidad de unidades del tipo de cover de la fila f
        if(cantidad === 0) // El cover se agotó
        {
            filaActual.setAttribute("class","coverAgotado"); // Agregando la clase para que en el CSS se sombree toda esa fila
        }
        else filaActual.removeAttribute("class"); // El producto dejó de estar agotado
        
        // GESTION BOTON -
        let botonMenos = celdas[4].firstElementChild;        
        botonMenos.addEventListener("click", (ev)=>{              
            ev.stopPropagation(); // Evita que se ejecute el evento clic de la fila
            // Accediendo a datos actualizados
            let cover = celdas[1].innerHTML; // Nombre del cover
            let precio = celdas[2].innerHTML; // Precio del cover
            cantidad = parseInt(celdas[3].innerHTML);
            if(cantidad > 0)
            {                
                cantidad--;
                localStorage[key] = `${key};${cover};${precio};${cantidad}`;
                celdas[3].innerHTML = cantidad; // Actualizando la celda cantidad con el nuevo valor
                // Actualizando el color de celda cantidad
                let clase = claseSegunCantidad(cantidad);                
                celdas[3].setAttribute("class", clase);
                if(cantidad === 0) // El cover se agotó
                {
                    filaActual.setAttribute("class","coverAgotado"); // Agregando la clase para que en el CSS se sombree toda esa fila
                }                
            }
            else // Cantidad es 0
            {
                alert("Cover AGOTADO!\nImposible decrementar");
            }
        }) ;
        // GESTION BOTON +
        let botonMas = celdas[5].firstElementChild;            
        botonMas.addEventListener("click", (ev)=>{  
            ev.stopPropagation(); // Evita que se ejecute el evento clic de la fila
            // Accediendo a datos actualizados
            let cover = celdas[1].innerHTML; // Nombre del cover
            let precio = celdas[2].innerHTML; // Precio del cover
            cantidad = parseInt(celdas[3].innerHTML);
            cantidad++;
            localStorage[key] = `${key};${cover};${precio};${cantidad}`;
            celdas[3].innerHTML = cantidad; // Actualizando la celda cantidad con el nuevo valor
            // Actualizando el color de celda cantidad
            let clase = claseSegunCantidad(cantidad);                
            celdas[3].setAttribute("class", clase);
            if(cantidad === 1)
            {
                filaActual.removeAttribute("class"); // El producto dejó de estar agotado
            }            
        }) ;        
    }
}

/**
 * Crea el nodo TBODY a partir de la data que que se encuentra en el localStorage y lo agrega a TABLE
 */
function crearTabla() 
{   
    if(localStorage.getItem("c0") === null) // Si el localStorage no tiene los datos de los covers
    {
        alert("¡Datos no cargados!\nPor favor carge el archivo: data_covers.csv");
        console.log("Local storage sin datos de covers!\n llaves[]: " + llaves);
        return; // Termina la ejecución. Sin datos no tiene sentido hacer mas
    }
    const tabla = document.getElementById("tabla");
    const tBody = document.createElement("tbody");
    // Recorriendo las llaves 
    for (let i = 1; i < llaves.length; i++) // Se empieza en 1 porque el 0 es el encabezado de tabla
    {
        let key = llaves[i];
        let celdasFila = localStorage[key].split(';');  // Acediendo a todas las celdas de la fila
        const tr = document.createElement("tr"); // Creando elemento row
        for (let rowCell = 0; rowCell < celdasFila.length; rowCell++)
         {
            const td = document.createElement("td"); // Create new cell
            if(rowCell === 0) td.textContent = celdasFila[0].substring(1); // Quitando la 'c' de "c1"
            else td.textContent = celdasFila[rowCell]; // Agregando el valor
            if(rowCell === 3) // Agregando el atributo class en dependencia del valor de cantidad
            {
                let cantidad = parseInt(celdasFila[rowCell]); // Cantidad de unidades del cover en posicion "fila" 
                let clase = claseSegunCantidad(cantidad);
                td.setAttribute("class", clase);
                if(cantidad === 0) // Hay 0 covers de ese tipo
                {
                    tr.setAttribute("class", "coverAgotado"); // Garantiza el sombreado rojo de la fila por CSS
                }
            }        
            tr.appendChild(td); // Adding cell to row
        }
        // Agregando boton - de cantidad
        let tdAux = document.createElement("td");
        const btnDecre = document.createElement("button");
        btnDecre.textContent = "-";
        btnDecre.setAttribute("class", "decremento");
        tdAux.appendChild(btnDecre);
        tr.appendChild(tdAux);
        // Agregando boton + de cantidad
        tdAux = document.createElement("td");
        const btnIncre = document.createElement("button");
        btnIncre.textContent = "+";
        btnIncre.setAttribute("class", "incremento");
        tdAux.appendChild(btnIncre);
        tr.appendChild(tdAux);

        // Agregando evento click de fila (Mostrar Modal Editar Cover)
        tr.addEventListener('click', () => {           
            
            celdasFila = localStorage[key].split(';'); // IMPORTANTE. PARA QUE NO SE QUEDE CON INFO VIEJA
            const textoH2 = modalEditCov.querySelector('h2');
            const cover = document.getElementById('covModalEdit');
            const precio = document.getElementById('precCovModalEdit');
            const cantidad = document.getElementById('cantCovModalEdit');
            // Llenando modal con info del producto
            let llaveCov = celdasFila[0];
            // Agregando nuevo atributo al modal. Facilita el salvar info al localStorage
            modalEditCov.setAttribute("llave", llaveCov);
            textoH2.textContent = `Editar Cover #${llaveCov.substring(1)}`; // Agregando #cov al modal
            cover.value = celdasFila[1];
            precio.value = celdasFila[2];
            cantidad.value = celdasFila[3];
            modalEditCov.showModal();
        });
        tBody.appendChild(tr); // Agregando row
    }
    tabla.appendChild(tBody); // Agregando tbody a la la tabla        
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
      };
      // Leemos el contenido del archivo seleccionado
      if(file) reader.readAsText(file); // el if garantiza que file no sea undefined
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
        // Si la llave no es de cover (c#), no la agrego
        if(llave.includes('c')) 
        {
            llaves.push(llave);
            const valor = todasFilas[f];
            localStorage.setItem(llave, valor);
        }
        else{
            alert('Archivo NO VALIDO.\nPor favor abrir:   Tecnobeque/data_covers.csv');
            return; // FINAL. El fichero no es el correcto
        }
    }
    // Archivo Cargado Exitosamente. Se ocultan los botones 'Abrir Archivo'
    botonArchivo[0].hidden = true;
    botonArchivo[1].hidden = true;    
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
    // inputArchivo[0].hidden = false; // Visualizando nuevamente el input para que se pueda cargar el fichero data_covers.csv
    // inputArchivo[1].hidden = false;
    botonArchivo[0].hidden = false;
    botonArchivo[1].hidden = false;

    localStorage.clear();
    llaves = new Array();
    nextAvailableKey = "c1";
    let tabla = document.getElementById("tabla");
    let nodeTbody = tabla.querySelector("tbody");
    if(nodeTbody !== null) nodeTbody.remove(); // Si existe eliminar el nodo <tbody>    
}

/**
 * Muestra Modal Nuevo Cover
 */
function nuevoCover()
{   
    modalNuevCov.showModal();
}