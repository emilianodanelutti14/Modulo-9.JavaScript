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

let padronSocios = [];

const contenedorSocios = document.querySelector("#contenedor-socios");
const filtroCategoria = document.querySelector("#filtro-categoria");
const txtIngresosTotales = document.querySelector("#ingresos-totales");
const estadoConexion = document.querySelector("#estado-conexion");

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

async function cargarDatosIniciales() {
    estadoConexion.innerHTML = "⏳ Cargando padrón de socios desde el servidor...";

    try {
        const sociosGuardados = JSON.parse(localStorage.getItem("padronSocios"));
        
        if (sociosGuardados) {
            padronSocios = sociosGuardados.map(s => new Socio(s.nombre, s.edad, s.categoria, s.cuotaBase, s.id));
        } else {
            const respuesta = await fetch("./js/socios_iniciales.json");
            
            if (!respuesta.ok) {
                throw new Error(`Error de red: Código de estado ${respuesta.status}`);
            }

            const datosJson = await respuesta.json();
            padronSocios = datosJson.map(s => new Socio(s.nombre, s.edad, s.categoria, s.cuotaBase));
            guardarEnLocalStorage();
        }
        estadoConexion.innerHTML = "";

    } catch (error) {
        console.error("Fallo al obtener datos:", error.message);
        estadoConexion.innerHTML = `❌ Error al cargar los datos: ${error.message}. Se inició con padrón vacío.`;
        padronSocios = [];

        Toastify({
            text: `❌ Error de Sincronización: No se pudo conectar a la base de datos.`,
            duration: 4000,
            close: true,
            gravity: "top", 
            position: "right", 
            style: {
                background: "linear-gradient(to right, #e74c3c, #c0392b)"
            }
        }).showToast();
    } finally {
        renderizarSocios(padronSocios);
    }
}

function guardarEnLocalStorage() {
    localStorage.setItem("padronSocios", JSON.stringify(padronSocios));
}

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

const btnRegistrar = document.querySelector("#btn-registrar");
btnRegistrar.addEventListener("click", function() {
    if (inputNombre.value.trim() === "" || inputEdad.value === "" || inputCategoria.value === "" || inputCuota.value === "") {
        Toastify({
            text: "⚠️ Por favor, completa todos los campos del formulario.",
            duration: 3000,
            gravity: "top",
            position: "right",
            style: { background: "#f39c12" }
        }).showToast();
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
    
    Toastify({
        text: `✅ ¡Socio ${nuevoSocio.nombre} registrado con éxito!`,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: { background: "linear-gradient(to right, #2ecc71, #27ae60)" }
    }).showToast();
    
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
            
            Toastify({
                text: `📈 Recargo del 10% aplicado a ${socioAFectar.nombre}`,
                duration: 2500,
                gravity: "bottom",
                position: "left",
                style: { background: "#34495e" }
            }).showToast();
            
            aplicarFiltroActual();
        }
    }

    if (event.target.classList.contains("btn-eliminar")) {
        const idBuscar = event.target.getAttribute("data-id");
        const indexOriginal = padronSocios.findIndex(s => s.id === idBuscar);
        
        if (indexOriginal !== -1) {
            const socioBaja = padronSocios[indexOriginal];
            
            const confirmar = confirm(`¿Estás seguro de que quieres dar de baja a ${socioBaja.nombre}?`);
            if (confirmar) {
                padronSocios.splice(indexOriginal, 1); 
                guardarEnLocalStorage(); 
                
                Toastify({
                    text: `🗑️ Socio ${socioBaja.nombre} dado de baja.`,
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    style: { background: "#e74c3c" }
                }).showToast();

                aplicarFiltroActual(); 
            }
        }
    }
});

const btnVaciar = document.querySelector("#btn-vaciar");
btnVaciar.addEventListener("click", function() {
    const confirmar = confirm("¿Estás seguro de que deseas eliminar TODOS los socios del padrón?");
    
    if (confirmar) {
        padronSocios = [];
        localStorage.removeItem("padronSocios");
        filtroCategoria.value = "Todos";
        renderizarSocios(padronSocios);

        Toastify({
            text: "💥 El padrón de socios ha sido vaciado por completo.",
            duration: 4000,
            gravity: "top",
            position: "center",
            style: { background: "linear-gradient(to right, #d35400, #c0392b)" }
        }).showToast();
    }
});

cargarDatosIniciales();