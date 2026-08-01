document.addEventListener('contextmenu', event => event.preventDefault());

document.onkeydown = function(e) {
    if (e.keyCode == 123) { return false; } 
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) { return false; } 
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) { return false; } 
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) { return false; } 
    if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) { return false; } 
};

let setActual = "digitama";
let etapaDigimon = "Child"; 

let textoLeyendaFijo = "Selecciona una categoría por vez";

function inicializarInterfaz() {
    const contenedor = document.getElementById("gridContenedor");
    contenedor.innerHTML = ""; 

    const cantidadListas = etiquetasVisuales[setActual].length;

    for (let i = 0; i < cantidadListas; i++) {
        const fila = document.createElement("div");
        fila.className = "grilla1";

        const nombreCategoria = etiquetasVisuales[setActual][i];

        const boton = document.createElement("button");
        boton.className = "boton-lista";
        boton.innerText = nombreCategoria;
        
        boton.onmouseenter = () => {
            actualizarLeyendaTemporal(nombreCategoria);
        };

        boton.onmouseleave = () => {
            restaurarLeyenda();
        };

        boton.onclick = () => {
            generarEspecifico(i.toString());
            
            if (descripcionesCategorias[nombreCategoria]) {
                textoLeyendaFijo = descripcionesCategorias[nombreCategoria];
            } else {
                textoLeyendaFijo = `${nombreCategoria}: Descripción de categoría en desarrollo.`;
            }
            
            document.getElementById("leyendaCategoria").innerText = textoLeyendaFijo;
        };

        const visor = document.createElement("div");
        visor.className = "display-item";
        visor.id = `visor-${i}`;
        visor.innerText = "Item"; 

        fila.appendChild(boton);
        fila.appendChild(visor);

        const omitirBuscar = (setActual === "digitama") || (setActual === "digimon" && nombreCategoria === "Etapa");

        if (!omitirBuscar) {
            
            const btnGoogle = document.createElement("button");
            btnGoogle.className = "boton-google";
            btnGoogle.id = `btngoogle-${i}`;
            btnGoogle.innerText = "🔎";
            btnGoogle.title = "Buscar en Google Imágenes";
            btnGoogle.onclick = () => {
                const textoBusqueda = visor.innerText;
                if (textoBusqueda && textoBusqueda !== "Item" && !textoBusqueda.startsWith("Item")) {
                    const url = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(textoBusqueda)}`;
                    window.open(url, '_blank');
                }
            };
            fila.appendChild(btnGoogle);

            
            const btnBuscar = document.createElement("button");
            btnBuscar.className = "boton-buscar";
            btnBuscar.id = `btnbuscar-${i}`;
            btnBuscar.innerText = "📚";
            btnBuscar.title = "Buscar en Wikimon";
            btnBuscar.onclick = () => {
                const textoBusqueda = visor.innerText;
                if (textoBusqueda && textoBusqueda !== "Item" && !textoBusqueda.startsWith("Item")) {
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

function actualizarLeyendaTemporal(categoria) {
    const contenedorLeyenda = document.getElementById("leyendaCategoria");
    if (descripcionesCategorias[categoria]) {
        contenedorLeyenda.innerText = descripcionesCategorias[categoria];
    } else {
        contenedorLeyenda.innerText = `${categoria}: Descripción de categoría en desarrollo.`;
    }
}

function restaurarLeyenda() {
    document.getElementById("leyendaCategoria").innerText = textoLeyendaFijo;
}

function cambiarSet(nuevoSet, elementoBoton) {
    setActual = nuevoSet;
    if(setActual === "digimon") etapaDigimon = "Child"; 
    
    const botones = document.querySelectorAll('.boton-set');
    botones.forEach(boton => boton.classList.remove('active'));
    elementoBoton.classList.add('active');
    
    const claveSet = `${nuevoSet}_set`;
    if (descripcionesCategorias[claveSet]) {
        textoLeyendaFijo = descripcionesCategorias[claveSet];
    } else {
        textoLeyendaFijo = `Modo ${nuevoSet.toUpperCase()}: Pasa el mouse por una categoría`;
    }
    
    document.getElementById("leyendaCategoria").innerText = textoLeyendaFijo;
    
    inicializarInterfaz();
}

function generarEspecifico(indice) {
    let opcionesDisponibles = [];
    const visor = document.getElementById(`visor-${indice}`);
    const btnBuscar = document.getElementById(`btnbuscar-${indice}`);
    const btnGoogle = document.getElementById(`btngoogle-${indice}`);
    
    if (setActual === "digimon" && indice !== "0") {
        const etapasRequeridas = bancoDatos["digimon"]["reglas"][etapaDigimon][indice];
        etapasRequeridas.forEach(etapaRef => {
            const poolEspecifico = bancoDatos["digimon"]["listasMaestras"][etapaRef];
            if (poolEspecifico) opcionesDisponibles = opcionesDisponibles.concat(poolEspecifico);
        });
    } else {
        opcionesDisponibles = bancoDatos[setActual][indice];
    }
    
    if (opcionesDisponibles && opcionesDisponibles.length > 0) {
        const eleccion = opcionesDisponibles[Math.floor(Math.random() * opcionesDisponibles.length)];
        visor.innerText = eleccion;
        visor.classList.add("nuevo");
        visor.style.color = "";

        if (btnBuscar !== null) btnBuscar.style.display = "inline-block";
        if (btnGoogle !== null) btnGoogle.style.display = "inline-block";
        
        if (setActual === "digimon" && indice === "0") {
            etapaDigimon = eleccion;
            for (let j = 1; j < etiquetasVisuales["digimon"].length; j++) {
                const otroVisor = document.getElementById(`visor-${j}`);
                const otroBtnBuscar = document.getElementById(`btnbuscar-${j}`);
                const otroBtnGoogle = document.getElementById(`btngoogle-${j}`);
                if (otroVisor) {
                    otroVisor.innerText = `Item`;
                    otroVisor.classList.remove("nuevo");
                    otroVisor.style.color = "#ff452b"; 
                }
                if (otroBtnBuscar !== null) otroBtnBuscar.style.display = "none";
                if (otroBtnGoogle !== null) otroBtnGoogle.style.display = "none";
            }
        }
    } else {
        visor.innerText = "Sin datos en esta lista";
        if (btnBuscar !== null) btnBuscar.style.display = "none";
        if (btnGoogle !== null) btnGoogle.style.display = "none";
    }
}

inicializarInterfaz();
