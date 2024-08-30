document.addEventListener("DOMContentLoaded", () => {
    const fecha = document.querySelector('.input_date');
    fecha.valueAsDate = new Date(); // Asignando fecha hoy
    const ventasDiv = document.querySelector(".ventas"); // Contenedor de productos



    /**
     * Se programan los eventos de cada uno de los inputs pertenecientes al producto.
     * @param {HTMLDivElement} producto Representa al div que representa un producto.
     */
    function addProductEvents(producto) {
        // Configurando eventos input: precio, inversion, ganancia
        const precioInput = producto.querySelector('.precio_producto');
        const inversionInput = producto.querySelector('.inversion_producto');
        const gananciaInput = producto.querySelector('.ganancia_producto');

        // Valida segun el valor del precio, habilita la inversion y ganancia
        precioInput.addEventListener('input', () => {
            // Remove any non-numeric characters except for the decimal point
            precioInput.value = precioInput.value.replace(/[^0-9.]/g, '');
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
            const maxInversion = parseFloat(inversionInput.max); // max
            const precioValue = parseFloat(precioInput.value);            
            const inversionValue = parseFloat(inversionInput.value);
            if (!isNaN(precioValue) && !isNaN(inversionValue)) {
                // Evitar entrada de valores superiores al maximo
                if(inversionValue > maxInversion) {
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
            const maxGanancia = parseFloat(gananciaInput.max); // max
            const precioValue = parseFloat(precioInput.value);
            const gananciaValue = parseFloat(gananciaInput.value);
            if (!isNaN(precioValue) && !isNaN(gananciaValue)) {
                // Evitar entrada de valores superiores al maximo
                if(gananciaValue > maxGanancia) {
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
    const btnAgregar = document.getElementById("btn_agregar");
    btnAgregar.addEventListener("click", (ev) => {
        // CREANDO NUEVO PRODUCTO
        const newProduct = document.createElement("div");
        newProduct.setAttribute("class", "producto")

        // Creando input nombre_producto
        const nombre = document.createElement("input");
        nombre.type = "text";
        nombre.setAttribute("class", "nombre_producto");
        nombre.name = "nombre_producto";
        nombre.placeholder = `Producto${ventasDiv.childElementCount === 0 ? "" : " " + (ventasDiv.childElementCount + 1)}`;
        // Agregando input nombre_producto al nuevo producto
        newProduct.appendChild(nombre);

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

        // Aplicando eventos al nuevo producto
        addProductEvents(newProduct);

        // Agregando el nuevo producto al contenedor 
        ventasDiv.appendChild(newProduct);
    });

    // Configurando boton Eliminar Producto
    const btnEliminar = document.getElementById("btn_eliminar");
    btnEliminar.addEventListener("click", (ev) => {
        if (ventasDiv.childElementCount > 0) {
            ventasDiv.removeChild(ventasDiv.lastElementChild);
        }
    });

    // Configurando boton Calcular
    const btnCalcular = document.getElementById("btn_calcular");
    btnCalcular.addEventListener("click", (ev) => {
        // console.log("Precio: " + ventasDiv.children[0].children[1].value + " CUP");
        alert(ventasDiv.querySelector('.precio_producto').value);

    });

    // Eventos de checkbox
    const gastosContainer = document.querySelector(".gastos"); // Contenedor Gastos
    const gastosDiv = gastosContainer.children;
    for (const gasto of gastosDiv) {
        let checkBox = gasto.children[0];
        let input = gasto.children[2];
        checkBox.addEventListener("change", () => {
            input.disabled = !input.disabled
            if (input.disabled) input.value = ""; // Si se desabilita se borra el valor previo        
        });
    }

});



// console.log(ventas.childElementCount); // Cantidad de hijos
// ventas.children[0].children[0].value = "Cable V8";