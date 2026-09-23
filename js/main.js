
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
const socio1 = new Socio("Gonzalo Pérez", 28, "Musculación", 15000);
const socio2 = new Socio("Martina Gómez", 34, "Pase Libre", 22000);
const socio3 = new Socio("Ariel Rodríguez", 19, "Crossfit", 18000);

const padronSocios = [socio1, socio2, socio3];

console.log("--- ESTADO INICIAL DE LOS SOCIOS ---");
console.log(socio1);
console.log(socio2);
console.log(socio3);

console.log("\n--- EJECUTANDO MÉTODOS Y MODIFICANDO PROPIEDADES ---");


socio1.calcularCuotaConRecargo();
console.log(`Se aplicó recargo a ${socio1.nombre}. Nueva cuota: $${socio1.cuotaBase}`);


socio2.actualizarCategoria("VIP Premium");
console.log(`${socio2.nombre} cambió su categoría a: ${socio2.categoria}`);


console.log("\n--- REPORTE FINAL  ---");

for (const socio of padronSocios) {
    console.log(`Socio: ${socio.nombre} | Categoría: ${socio.categoria} | Cuota Actual: $${socio.cuotaBase}`);
}
//filter
function filtrarPorCategoria(categoriaBuscada) {
    return padronSocios.filter(socio => socio.categoria.toLowerCase() === categoriaBuscada.toLowerCase());
}

//find
function buscarSocioPorNombre(nombreBuscado) {
    return padronSocios.find(socio => socio.nombre.toLowerCase() === nombreBuscado.toLowerCase());
}

//map
function obtenerReporteCobros() {
    return padronSocios.map(socio => `Cliente: ${socio.nombre} -> Cuota a Liquidar: $${socio.cuotaBase}`);
}

//reduce
function calcularIngresosTotales() {
    return padronSocios.reduce((acumulador, socio) => acumulador + socio.cuotaBase, 0);
}



//INTERACCIÓN MEDIANTE PROMPT Y CONSOLE.LOG
function iniciarSimuladorClub() {
    alert("¡Sistema de Gestión del Gimnasio!");
    
    let continuar = true;
    while (continuar) {
        let opcion = prompt(
            "Seleccione una acción administrativa:\n" +
            "1. Ver reporte rápido de cobros (Lista de Socios)\n" +
            "2. Filtrar socios por Categoría\n" +
            "3. Buscar socio y aplicar Recargo por mora\n" +
            "4. Buscar socio y actualizar su Categoría\n" +
            "5. Salir del sistema"
        );

        switch (opcion) {
            case "1":
                let listaReporte = obtenerReporteCobros();
                alert("Reporte de Cobros Generado:\n\n" + listaReporte.join("\n"));
                console.log("--- REPORTE COMPLETO GENERADO (MAP) ---", listaReporte);
                break;

            case "2":
                let catFiltro = prompt("Ingrese la categoría a filtrar (Musculación, Pase Libre, Crossfit):");
                let sociosFiltrados = filtrarPorCategoria(catFiltro);
                
                if (sociosFiltrados.length > 0) {
                    let resultadoTexto = sociosFiltrados.map(s => `- ${s.nombre} (${s.edad} años)`).join("\n");
                    alert(`Socios encontrados en "${catFiltro}":\n\n${resultadoTexto}`);
                    console.log(`Socios filtrados por categoría "${catFiltro}":`, sociosFiltrados);
                } else {
                    alert("No se encontraron socios registrados en esa categoría.");
                }
                break;

            case "3":
                let nombreMora = prompt("Ingrese el nombre completo del socio con pago atrasado:");
                let socioMora = buscarSocioPorNombre(nombreMora);

                if (socioMora) {
                    socioMora.calcularCuotaConRecargo(); 
                    alert(`¡Recargo del 10% aplicado con éxito!\nSocio: ${socioMora.nombre}\nNueva Cuota: $${socioMora.cuotaBase}`);
                    console.log(`Modificación: Se aplicó recargo a ${socioMora.nombre}.`, socioMora);
                } else {
                    alert("Socio no encontrado. Asegúrese de escribir nombre y apellido correctamente.");
                }
                break;

            case "4":
                let nombreCambio = prompt("Ingrese el nombre completo del socio que cambia de pase:");
                let socioCambio = buscarSocioPorNombre(nombreCambio);

                if (socioCambio) {
                    let nuevaCat = prompt(`Categoría actual: ${socioCambio.categoria}\nIngrese la nueva categoría:`);
                    socioCambio.actualizarCategoria(nuevaCat); 
                    alert(`¡Categoría actualizada!\n${socioCambio.nombre} ahora está en: ${socioCambio.categoria}`);
                    console.log(`Modificación: ${socioCambio.nombre} cambió a ${socioCambio.categoria}.`, socioCambio);
                } else {
                    alert("Socio no encontrado.");
                }
                break;

            case "5":
                alert("Cerrando sesión del sistema de gestión. ¡Hasta luego!");
                continuar = false;
                break;

            default:
                alert("Opción inválida. Intente de nuevo.");
                break;
        }
    }

   
    console.log("\n--- REPORTE FINAL DEL PADRÓN (ESTADO ACTUAL) ---");
    for (const socio of padronSocios) {
        console.log(`Socio: ${socio.nombre} | Categoría: ${socio.categoria} | Cuota Actual: $${socio.cuotaBase}`);
    }
}

iniciarSimuladorClub();