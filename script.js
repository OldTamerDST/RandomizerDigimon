document.addEventListener('contextmenu', event => event.preventDefault());

document.onkeydown = function(e) {
    if (e.keyCode == 123) { return false; }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) { return false; }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) { return false; }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) { return false; }
    if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) { return false; }
};

let idiomaActual = "es";
let setActual = "digitama";
let etapaDigimon = "Child";

// Clave estable de la leyenda fija actual: "inicial", "<set>_set" o "<set>_<indice>"
let claveLeyendaFija = "inicial";

// Estado de cada fila del set actual, para poder re-traducir sin volver a randomizar
// { status: "placeholder" | "placeholderAlerta" | "nuevo" | "sinDatos", poolIndice, valor }
let filasEstado = [];

function textoCategoria(indice) {
    return etiquetasVisuales[idiomaActual][setActual][indice];
}

function claveDescripcion(indice) {
    return `${setActual}_${indice}`;
}

function textoDescripcion(clave) {
    if (clave === "inicial") return textosUI[idiomaActual].leyendaInicial;

    const dic = descripcionesCategorias[idiomaActual];
    if (dic[clave]) return dic[clave];

    if (clave.endsWith("_set")) return textosUI[idiomaActual].leyendaInicial;

    const partes = clave.split("_");
    const indice = partes[partes.length - 1];
    const set = partes[0];
    const etiqueta = (etiquetasVisuales[idiomaActual][set] && etiquetasVisuales[idiomaActual][set][indice]) || clave;

    return idiomaActual === "es"
        ? `${etiqueta}: Descripción de categoría en desarrollo.`
        : `${etiqueta}: Category description in development.`;
}

function inicializarInterfaz() {
    const contenedor = document.getElementById("gridContenedor");
    contenedor.innerHTML = "";

    const cantidadListas = etiquetasVisuales[idiomaActual][setActual].length;
    filasEstado = Array.from({ length: cantidadListas }, () => ({ status: "placeholder" }));

    for (let i = 0; i < cantidadListas; i++) {
        const fila = document.createElement("div");
        fila.className = "grilla1";

        const boton = document.createElement("button");
        boton.className = "boton-lista";
        boton.innerText = textoCategoria(i);

        boton.onmouseenter = () => {
            actualizarLeyendaTemporal(claveDescripcion(i));
        };

        boton.onmouseleave = () => {
            restaurarLeyenda();
        };

        boton.onclick = () => {
            generarEspecifico(i.toString());
            claveLeyendaFija = claveDescripcion(i);
            document.getElementById("leyendaCategoria").innerText = textoDescripcion(claveLeyendaFija);
        };

        const visor = document.createElement("div");
        visor.className = "display-item";
        visor.id = `visor-${i}`;
        visor.innerText = textosUI[idiomaActual].itemPlaceholder;

        fila.appendChild(boton);
        fila.appendChild(visor);

        const omitirBuscar = (setActual === "digitama") || (setActual === "digimon" && i === 0);

        if (!omitirBuscar) {

            const btnGoogle = document.createElement("button");
            btnGoogle.className = "boton-google";
            btnGoogle.id = `btngoogle-${i}`;
            btnGoogle.innerText = "🔎";
            btnGoogle.title = textosUI[idiomaActual].googleTitle;
            btnGoogle.onclick = () => {
                const textoBusqueda = visor.innerText;
                if (textoBusqueda && filasEstado[i] && filasEstado[i].status === "nuevo") {
                    const url = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(textoBusqueda)}`;
                    window.open(url, '_blank');
                }
            };
            fila.appendChild(btnGoogle);

            const btnBuscar = document.createElement("button");
            btnBuscar.className = "boton-buscar";
            btnBuscar.id = `btnbuscar-${i}`;
            btnBuscar.innerText = "📚";
            btnBuscar.title = textosUI[idiomaActual].wikimonTitle;
            btnBuscar.onclick = () => {
                const textoBusqueda = visor.innerText;
                if (textoBusqueda && filasEstado[i] && filasEstado[i].status === "nuevo") {
                    const url = `https://wikimon.net/index.php?search=${encodeURIComponent(textoBusqueda)}`;
                    window.open(url, '_blank');
                }
            };
            fila.appendChild(btnBuscar);
        } else {
            const espaciadorGoogle = document.createElement("button");
            espaciadorGoogle.className = "boton-google";
            espaciadorGoogle.style.visibility = "hidden";
            espaciadorGoogle.style.display = "inline-block";
            espaciadorGoogle.innerText = "📚";
            espaciadorGoogle.disabled = true;
            fila.appendChild(espaciadorGoogle);

            const espaciador = document.createElement("button");
            espaciador.className = "boton-buscar";
            espaciador.style.visibility = "hidden";
            espaciador.style.display = "inline-block";
            espaciador.innerText = "🔎";
            espaciador.disabled = true;
            fila.appendChild(espaciador);
        }

        contenedor.appendChild(fila);
    }
}

function actualizarLeyendaTemporal(clave) {
    document.getElementById("leyendaCategoria").innerText = textoDescripcion(clave);
}

function restaurarLeyenda() {
    document.getElementById("leyendaCategoria").innerText = textoDescripcion(claveLeyendaFija);
}

function cambiarSet(nuevoSet, elementoBoton) {
    setActual = nuevoSet;
    if (setActual === "digimon") etapaDigimon = "Child";

    const botones = document.querySelectorAll('.boton-set');
    botones.forEach(boton => boton.classList.remove('active'));
    elementoBoton.classList.add('active');

    claveLeyendaFija = `${nuevoSet}_set`;
    document.getElementById("leyendaCategoria").innerText = textoDescripcion(claveLeyendaFija);

    inicializarInterfaz();
}

function generarEspecifico(indiceStr) {
    const indice = parseInt(indiceStr, 10);
    let opcionesDisponibles = [];
    const visor = document.getElementById(`visor-${indice}`);
    const btnBuscar = document.getElementById(`btnbuscar-${indice}`);
    const btnGoogle = document.getElementById(`btngoogle-${indice}`);

    if (setActual === "digimon") {
        if (indice === 0) {
            opcionesDisponibles = bancoDatosDigimon["0"];
        } else {
            const etapasRequeridas = bancoDatosDigimon["reglas"][etapaDigimon][indiceStr];
            etapasRequeridas.forEach(etapaRef => {
                const poolEspecifico = bancoDatosDigimon["listasMaestras"][etapaRef];
                if (poolEspecifico) opcionesDisponibles = opcionesDisponibles.concat(poolEspecifico);
            });
        }
    } else {
        opcionesDisponibles = bancoDatosDigitama[idiomaActual][indiceStr];
    }

    if (opcionesDisponibles && opcionesDisponibles.length > 0) {
        const poolIndice = Math.floor(Math.random() * opcionesDisponibles.length);
        const eleccion = opcionesDisponibles[poolIndice];

        visor.innerText = eleccion;
        visor.classList.add("nuevo");
        visor.style.color = "";

        filasEstado[indice] = {
            status: "nuevo",
            poolIndice: (setActual === "digitama") ? poolIndice : null,
            valor: eleccion
        };

        if (btnBuscar !== null) btnBuscar.style.display = "inline-block";
        if (btnGoogle !== null) btnGoogle.style.display = "inline-block";

        if (setActual === "digimon" && indice === 0) {
            etapaDigimon = eleccion;
            for (let j = 1; j < etiquetasVisuales[idiomaActual]["digimon"].length; j++) {
                const otroVisor = document.getElementById(`visor-${j}`);
                const otroBtnBuscar = document.getElementById(`btnbuscar-${j}`);
                const otroBtnGoogle = document.getElementById(`btngoogle-${j}`);
                if (otroVisor) {
                    otroVisor.innerText = textosUI[idiomaActual].itemPlaceholder;
                    otroVisor.classList.remove("nuevo");
                    otroVisor.style.color = "#ff452b";
                }
                filasEstado[j] = { status: "placeholderAlerta" };
                if (otroBtnBuscar !== null) otroBtnBuscar.style.display = "none";
                if (otroBtnGoogle !== null) otroBtnGoogle.style.display = "none";
            }
        }
    } else {
        visor.innerText = textosUI[idiomaActual].sinDatos;
        filasEstado[indice] = { status: "sinDatos" };
        if (btnBuscar !== null) btnBuscar.style.display = "none";
        if (btnGoogle !== null) btnGoogle.style.display = "none";
    }
}

function cambiarIdioma(nuevoIdioma) {
    if (nuevoIdioma !== "es" && nuevoIdioma !== "en") return;
    idiomaActual = nuevoIdioma;

    document.getElementById("labelES").classList.toggle("activo", idiomaActual === "es");
    document.getElementById("labelEN").classList.toggle("activo", idiomaActual === "en");

    document.getElementById("subtituloTexto").innerText = textosUI[idiomaActual].subtitulo;
    document.getElementById("compartirTexto").innerText = textosUI[idiomaActual].compartirPre;
    document.getElementById("compartirO").innerText = textosUI[idiomaActual].compartirO;
    document.getElementById("soporteTexto").innerText = textosUI[idiomaActual].soportePre;

    const botonesLista = document.querySelectorAll('.boton-lista');
    const cantidadListas = etiquetasVisuales[idiomaActual][setActual].length;

    for (let i = 0; i < cantidadListas; i++) {
        if (botonesLista[i]) botonesLista[i].innerText = textoCategoria(i);

        const visor = document.getElementById(`visor-${i}`);
        const btnGoogle = document.getElementById(`btngoogle-${i}`);
        const btnBuscar = document.getElementById(`btnbuscar-${i}`);
        if (btnGoogle) btnGoogle.title = textosUI[idiomaActual].googleTitle;
        if (btnBuscar) btnBuscar.title = textosUI[idiomaActual].wikimonTitle;

        const estado = filasEstado[i];
        if (!visor || !estado) continue;

        if (estado.status === "nuevo") {
            if (setActual === "digitama" && estado.poolIndice !== null && estado.poolIndice !== undefined) {
                const nuevoValor = bancoDatosDigitama[idiomaActual][i.toString()][estado.poolIndice];
                visor.innerText = nuevoValor;
                estado.valor = nuevoValor;
            }
            // Para "digimon" el valor no cambia entre idiomas (nombres propios y etapas ya en inglés)
        } else if (estado.status === "sinDatos") {
            visor.innerText = textosUI[idiomaActual].sinDatos;
        } else {
            visor.innerText = textosUI[idiomaActual].itemPlaceholder;
        }
    }

    restaurarLeyenda();
}

inicializarInterfaz();
