
class Socio {
    
    constructor(nombre, edad, categoria, cuotaBase) {
        this.nombre = nombre;
        this.edad = parseInt(edad);
        this.categoria = categoria; // Ej: "Pase Libre", "Musculación", "Crossfit"
        this.cuotaBase = parseFloat(cuotaBase);
    }
    
    calcularCuotaConRecargo() {
        const recargo = this.cuotaBase * 0.10;
        this.cuotaBase += recargo;
        return this.cuotaBase;
    }

    actualizarCategoria(nuevaCategoria) {
        this.categoria = nuevaCategoria;
    }
}
let padronSocios = [
    new Socio("Gonzalo Pérez", 28, "Musculación", 15000),
    new Socio("Martina Gómez", 34, "Pase Libre", 22000),
    new Socio("Ariel Rodríguez", 19, "Crossfit", 18000)
];
const contenedorSocios = document.querySelector("#contenedor-socios");
const formSocio = document.querySelector("#form-socio");
const filtroCategoria = document.querySelector("#filtro-categoria");
const notificacion = document.querySelector("#notificacion");
const txtIngresosTotales = document.querySelector("#ingresos-totales");

const inputNombre = document.querySelector("#reg-nombre");
const inputEdad = document.querySelector("#reg-edad");
const inputCategoria = document.querySelector("#reg-categoria");
const inputCuota = document.querySelector("#reg-cuota");

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


 listaDeSocios.forEach((socio, indice) => {
        const card = document.createElement("div");
        card.className = "socio-card";
        
        card.innerHTML = `
            <div class="socio-info">
                <p><strong>Nombre:</strong> ${socio.nombre} (${socio.edad} años)</p>
                <p><strong>Pase:</strong> <span style="color:#2980b9; font-weight:bold;">${socio.categoria}</span></p>
                <p><strong>Cuota Actual:</strong> $${socio.cuotaBase.toLocaleString('es-AR')}</p>
            </div>
            <div class="socio-acciones">
                <button class="btn-recargo" data-index="${indice}"> +10% Mora</button>
                <button class="btn-eliminar" data-index="${indice}"> Dar de Baja</button>
            </div>
        `;
        contenedorSocios.appendChild(card);
    });
    calcularIngresosTotales();
    asignarEventosAccion();
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
    
    lanzarFeedback(`¡Socio ${nuevoSocio.nombre} registrado con éxito!`, "exito");
    

    inputNombre.value = "";
    inputEdad.value = "";
    inputCategoria.value = "";
    inputCuota.value = "";

    filtroCategoria.value = "Todos"; 
    
  
    renderizarSocios(padronSocios);
});

filtroCategoria.addEventListener("change", function() {
    const seleccion = filtroCategoria.value;
    if (seleccion === "Todos") {
        renderizarSocios(padronSocios);
    } else {
        const filtrados = padronSocios.filter(socio => socio.categoria === seleccion);
        renderizarSocios(filtrados);
    }
});


function asignarEventosAccion() {
    document.querySelectorAll(".btn-recargo").forEach(btn => {
        btn.addEventListener("click", function() {
            const index = btn.getAttribute("data-index");
            const socioAFectar = padronSocios[index];
            
            socioAFectar.calcularCuotaConRecargo();
            
            lanzarFeedback(`Se aplicó 10% de recargo por mora a ${socioAFectar.nombre}`, "alerta");
            renderizarSocios(padronSocios);
        });
    });
    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", function() {
            const index = btn.getAttribute("data-index");
            const socioBaja = padronSocios[index];
        
            padronSocios.splice(index, 1);
            
            lanzarFeedback(`Socio ${socioBaja.nombre} dado de baja de la institución`, "alerta");
            renderizarSocios(padronSocios);
        });
    });
}

renderizarSocios(padronSocios);

