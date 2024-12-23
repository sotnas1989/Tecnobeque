var llaves = new Array(); // Almacena las llaves de los eltos que hay en el localStorage. Muy útil luego de eliminar un producto
var nextAvailableKey = 1; // Almacena el proximo valor llave para una futura adicion de producto.

//  MANIPULACION DEL DOM. Agrega los eventos a los elementos HTML.
let inputArchivo = document.querySelector('.archivo');
inputArchivo.addEventListener('change', leerFichero, false); // Evento change del input file tabla arriba
const botonArchivo = document.getElementsByClassName("buttonArchivo");
botonArchivo[0].addEventListener('click', abrirChooseFile, false);
botonArchivo[1].addEventListener('click', abrirChooseFile, false);

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

function abrirChooseFile() {
    inputArchivo.click();
}

// CONFIGURANDO EVENTOS de los botones MODAL 'Editar Producto'
const modalEditProd = document.getElementById('modalEditProd');

// Boton Cancelar
const btnCancelarEditProd = document.getElementById('btnCancelarModEditProd');
btnCancelarEditProd.addEventListener('click', () => {
    modalEditProd.close();
});

// Boton Aceptar del MODAL Editar Producto
const btnAceptarEditProd = document.getElementById('btnAceptarModEditProd');
btnAceptarEditProd.addEventListener('click', () => {
    // Accediendo a la llave del producto representado en el modal
    let key = modalEditProd.getAttribute('llave');
    const prod = document.getElementById('nombProdModalEdit');
    const precio = document.getElementById('precProdModalEdit');
    const descrip = document.getElementById('descrProdModalEdit');
    if (prod.value === '') {
        alert('¡Nombre de producto NO puede ser VACÍO!');
        // return; // Fin de ejecución
    }
    else {
        // Salvando data en el localStorage
        let data = `${key};${prod.value};${precio.value};${descrip.value}`;
        localStorage[key] = data;
        // Salvando nuevos datos al DOM
        const tdLista = document.querySelectorAll('tbody tr td:first-child');
        for (const td of tdLista) {
            if (td.textContent === key) {
                // Accediendo a toda la fila (nodo padre)
                const tr = td.parentElement;
                // Escribiendo campos del modal a su fila en la tabla
                tr.children[1].textContent = prod.value;
                tr.children[2].textContent = precio.value;
                tr.children[3].textContent = descrip.value;
                break;
            }
        }
        modalEditProd.close();
        // location.reload(); // Recargar pagina para visualizar los cambios
    }
});

// Boton Eliminar del MODAL Editar Producto
const btnEliminar = document.getElementById('btnEliminarModEdit');
btnEliminar.addEventListener('click', () => {
    // Accediendo a la llave del producto representado en el modal como atributo
    let key = parseInt(modalEditProd.getAttribute('llave')); // llave hecha numero
    // Indice de la llave a eliminar del arrego de llaves. Si no existe el elto devuelve -1
    let indexLlave = llaves.indexOf(key);
    if (isNaN(key) || (key < 1) || indexLlave === -1) // Validando key
    {
        alert("¡Número de producto incorrecto!\nNO es posible eliminar");
        return;
    }
    if (confirm(`¿Desea ELIMINAR el Producto #${key}?`)) {
        // Eliminando producto del storage
        localStorage.removeItem(key);        
        llaves.splice(indexLlave, 1);
        // Eliminando nodo del DOM
        const tdLista = document.querySelectorAll('tbody tr td:first-child');
        for (const td of tdLista) {            
            if (td.textContent === key.toString()) {
                // Accediendo a toda la fila (nodo padre)
                const tr = td.parentElement;                
                tr.parentElement.removeChild(tr); // Eliminando producto del DOM. No reload de pagina
                break;
            }
        }
        modalEditProd.close();
        // location.reload();
    }
});

//********  Configurando Eventos de botones MODAL NUEVO PRODUCTO
const modalNuevoP = document.getElementById('modalNuevoProd');

// Boton Cancelar
const btnCancelarNuevoP = document.getElementById('btnCancelarModNewProd');
btnCancelarNuevoP.addEventListener('click', ()=> {
    modalNuevoP.close();
});

// Boton Aceptar del MODAL NUEVO PRODUCTO
const btnAceptNuevProd = document.getElementById('btnAceptarModNewProd');
btnAceptNuevProd.addEventListener('click', ()=> {
    const prod = document.getElementById('nombProdModalNuevo');
    const precio = document.getElementById('precProdModalNuevo');
    const descrip = document.getElementById('descrProdModalNuevo');
    if (prod.value === '') {
        alert('¡Nombre de producto NO puede ser VACÍO!');
        // return; // Fin de ejecución
    }
    else {
        // Salvando data en el localStorage
        let key = nextAvailableKey; // Ayuda a la hora de programar evento click mantener un ambito local
        let data = `${key};${prod.value};${precio.value};${descrip.value}`;
        localStorage[key] = data;
        // Salvando nuevos datos al DOM
        // Creando fila <tr>
        const trNuevoP = document.createElement('tr');
        // Creando celdas <td>
        const tdLlave = document.createElement('td');
        const tdNombre = document.createElement('td');
        const tdPrecio = document.createElement('td');
        const tdDescrip = document.createElement('td');
        // Llenando celdas
        tdLlave.textContent = key;
        tdNombre.textContent = prod.value;
        tdPrecio.textContent = precio.value;
        tdDescrip.textContent = descrip.value;
        // Agregando celdas a la fila
        trNuevoP.appendChild(tdLlave);
        trNuevoP.appendChild(tdNombre);
        trNuevoP.appendChild(tdPrecio);
        trNuevoP.appendChild(tdDescrip);
        // Agregando evento click de fila (Mostrar Modal Editar Prod)
        trNuevoP.addEventListener('click', () => {
            // console.log(localStorage[key], `\nkey: ${key} type: ${typeof key}`);
            let celdasFila = localStorage[key.toString()].split(';'); // IMPORTANTE. PARA QUE NO SE QUEDE CON INFO VIEJA
            const textoH2 = modalEditProd.querySelector('h2');
            const prod = document.getElementById('nombProdModalEdit');
            const precio = document.getElementById('precProdModalEdit');
            const descrip = document.getElementById('descrProdModalEdit');
            // Llenando modal con info del producto
            let llaveProd = celdasFila[0];
            // Agregando nuevo atributo al modal. Facilita el salvar info al localStorage
            modalEditProd.setAttribute("llave", llaveProd);
            textoH2.textContent = `Editar Producto #${llaveProd}`; // Agregando #prod al modal
            prod.value = celdasFila[1];
            precio.value = celdasFila[2];
            descrip.value = celdasFila[3];
            modalEditProd.showModal();
        });
        // Agregando fila al <tbody>
        let tBody = document.querySelector("tbody");
        if(tBody === null) { // Esta vacio el tbody
            tBody = document.createElement("tbody");
            const tabla = document.getElementById("tabla");
            tabla.append(tBody);
        }
        tBody.appendChild(trNuevoP);
        // Si esta vacio las llaves insertar primero la llave 0
        if(llaves.length === 0) {
            llaves.push(0);
            localStorage.setItem("0", "0;PRODUCTO;PRECIO (CUP);DESCRIPCIÓN");
            // Ocultando botones 'Abrir Archivo'
            botonArchivo[0].hidden = true;
            botonArchivo[1].hidden = true;
        } 
        llaves.push(key); // Agregando llave del nuevo producto
        nextAvailableKey++; // Actualizando key para futuro prod
        // Limpiando inputs del modal para una futura insercion
        prod.value = "";
        precio.value = "";
        descrip.value = "";
        modalNuevoP.close();
    }
    
});


/**
 * Crea el nodo <tbody> a partir de la data que que se encuentra en el localStorage y lo agrega a <table>
 */
function crearTabla() {
    if (localStorage.getItem("0") === null) // Si el localStorage no tiene los datos de los productos
    {
        alert("¡Datos no cargados!\nPor favor carge el archivo: data.csv");
        console.log(`Local storage sin datos de productos!\n llaves[]: ${llaves}`);
        return; // Termina la ejecución. Sin datos no tiene sentido hacer mas
    }
    const tabla = document.getElementById("tabla");
    const tBody = document.createElement("tbody");
    // Recorriendo las llaves 
    for (let i = 1; i < llaves.length; i++) // Se empieza en 1 porque el 0 es el th
    {
        let key = llaves[i];
        let celdasFila = localStorage[key].split(';');  // Acediendo a todas las celdas de la fila
        const tr = document.createElement("tr"); // Creando elemento row
        for (let rowCell = 0; rowCell < celdasFila.length; rowCell++) {
            const td = document.createElement("td"); // Create new cell
            td.textContent = celdasFila[rowCell];
            tr.appendChild(td); // Adding cell to row
        }
        // Agregando evento click de fila (Mostrar Modal Editar Prod)
        tr.addEventListener('click', () => {
            celdasFila = localStorage[key].split(';'); // IMPORTANTE. PARA QUE NO SE QUEDE CON INFO VIEJA
            const textoH2 = modalEditProd.querySelector('h2');
            const prod = document.getElementById('nombProdModalEdit');
            const precio = document.getElementById('precProdModalEdit');
            const descrip = document.getElementById('descrProdModalEdit');
            // Llenando modal con info del producto
            let llaveProd = celdasFila[0];
            // Agregando nuevo atributo al modal. Facilita el salvar info al localStorage
            modalEditProd.setAttribute("llave", llaveProd);
            textoH2.textContent = `Editar Producto #${llaveProd}`; // Agregando #prod al modal
            prod.value = celdasFila[1];
            precio.value = celdasFila[2];
            descrip.value = celdasFila[3];
            modalEditProd.showModal();
        });
        tBody.appendChild(tr); // Agregando row
    }
    tabla.appendChild(tBody); // Agregando tbody a la la tabla       
}

function leerFichero(evt) {
    let file = evt.target.files[0];
    let reader = new FileReader();
    reader.onload = (e) => {
        // Cuando el archivo se terminó de cargar
        let fileText = e.target.result; // Texto del fichero data.csv
        saveToLocalStorage(fileText); // Actualizando localStorage con la nueva información        

        // location.reload();
        //crearTabla(e.target.result)
    };
    // Leemos el contenido del archivo seleccionado
    if(file) reader.readAsText(file); // el if garantiza que file no sea undefined
}

/**
 * Agrega al local storage la información que fue leída del fichero data.cvs
 * @param {String} data Texto con el formato #;NOMBRE;PRECIO;DESCRIPCION 
 * .Cada línea corresponde a un producto con la excepción de la linea índice 0 que 
 * es el encabezado de la tabla. 
 */
function saveToLocalStorage(data) {
    const todasFilas = data.split(/\r?\n|\r/); // Separando el texto por filas
    for (let f = 0; f < todasFilas.length; f++) {
        let aux = todasFilas[f].split(";");
        let llave = aux[0]; // La llave del producto es el primer valor que aparece en el fichero
        llave = parseInt(llave);
        // Si llave no es numerica, no la agrego
        if (!isNaN(llave)) {
            llaves.push(llave);
            const valor = todasFilas[f];
            localStorage.setItem(llave, valor);
        }
        else {
            alert('Archivo NO VALIDO.\nPor favor abrir:   Tecnobeque/data.csv');
            return; // FINAL. El fichero no es el correcto
        }
    }
    // Archivo Cargado Exitosamente. Se ocultan los botones 'Abrir Archivo'
    botonArchivo[0].hidden = true;
    botonArchivo[1].hidden = true;
    nextAvailableKey = llaves[llaves.length - 1] + 1; // Si la ultima llave almacenada es 20, la proxima sera 21
    crearTabla();
}

/**
 * Crea un nuevo producto y lo agrega al final del local storage en el formato nombre;precio;descripción 
 */
function nuevoProducto() {
    const modalNuevoP = document.getElementById("modalNuevoProd");
    modalNuevoP.showModal();
}

function vaciarLocalStorage() {
    if (llaves.length === 0) {
        alert("La tabla se encuentra ya VACÍA");
        return;
    }
    if (confirm("¿Está usted seguro de VACIAR LA TABLA?\nLos datos se PERDERAN PERMANENTEMENTE.")) {
        botonArchivo[0].hidden = false;
        botonArchivo[1].hidden = false;
        // Por cada llave de producto eliminarla del localStorage
        llaves.forEach(key => {
            localStorage.removeItem(key);
        });
        llaves = new Array();
        nextAvailableKey = 1;
        let tabla = document.getElementById("tabla");
        let nodeTbody = tabla.querySelector("tbody");
        if (nodeTbody !== null) nodeTbody.remove(); // Si existe eliminar el nodo <tbody>
    }
        
}

/** 
 * @returns Devuelve el contenido del localStorage en forma de string con los cambios de línea incluidos como
 * caracteres \n. Se sigue el formato LLAVE;PRODUCTO;PRECIO;DESCRIPCION de fichero data.csv. Se muestran los 
 * productos ordenados descendentemente segun su llave, ya que el localStorage muestra la información desordenada
 */
function localStorageToString() {
    let result = "";
    for (let index = 0; index < llaves.length; index++) {
        let key = llaves[index];
        if (index === 0) result = localStorage[key]; // Agrego la primera linea
        else result += "\n" + localStorage[key];  // Agrego un cambio de linea y luego la proxima linea
    }
    return result;
}

/**
 * Exporta la información de un string a un fichero de texto. El fichero se guarda en la carpeta "Downloads"
 * @param {string} data Texto a exportar
 * @param {string} fileName Nombre del fichero resultado de la exportación
 */
function exportar(data, fileName) {
    const a = document.createElement("a");
    const contenido = data,
        blob = new Blob([contenido], { type: "octet/stream" }),
        url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
}

function exportar2() {
    if (localStorage.length === 0) // LocalStorage Vacío
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
function iniciar() {
    if (localStorage.getItem("0") !== null)  // Si el localStorage contiene las llaves de productos (la llave 0 de los productos existe en el localStorage)
    {
        // inputArchivo[0].hidden = true; 
        // inputArchivo[1].hidden = true;

        // Ya existen datos en el local storage. Se oculta los botones del cargar fichero
        botonArchivo[0].hidden = true;
        botonArchivo[1].hidden = true;

        if (llaves.length === 0) // Si llaves vacio. Llenarlo
        {
            let key;
            for (let i = 0; i < localStorage.length; i++) {
                key = parseInt(localStorage.key(i));
                if (!isNaN(key)) llaves.push(key);   // Muy necesario ya que a veces el localStorage agrega sus propias k,v               
            }
            llaves.sort((a, b) => a - b); // Ordenando el array ya que las llaves en el localStorage se guardan sin orden
        }
        nextAvailableKey = llaves[llaves.length - 1] + 1; // Si la ultima llave almacenada es 20, la proxima sera 21
        crearTabla();
    }
    else // LocalStorage no tiene los datos de los productos
    {
        // inputArchivo[0].hidden = false;
        // inputArchivo[1].hidden = false;
        botonArchivo[0].hidden = false;
        botonArchivo[1].hidden = false;
        llaves = new Array(); // Inizializa el array dejando atras viejos valores   
        nextAvailableKey = 1; // Como el localStorage esta vacio el proximo elto tendrá llave 0     
    }
}
