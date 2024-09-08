document.addEventListener("DOMContentLoaded", () => {
    
    // Capturando la recarga o salida de la pagina
    window.addEventListener('beforeunload', (e) => {
        const mensajeConfirmacion = `¿Está usted seguro de salir o recargar la 
        página?\nToda la información acerca de los productos se perderá`;
        e.preventDefault(); // Previene la acción
        // e.returnValue = '';

    });

    const ventasDiv = document.querySelector(".ventas"); // Contenedor productos y servicios

    // Estableciendo Input Date con la fecha de hoy
    loadInputDate();

    /**
     * Asigna el input date con la fecha actual.
     */
    function loadInputDate() {
        const inputDate = document.querySelector('.input_date');
        const today = new Date();
        const year = today.getFullYear();
        // Meses se cuentan desde cero. Se completa cero a la izquierda
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        inputDate.value = `${year}-${month}-${day}`;
        // Asignando fecha a .sction_output h2
        const h2Resultado = document.querySelector(".sction_output h2");
        h2Resultado.textContent = `CUADRE ${day}/${month}/${year}`;
        // Agregando evento change. Para que se pueda seleccionar cualquier fecha
        inputDate.addEventListener("change", () => {
            let fechaNueva = inputDate.value + ""; // Tiene formato 2024-12-01
            let aux = fechaNueva.split("-");
            h2Resultado.textContent = `CUADRE ${aux[2]}/${aux[1]}/${aux[0]}`;
        });
    }

    ///////// CREANDO SUGERENCIAS DE AUTOCOMPLETADO /////////////////
    const sugerencias = [
        "Mica Cristal", "Hidrogel", "Cable V8", "Cable C",
        "Cable Iphone", "Cover"
    ];
    sugerencias.sort(); // Ordenando array alfabeticamente
    // Creando <datalist> y llenando con eltos de sugerencias
    const dataListSug = document.createElement("datalist");
    dataListSug.setAttribute("id", "listaProducto");
    // Creando nodos <option>
    sugerencias.forEach(element => {
        const option = document.createElement("option");
        option.value = element;
        dataListSug.appendChild(option); // Agregando options al datalist
    });

    // Agregando el datalist al al divVentas. Haciendo swap poniendo el datalis al inicio
    let aux = ventasDiv.children[0]; // Salvar Primer nodo producto
    ventasDiv.removeChild(aux); // Eliminarlo
    ventasDiv.appendChild(dataListSug); // Agregar datalist de primero
    ventasDiv.appendChild(aux); // volver a agregar el nodo



    // Agregando conectando el datalist con los inputs nombre_producto. Agregar atributo list
    const inputsNombre = document.querySelectorAll(".nombre_producto");
    for (const input of inputsNombre) {
        input.setAttribute("list", "listaProducto"); // Link con la datalist               
    }



    /**
     * Se programan los eventos de cada uno de los inputs pertenecientes al producto.
     * @param {HTMLDivElement} producto Div que representa un producto. Debe tener la clase "producto"
     */
    function addProductEvents(producto) {
        // Configurando eventos input: nombre, precio, inversion, ganancia        
        const precioInput = producto.querySelector('.precio_producto');
        const inversionInput = producto.querySelector('.inversion_producto');
        const gananciaInput = producto.querySelector('.ganancia_producto');

        // Valida segun el valor del precio, habilita la inversion y ganancia
        precioInput.addEventListener('input', () => {
            // Remove any non-numeric characters except for the decimal point
            precioInput.value = precioInput.value.replace(/[^0-9.]/g, '');
            // Si se llenó el input quitar la clase incompleto
            if(precioInput.value !== '' && precioInput.classList.contains('incompleto'))
            {
                precioInput.classList.remove('incompleto');
            }
            const precioValue = parseFloat(precioInput.value);
            if (!isNaN(precioValue) && precioValue > 0) {
                inversionInput.disabled = false;
                gananciaInput.disabled = false;
                // Limpiando inversion y ganancia al cambiar  precio
                inversionInput.value = '';
                gananciaInput.value = '';
                // estableciendo nuevos maximos
                inversionInput.max = `${precioValue}`;
                gananciaInput.max = `${precioValue}`;
            }
            else {
                inversionInput.disabled = true;
                gananciaInput.disabled = true;
                inversionInput.value = '';
                gananciaInput.value = '';
            }
        });

        // Verifica que inversion + ganancia = precio. Autocompleta valores
        inversionInput.addEventListener('input', () => {
            // Remove any non-numeric characters except for the decimal point
            inversionInput.value = inversionInput.value.replace(/[^0-9.]/g, '');
            // Si se llenó el input. quitar la clase incompleto
            if(inversionInput.value !== '' && inversionInput.classList.contains('incompleto'))
            {
                inversionInput.classList.remove('incompleto');
                gananciaInput.classList.remove('incompleto');
            }
            const maxInversion = parseFloat(inversionInput.max); // max
            const precioValue = parseFloat(precioInput.value);
            const inversionValue = parseFloat(inversionInput.value);
            if (!isNaN(precioValue) && !isNaN(inversionValue)) {
                // Evitar entrada de valores superiores al maximo
                if (inversionValue > maxInversion) {
                    inversionInput.value = maxInversion;
                    gananciaInput.value = 0;
                }
                else gananciaInput.value = precioValue - inversionValue;
            }
            else gananciaInput.value = '';
        });

        gananciaInput.addEventListener('input', () => {
            // Remove any non-numeric characters except for the decimal point
            gananciaInput.value = gananciaInput.value.replace(/[^0-9.]/g, '');
            // Si se llenó el input. quitar la clase incompleto
            if(gananciaInput.value !== '' && gananciaInput.classList.contains('incompleto'))
            {
                gananciaInput.classList.remove('incompleto');
                inversionInput.classList.remove('incompleto');
            }
            const maxGanancia = parseFloat(gananciaInput.max); // max
            const precioValue = parseFloat(precioInput.value);
            const gananciaValue = parseFloat(gananciaInput.value);
            if (!isNaN(precioValue) && !isNaN(gananciaValue)) {
                // Evitar entrada de valores superiores al maximo
                if (gananciaValue > maxGanancia) {
                    gananciaInput.value = maxGanancia;
                    inversionInput.value = 0;
                }
                else inversionInput.value = precioValue - gananciaValue;
            }
            else inversionInput.value = '';
        });

    }

    // Aplicando eventos al div producto por defecto del html
    addProductEvents(ventasDiv.querySelector(".producto"));


    //  Configurando boton Agregar Producto
    const btnAgregarProd = document.getElementById("btn_agregar_prod");
    btnAgregarProd.addEventListener("click", (ev) => {
        // CREANDO NUEVO PRODUCTO
        const newProduct = document.createElement("div");
        newProduct.setAttribute("class", "producto")

        // Creando input nombre_producto
        const nombre = document.createElement("input");
        nombre.type = "text";
        nombre.setAttribute("class", "nombre_producto");
        nombre.name = "nombre_producto";
        let cantProductos = ventasDiv.querySelectorAll(".producto").length;
        nombre.placeholder = `Producto${cantProductos === 0 ? "" : " " + (cantProductos + 1)}`;
        // Agregando input nombre_producto al nuevo producto
        newProduct.appendChild(nombre);
        // Agregando lista de sugerencias al input
        nombre.setAttribute("list", "listaProducto"); // Vincular input con la datalist

        // Creando input precio_producto
        const precio = document.createElement("input");
        precio.type = "number";
        precio.setAttribute("class", "precio_producto");
        precio.name = "precio_producto";
        precio.placeholder = "Precio";
        precio.min = "0";
        // Agregando input precio_producto al nuevo producto
        newProduct.appendChild(precio);

        // Creando input inversion_producto
        const inversion = document.createElement("input");
        inversion.type = "number";
        inversion.setAttribute("class", "inversion_producto");
        inversion.name = "inversion_producto";
        inversion.placeholder = "Inversión";
        inversion.min = "0";
        inversion.disabled = true;
        // Agregando input inversion_producto al nuevo producto
        newProduct.appendChild(inversion);

        // Creando input ganancia_producto
        const ganancia = document.createElement("input");
        ganancia.type = "number";
        ganancia.setAttribute("class", "ganancia_producto");
        ganancia.name = "ganancia_producto";
        ganancia.placeholder = "Ganancia";
        ganancia.min = "0";
        ganancia.disabled = true;
        // Agregando input ganancia_producto al nuevo producto
        newProduct.appendChild(ganancia);
        // newProduct.appendChild(dataListSug); // Agregar al nodo datalist al producto

        

        // Agregando el nuevo producto al contenedor 
        ventasDiv.appendChild(newProduct);

        // Aplicando eventos al nuevo producto
        addProductEvents(newProduct);
    });

    // Configurando boton "Agregar Servicio"
    const btnAgregarServicio = document.getElementById("btn_agregar_serv");
    btnAgregarServicio.addEventListener("click", (e) => {
        // Creando nuevo servicio
        const servicio = document.createElement("div");
        servicio.setAttribute("class", "servicio");
        // Creando input nombre
        const nombre = document.createElement("input");
        nombre.type = "text";
        nombre.setAttribute("class", "nombre_servicio");
        nombre.name = "nombre_servicio";
        nombre.placeholder = "Servicio";
        servicio.appendChild(nombre); // agregando a servicio
        // Creando input precio
        const precio = document.createElement("input");
        precio.type = "number";
        precio.setAttribute("class", "precio_servicio");
        precio.name = "precio_servicio";
        precio.placeholder = "Precio";
        precio.min = 0;
        servicio.appendChild(precio); // agregando a servicio
        // Aplicando Eventos al nuevo servicio
        addServiceEvents(servicio);
        // Agregando producto al ventasDiv
        ventasDiv.appendChild(servicio);
    });

    /**
     * Se programan los eventos de cada uno de los inputs pertenecientes al servicio.
     * @param {HTMLDivElement} servicio Representa un servicio. Debe tener la clase "servicio"
     */
    function addServiceEvents(servicio) {
        const precio = servicio.querySelector(".precio_servicio");
        // Validar el input precio usando expresiones regulares
        precio.addEventListener("input", () => {
            // Eliminar todos los caracteres no numéricos excepto el . decimal
            precio.value = precio.value.replace(/[^0-9.]/g, '');
            // Si se llenó el input. quitar la clase incompleto
            if(precio.value !== '' && precio.classList.contains('incompleto'))
            {
                precio.classList.remove('incompleto');
            }
        });

    }


    // Configurando boton "Eliminar Producto"
    const btnEliminar = document.getElementById("btn_eliminar");
    btnEliminar.addEventListener("click", (ev) => {
        if (ventasDiv.childElementCount > 1) { // > 1 porque el datalist siempre esta
            ventasDiv.removeChild(ventasDiv.lastElementChild);
        }
    });

    // Configurando boton Calcular
    const btnCalcular = document.getElementById("btn_calcular");
    btnCalcular.addEventListener("click", (ev) => {
        let totalCash = 0, inversion = 0, totalGanancia = 0; ganancia = 0;
        // Calculando Total en Cash. Sumando todos los precios de productos y servicios
        totalCash = sumatoriaPorClase(".precio_producto");
        let totalPorServicios = sumatoriaPorClase(".precio_servicio");
        totalCash += totalPorServicios;
        // Calculando Total Inversión. Sumando los valores de inversion
        inversion = sumatoriaPorClase(".inversion_producto");
        // Calculando Total Ganancia. Sumando todos los valores de ganancia
        totalGanancia = sumatoriaPorClase(".ganancia_producto");
        totalGanancia += totalPorServicios; // Servicios son ganancia
        // No hay campos vacios
    if ( typeof totalCash === "number" && typeof inversion === "number" && typeof totalGanancia === "number"  && typeof totalPorServicios === "number") { 
            ganancia = totalGanancia - sumatoriaGastos(); // Se restan los gastos al total ganancia
            // VISUALIZANDO VALORES EN EL HTML
            const spanTotalDinero = document.querySelector(".total_dinero span");
            spanTotalDinero.textContent = totalCash;
            const spanTotalInversion = document.querySelector(".total_inversion span");
            spanTotalInversion.textContent = inversion;
            const spanTotalGanancia = document.querySelector(".total_ganancia span");
            spanTotalGanancia.textContent = totalGanancia;
            const spanInversion = document.querySelector(".inversion span");
            spanInversion.textContent = inversion;
            const spanGanancia = document.querySelector(".ganancia span");
            spanGanancia.textContent = ganancia;
        }
        else { // Hay campos vacíos
            // alert("¡Hay información incompleta!\nPor favor llene todos los valores.");
            mostrarPopover("my-popover");
        }

        
    });

    /**
         * Dados un selector de clase de un input number y un selector de clase de 
         * un elemento span. Es posible acceder al contenedor de productos y sumar 
         * los valores de cada uno de esos inputs para obtener un total.
         * @param {string} selectorClase Selector de clase del tipo de input a sumar. 
         * Ejemplo: ".precio_producto"         
         * @returns {number | string} Devuelve el valor total de la suma y lo asigna al su 
         * elemento <span> correspondiente. En caso de haber campos incompletos devuelve "".
         */
    function sumatoriaPorClase(selectorClase) {
        // const span = document.querySelector(selectorSpan);
        // span.textContent = "0"; // Limpiando valores previos
        let total = 0, hayInputsIncompletos = false;
        let listaInputs = ventasDiv.querySelectorAll(selectorClase); // Accediendo a todos los inputs precio        
        for (const input of listaInputs) {
            let valor = input.value; // es un string
            if (valor === '' && !input.disabled) { // Si hay campos vacíos                    
                hayInputsIncompletos = true;                    
                input.classList.add("incompleto");
            }
            else {
                valor = parseFloat(valor);
                total += valor; // Agregando el precio del producto actual al total
            }            
        }
        if(hayInputsIncompletos) return "";
        return total;
    }


    /**
     * @returns {number} Devuelve el monto total de todos los gastos
     */
    function sumatoriaGastos() {
        let totalGastos = 0;
        const inputsGastos = document.querySelectorAll(`.gastos input[type="number"]`);
        for (const input of inputsGastos) {
            let valor = input.value;
            if (!input.disabled && valor !== '') totalGastos += parseFloat(valor);
        }
        return totalGastos;
    }

    // Eventos de checkbox gastos
    const gastosContainer = document.querySelector(".gastos"); // Contenedor Gastos
    const gastosList = gastosContainer.children;
    for (const gasto of gastosList) {
        let checkBox = gasto.children[0];
        let input = gasto.children[2];
        checkBox.addEventListener("change", () => {
            input.disabled = !input.disabled
            if (input.disabled) input.value = ""; // Si se desabilita se borra el valor previo
            if (checkBox.checked) input.focus(); // Pasa el foco al input
        });
    }

    // Eventos de input gastos. Hace validación para evitar numeros negativos
    const inputList = gastosContainer.querySelectorAll(`input[type="number"]`);
    for (const input of inputList) {
        input.addEventListener("input", () => {
            input.value = input.value.replace(/[^0-9.]/g, '');
        });
    }

    /**
     * Muestra en pantalla el popover a partir de su atributo 'id'.
     * Para poder mostrar un popover es necesario que exista un botón que tenga 
     * el atributo popovertarget = popover_id. De esta forma al hacer clic en 
     * este boton se muestra automaticamente el popover con el que está vinculado.
     * Aquí creamos un botón auxiliar y lo clickeamos y luego lo eliminamos, 
     * logrando mostrar el popover.
     * @param {string} popover_id Atributo 'id' del popover. Tiene que tener el 
     * mismo valor que el atributo 'id' del popover.
     */
    function mostrarPopover(popover_id) {
        const body = document.querySelector("body");
        // Creando boton interno para mostrar el popover
        const btn = document.createElement("button");
        // btn.setAttribute("id", "btn_aux");
        btn.setAttribute("popovertarget", popover_id);
        // btn.textContent = "Aux";
        body.appendChild(btn);
        btn.click(); // Se muestra el popover
        btn.hidden = true; // Se oculta el boton
        body.removeChild(btn); // Se elimina para que no acumule botones repetidos
    }    


});