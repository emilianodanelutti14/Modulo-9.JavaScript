class Socio {
    constructor(nombre, edad, categoria, cuotaBase, id = null) {
        if (id !== null) {
            this.id = id;
        } else {
            this.id = "socio_" + Date.now() + "_" + Math.floor(Math.random() * 100000);
        }
        this.nombre = nombre;
        this.edad = parseInt(edad);
        this.categoria = categoria; 
        this.cuotaBase = parseFloat(cuotaBase);
    }
    
    calcularCuotaConRecargo() {
        const recargo = this.cuotaBase * 0.10;
        this.cuotaBase += recargo;
        return this.cuotaBase;
    }
}

const sociosGuardados = JSON.parse(localStorage.getItem("padronSocios"));

let padronSocios = sociosGuardados 
    ? sociosGuardados.map(s => new Socio(s.nombre, s.edad, s.categoria, s.cuotaBase, s.id))
    : [
        new Socio("Gonzalo Pérez", 28, "Musculación", 15000),
        new Socio("Martina Gómez", 34, "Pase Libre", 22000),
        new Socio("Ariel Rodríguez", 19, "Crossfit", 18000)
      ];

function guardarEnLocalStorage() {
    localStorage.setItem("padronSocios", JSON.stringify(padronSocios));
}

const contenedorSocios = document.querySelector("#contenedor-socios");
const filtroCategoria = document.querySelector("#filtro-categoria");
const notificacion = document.querySelector("#notificacion");
const txtIngresosTotales = document.querySelector("#ingresos-totales");

const inputNombre = document.querySelector("#reg-nombre");
const inputEdad = document.querySelector("#reg-edad");
const inputCategoria = document.querySelector("#reg-categoria");
const inputCuota = document.querySelector("#reg-cuota");
const preciosPorCategoria = {
    "Musculación": 15000,
    "Pase Libre": 22000,
    "Crossfit": 18000,
    "VIP Premium": 30000
};
inputCategoria.addEventListener("change", function() {
    const precio = preciosPorCategoria[inputCategoria.value];
    inputCuota.value = precio ? precio : "";
});

function calcularIngresosTotales() {
    const total = padronSocios.reduce((acumulador, socio) => acumulador + socio.cuotaBase, 0);
    txtIngresosTotales.textContent = `$${total.toLocaleString('es-AR')}`;
}

function renderizarSocios(listaDeSocios) {
    contenedorSocios.innerHTML = "";

    if (listaDeSocios.length === 0) {
        contenedorSocios.innerHTML = `<p style="text-align:center; color:#777;">No hay socios registrados para este criterio.</p>`;
        return;
    }

    listaDeSocios.forEach((socio) => {
        const { id, nombre, edad, categoria, cuotaBase } = socio;

        const card = document.createElement("div");
        card.className = "socio-card";
        
        card.innerHTML = `
            <div class="socio-info">
                <p><strong>Nombre:</strong> ${nombre} (${edad} años)</p>
                <p><strong>Pase:</strong> <span style="color:#2980b9; font-weight:bold;">${categoria}</span></p>
                <p><strong>Cuota Actual:</strong> $${cuotaBase.toLocaleString('es-AR')}</p>
            </div>
            <div class="socio-acciones">
                <button class="btn-recargo" data-id="${id}"> +10% Mora</button>
                <button class="btn-eliminar" data-id="${id}"> Dar de Baja</button>
            </div>
        `;
        contenedorSocios.appendChild(card);
    });
    calcularIngresosTotales();
}
function lanzarFeedback(mensaje, tipoClase) {
    notificacion.innerHTML = `
        <span>${mensaje}</span>
        <button id="btn-cerrar-alerta" style="width: auto; background: none; color: inherit; border: none; padding: 0 0 0 15px; cursor: pointer; font-weight: bold; float: right;">X</button>
    `;
    notificacion.className = `feedback ${tipoClase}`;

    const btnCerrar = document.querySelector("#btn-cerrar-alerta");
    btnCerrar.addEventListener("click", function() {
        notificacion.className = "feedback oculto"; 
    });
}

const btnRegistrar = document.querySelector("#btn-registrar");
btnRegistrar.addEventListener("click", function() {
    if (inputNombre.value.trim() === "" || inputEdad.value === "" || inputCategoria.value === "" || inputCuota.value === "") {
        lanzarFeedback("Por favor, completa todos los campos del formulario.", "alerta");
        return; 
    }

    const nuevoSocio = new Socio(
        inputNombre.value.trim(),
        inputEdad.value,
        inputCategoria.value,
        inputCuota.value
    );

    padronSocios.push(nuevoSocio);
    
    guardarEnLocalStorage(); 
    
    lanzarFeedback(`¡Socio ${nuevoSocio.nombre} registrado con éxito!`, "exito");
    
    inputNombre.value = "";
    inputEdad.value = "";
    inputCategoria.value = "";
    inputCuota.value = "";

    filtroCategoria.value = "Todos"; 
    renderizarSocios(padronSocios);
});

filtroCategoria.addEventListener("change", function() {
    aplicarFiltroActual();
});

function aplicarFiltroActual() {
    const seleccion = filtroCategoria.value;
    const filtrados = seleccion === "Todos" 
        ? padronSocios 
        : padronSocios.filter(socio => socio.categoria === seleccion);
        
    renderizarSocios(filtrados);
}

contenedorSocios.addEventListener("click", function(event) {
    
    if (event.target.classList.contains("btn-recargo")) {
        const idBuscar = event.target.getAttribute("data-id");
        const socioAFectar = padronSocios.find(s => s.id === idBuscar);
        
        if (socioAFectar) {
            socioAFectar.calcularCuotaConRecargo();
            
            guardarEnLocalStorage(); 
            
            lanzarFeedback(`Se aplicó 10% de recargo por mora a ${socioAFectar.nombre}`, "alerta");
            aplicarFiltroActual();
        }
    }

    if (event.target.classList.contains("btn-eliminar")) {
        const idBuscar = event.target.getAttribute("data-id");
        const indexOriginal = padronSocios.findIndex(s => s.id === idBuscar);
        
        if (indexOriginal !== -1) {
            const socioBaja = padronSocios[indexOriginal];
            padronSocios.splice(indexOriginal, 1); 
            
            guardarEnLocalStorage(); 
            
            lanzarFeedback(`Socio ${socioBaja.nombre} dado de baja de la institución`, "alerta");
            aplicarFiltroActual(); 
        }
    }
});

renderizarSocios(padronSocios);