var socket = io();

function openMenu() {
    if (getElement("menuButton").style.backgroundImage != 'url("client/img/backArrow.png")') {
        getElement("menuButton").style.backgroundImage = "url(client/img/backArrow.png)"
        getElement("bodyShadow").style.display = "block";
        getElement("menu").style.animation = "open 0.2s";
        getElement("menu").style.animationTimingFunction = "linear";
        getElement("menu").style.animationFillMode = "forwards";
    } else {
        document.getElementById("menu").style.animation = "close 0.2s";
        setTimeout(function () {
            getElement("menuButton").style.backgroundImage = "url(client/img/menu.png)"
            getElement("bodyShadow").style.display = "none";
        }, 180)
        getElement('teamMaker').style.display = "flex";
        getElement('players').value = "";
        getElement('teams').value = "";
        for (; 0 < getElement('addNames').getElementsByTagName("*").length;) {
            getElement('addNames').getElementsByTagName("*")[0].remove();
        }

    }
}

function getElement(id) {
    let div = document.getElementById(id);
    return div;
}

function createTeams() {
    names = [];
    getElement('teamMaker').style.display = "none";
    let i = 0;
    let thisInterval = setInterval(function () {
        let newName = prompt("INGRESE EL NOMBRE DEL JUGADOR NRO: " + (i + 1));
        names.push(newName);
        getElement('addNames').insertAdjacentHTML("beforeend", "<label class = 'player'>" + newName + "</label>")
        if (i + 1 == getElement('players').value) {
            clearInterval(thisInterval);
            names = mixer(names);
            for (let j = 0; j < getElement("addNames").getElementsByTagName("label").length;) {
                getElement("addNames").getElementsByTagName("label")[j].remove();
            }
            let teams = [];
            if (getElement('teams').value == 2) {
                getElement('addNames').insertAdjacentHTML("beforeend", "<label class = 'team' id = 'teamAzul'>AZUL</label>")
                getElement('addNames').insertAdjacentHTML("beforeend", "<label class = 'team' id = 'teamRojo'>ROJO</label>")
                teams.push(getElement('teamAzul'))
                teams.push(getElement('teamRojo'))
            } else {
                for (let j = 0; j < getElement('teams').value; j++) {
                    getElement('addNames').insertAdjacentHTML("beforeend", "<label class = 'team' id = 'team" + j + "'>EQUIPO " + (j + 1) + "</label>")
                    teams.push(getElement('team' + j))
                }
            }

            let p = 0;
            for (let j = 0; j < names.length; j++) {
                if (p == teams.length) {
                    p = 0;
                }
                teams[p].insertAdjacentHTML("afterend", "<label class = 'player'>" + names[j] + "</label>")
                p++;
            }
            //reaparezca el display(resetear los values de los inputs)
        }
        i++;
    }, 1)
}
inputClue.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        socket.emit('newClue', document.getElementById("inputClue").value)
    }
});
socket.on('newClue', function (clueWord) {
    addClue(clueWord);
})
socket.on('spyPass', function (pass) {
    if (pass == undefined) {
        let spyPass = prompt("ELIJA UNA CONTRASEÑA PARA EL SPYMASTER");;
        socket.emit('spyPass', spyPass)
        socket.emit('correctSpy')
        spymasterFunc("correct")
    } else {
        let spyPass = prompt("INGRESE CONTRASEÑA PARA VER EL SPYMASTER");;
        if (spyPass == pass) {
            socket.emit('correctSpy')
            spymasterFunc("correct")
        } else {
            spyCount = 0;
        }
    }
})

function addClue(clueWord) {
    let reds = 0;
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].state == 2) {
            reds++;
        }
    }
    if (reds == 9) {
        reds = 1;
    } else {
        reds = 0;
    }
    console.log(reds)
    let clues = document.getElementById("flexClues").getElementsByTagName('div').length;
    document.getElementById("inputClue").insertAdjacentHTML("beforebegin", "<div class = 'clues'><span>" +
        (clueWord).toUpperCase() + "</span></div>")
    document.getElementById("flexClues").getElementsByTagName('div')[clues].style.backgroundColor =
        colorsClicked[(clues + reds) % 2 + 1];
    inputClue.value = "";
    document.getElementById("flexClues").getElementsByTagName('div')[clues].onclick = function () {
        if (confirm("SEGURO QUE QUIERES BORRAR ESTA PISTA?")) {
            for (let i = 0; i < document.getElementById("flexClues").getElementsByTagName('div').length; i++) {
                if (document.getElementById("flexClues").getElementsByTagName('div')[i] == this) {
                    socket.emit('deleteClue', i)
                }
            }
        }
    }
}
socket.on('deleteClue', function (number) {
    document.getElementById("flexClues").getElementsByTagName('div')[number].remove();
})

function clueDeleter(text) {
    for (let i = 0; i < document.getElementById("flexClues").getElementsByTagName('div').length; i++) {
        if (document.getElementById("flexClues").getElementsByTagName('div')[i].getElementsByTagName('span')[0].innerHTML == text) {
            document.getElementById("flexClues").getElementsByTagName('div')[i].remove();
        }
    }
}
inputWords.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        addWords();
    }
});
document.oncontextmenu = new Function("return false;");
//=================
//COLORS
const redClicked = "rgb(209, 48, 48)";
const blueClicked = "rgb(65, 131, 204)";
const neutralClicked = "rgb(255, 205, 105)";
// const neutralClicked = "rgb(247, 244, 146)";

//const neutralClicked = "rgb(237, 189, 252)";
const bombClicked = "rgb(0, 0, 0)";
const blueSpy = "rgb(160, 206, 250)";
const redSpy = "rgb(255, 143, 143)";
const bombSpy = "rgb(138, 138, 138)";
const unclicked = "rgb(235, 235, 235)";
const colorsClicked = [neutralClicked, blueClicked, redClicked, bombClicked]
const colorsSpy = [unclicked, blueSpy, redSpy, bombSpy]
//=================
const length = 5;
var clockInterval;
var turnTime = "05:00";
var startTime = "00:00"
const numCards = length * length;

var words = [
    "ABOGADO", "ACEITE", "ÁFRICA", "AGENTE", "AGUA", "ÁGUILA", "AGUJA", "AGUJERO", "AIRE", "ALEMANIA", "ALGODÓN", "ALIANZA", "ALPES", "AMBULANCIA", "AMÉRICA", "ÁNGEL", "ANILLO", "ANTÁRTIDA", "ANTORCHA", "ARAÑA", "ARCHIVO", "ARCO", "ARGENTINA", "ARTÍCULO", "AS", "ATLÁNTIDA", "AZTECA", "BAILE", "BALA", "BALLENA", "BANCO", "BANDA", "BAÑO", "BARCO", "BARRA", "BATERÍA", "BERLÍN", "BERMUDAS", "BICHO", "BLANCO", "BLOQUE", "BOCA", "BOLA", "BOLSA", "BOMBA", "BOSQUE", "BOTA", "BOTELLA", "BOTÓN", "BRAZO", "BRUJA", "CABALLERO", "CABALLO", "CABEZA", "CABINA", "CABO", "CACTUS", "CADENA", "CAJA", "CAMA", "CÁMARA", "CAMBIO", "CAMPANA", "CAMPO", "CANAL", "CANGURO", "CANTO", "CAÑA", "CAPA", "CAPITAL", "CAQUI", "CARA", "CARAVANA", "CARGA", "CARRERA", "CARRO", "CARTA", "CASCO", "CASINO", "CAZA", "CEMENTERIO", "CENTAURO", "CENTRO", "CERVANTES", "CHECO", "CHOCOLATE", "CHOQUE", "CHULETA", "CIENTÍFICO", "CINTA", "CINTURÓN", "CÍRCULO", "CLASE", "COCHE", "COCINERO", "COCO", "CÓDIGO", "COLA", "CÓLERA", "COLUMNA", "COMETA", "COMPÁS", "CONCIERTO", "CONEJO", "CONTRABANDISTA", "COPA", "CORAZÓN", "CORNETA", "CORONA", "CORREDOR", "CORRIENTE", "CORTE", "CRESTA", "CROMO", "CRUZ", "CUADRO", "CUARTO", "CUBIERTA", "CUBO", "CUCHILLO", "CUELLO", "CUERDA", "CUERNO", "CURA", "DAMA", "DELTA", "DESTINO", "DÍA", "DIAMANTE", "DIANA", "DIARIO", "DIENTE", "DINOSAURIO", "DISCO", "DON", "DRAGÓN", "DUENDE", "EGIPTO", "EMBAJADA", "EMPERADOR", "ENANO", "ENFERMEDAD", "ENFERMERA", "ENLACE", "ESCORPIÓN", "ESPACIO", "ESPÍA", "ESTACIÓN", "ESTADIO", "ESTADO", "ESTRELLA", "ESTUDIO", "ETIQUETA", "EUROPA", "EXTRATERRESTRE", "FALDA", "FANTASMA", "FARO", "FICHA", "FIESTA", "FIGURA", "FLAUTA", "FLECHA", "FOSO", "FRANCIA", "FRENTE", "FUEGO", "FUENTE", "FUERZA", "FURGONETA", "GANCHO", "GATO", "GENIO", "GIGANTE", "GOLFO", "GOLONDRINA", "GOLPE", "GOMA", "GÓNDOLA", "GOTA", "GRADO", "GRANADA", "GRANO", "GRECIA", "GRIFO", "GUANTE", "GUARDIA", "GUERRA", "GUSANO", "HELADO", "HELICÓPTERO", "HIELO", "HIERBA", "HOJA", "HOLLYWOOD", "HORCA", "HOSPITAL", "HOTEL", "IGLESIA", "IMÁN", "INDIA", "ÍNDICE", "INGLATERRA", "ITALIA", "JARRA", "JUDÍA", "JUICIO", "KIWI", "LADRÓN", "LAGO NESS", "LÁSER", "LÁTIGO", "LENGUA", "LEÓN", "LIBRA", "LIMA", "LIMUSINA", "LÍNEA", "LISTA", "LLAMA", "LLAVE", "LOMO", "LONDRES", "LUNA", "LUZ", "MAESTRO", "MAGIA", "MALTA", "MANCHA", "MANDO", "MANGA", "MANGO", "MANO", "MANZANA", "MAÑANA", "MARCA", "MARCHA", "MARFIL", "MASA", "MÁSCARA", "MAZO", "MÉDICO", "MERCURIO", "MESA", "METRO", "MÉXICO", "MICRO", "MICROSCOPI", "MIELO", "MILLONARIO", "MINA", "MISIL", "MODELO", "MÓDULO", "MONITOR", "MONO", "MORTERO", "MOSCÚ", "MOTOR", "MUELLE", "MUERTE", "MUÑECA", "MURO", "NARANJA", "NAVE", "NIEVE", "NILO", "NINJA", "NOCHE", "NOTA", "NUDO", "NUEVA YORK", "OBRA", "OJO", "OLA", "OLIMPO", "ÓPERA", "ORDEN", "ÓRGANO", "ORNITORRINCO", "ORO", "OSO", "PALA", "PALMA", "PANTALLA", "PAPEL", "PARACAÍDAS", "PASE", "PASO", "PASTA", "PASTEL", "PAVO", "PEKÍN", "PELÍCULA", "PELOTÓN", "PENDIENTE", "PERRO", "PEZ", "PICO", "PIE", "PIEZA", "PILA", "PILOTO", "PINCHO", "PINGÜINO", "PINTA", "PIÑA", "PIRÁMIDE", "PIRATA", "PISTA", "PISTOLA", "PLACA", "PLANO", "PLANTA", "PLÁTANO", "PLAYA", "PLOMO", "PLUMA", "POLICÍA", "POLO", "PORTADA", "PORTERO", "POTRO", "PRENSA", "PRIMA", "PRINCESA", "PUENTE", "PUERTO", "PULPO", "PULSO", "PUNTA", "PUNTO", "RADIO", "RASCACIELOS", "RATÓN", "RAYO", "RED", "REGLA", "REINA", "RESERVA", "REVOLUCIÓN", "REY", "ROBOT", "ROJO", "ROMA", "RONDA", "ROSA", "RULETA", "SABLE", "SÁHARA", "SALSA", "SATÉLITE", "SATURNO", "SEÑAL", "SERIE", "SERPIENTE", "SIERRA", "SILLA", "SIRENA", "SOBRE", "SOLDADO", "SUBMARINISTA", "SUERTE", "SUPERHÉROE", "TABLA", "TABLETA", "TACO", "TACTO", "TALÓN", "TANQUE", "TAPA", "TARDE", "TEATRO", "TECLADO", "TELESCOPIO", "TESTIGO", "TIEMPO", "TIENDA", "TIERRA", "TOKIO", "TOPO", "TORRE", "TRAMA", "TRONCO", "TUBERÍA", "TUBO", "UNICORNIO", "VACÍO", "VADO", "VAMPIRO", "VELA", "VENENO", "VENUS", "VESTIDO", "VIDA", "VIDRIO", "VIENTO", "YEMA", "ZANAHORIA", "ZAPATO", "Yerba", "Final", "Anteojos", "Ahogado", "Ultimátum", "Repetir", "Control", "psicópata", "diagnóstico", "situación", "auto",
    "salida", "partuza", "equipaje", "movimiento", "moneda", "impresión", "progreso", "extranjero", "all star",
    "Nutella", "rico", "discurso", "maceta", "Cristina", "presidencial", "programación", "espejo", "llanto", "local", "arcoiris",
    "pensamiento", "luminoso", "perforacion", "caluroso", "recordatorio", "cancion", "seguridad", "crear", "arte",
    "secreto", "mentira", "instrucciones", "cantante", "britney", "pinza", "angel", "netflix", "instagram", "recepcion", "partir",
    "recreo", "entretenimiento", "crucero", "aeropuerto", "termostato", "PERON", "POLITICA", "GREENPEACE", "FOCO", "SODA",
    "PERCHA", "TIRO", "ECOLOGICO", "DON QUIJOTE", "CARBON", "BOMBILLA", "ESTETOSCOPIO", "ZOOM", "STAR WARS", "PERGAMINO", "MOMIA",
    "IBUPROFENO", "VELA", "PROA", "CORTINA", "BEATLES", "MARADONA", "DULCE", "RAPPI", "TRUCHA", "TRAVESÍA", "PAU", "DOLO",
    "SEBA", "MAI", "FEDE", "RECETA", "IDIOMA", "TERRAZA", "MELODÍA", "BICICLETA", "PIMIENTA", "MANIJA", "NARGUILA", "CHINO",
    "LOCUTOR", "ROCK", "MARILYN", "UKELELE", "PIÑATA", "INSULTO", "PARQUE", "BOLETÍN", "ROSS", "SENSUAL", "MILANESA", "discapacidad", "ACCIDENTE"
];
var cards = [];

socket.on('start', function (setUp) {
    nextGameFunc(setUp)
})

function createMatch(setUp) {
    if (setUp == undefined) {
        boardCreator();
        wordPicker();
        teamPicker();
        socket.emit('created', cards)
    } else {
        boardCreator()
        mirrorMatch(setUp);
        updateGameState();
    }
}


function mirrorMatch(externCards) {
    for (let i = 0; i < externCards.length; i++) {
        cards[i].state = externCards[i].state;
        cards[i].clicked = externCards[i].clicked;
        cards[i].word = externCards[i].word;
        cards[i].div.getElementsByTagName('span')[0].innerHTML = cards[i].word;
        if (cards[i].word.length > 12) {
            cards[i].div.getElementsByTagName('span')[0].style.fontSize = "1.2vw";
        }
    }
}

function updateGameState() {
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].clicked) {
            clickedWord(i);
        }
    }
}

function clickedWord(position) {
    cards[position].clicked = true;
    cards[position].div.style.backgroundColor = colorsClicked[cards[position].state];
    if (cards[position].state)
        cards[position].div.getElementsByTagName('span')[0].style.color = "white";
    remainingWords();
    if (cards[position].state == 3) {
        spymasterFunc();
    }
}

function remainingWords() {
    let remainingBlue = 0;
    let remainingRed = 0;
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].clicked == false && cards[i].state) {
            if (cards[i].state == 1) {
                remainingBlue += 1;
            } else if (cards[i].state == 2) {
                remainingRed += 1;
            }
        }
    }
    if (!remainingBlue || !remainingRed) {
        spymasterFunc();
    }
    document.getElementById("remainingBlue").innerHTML = remainingBlue + "";
    document.getElementById("remainingRed").innerHTML = remainingRed + "";

}
socket.on('clickedWord', function (positon) {
    clickedWord(positon)
})

function boardCreator() {
    for (let i = 0; i < length; i++) {
        for (let j = 0; j < length; j++) {
            document.getElementById("board").insertAdjacentHTML("beforeend",
                "<div id = " + i * 10 + j + " class = 'cards'><span></span></div>");
            let div = document.getElementById("board").getElementsByTagName('div')[i * length + j]
            div.style.width = ((parseInt(getCssProperty('board', 'width')) / window.innerWidth * 100 - (length + 1) * 2) / length) + "vw";
            div.style.height = ((parseInt(getCssProperty('board', 'height')) / window.innerHeight * 100 - (length + 1) * 2) / length) + "vh";
            cards.push(new card(div))
            div.onclick = function () {
                for (let i = 0; i < numCards; i++) {
                    if (this == cards[i].div) {
                        if (colorsClicked[cards[i].state] != getCssProperty('clockLetters', 'color')) {
                            socket.emit('clickClock', undefined);
                        }
                        clickedWord(i)
                        socket.emit('clickedWord', i)
                        break;
                    }
                }
            }
        }
    }
}

function card(div) {
    this.state = 0; //0 neutral; 1 azul; 2 rojo; 3 negra;
    this.clicked = false;
    this.div = div; //saves the document of every card.
    this.word = div.getElementsByTagName('span')[0].innerHTML; //saves the document of every card.
}


function wordPicker() {
    let copyWords = [...words];
    for (let i = 0; i < numCards; i++) {
        var newNum = Math.floor(Math.random() * copyWords.length);
        document.getElementById("board").getElementsByTagName('div')[i].getElementsByTagName('span')[0].innerHTML =
            (copyWords.splice(newNum, 1)[0]).toUpperCase();
        cards[i].word = document.getElementById("board").getElementsByTagName('div')[i].getElementsByTagName(
            'span')[0].innerHTML;
    }
}

function teamPicker() {
    let numbers = [];
    for (let i = 0; i < numCards; i++) {
        numbers.push(i);
    }
    numbers = mixer(numbers);
    let random = Math.floor(Math.random() * 2) + 8;
    for (let i = 0; i < random; i++) {
        cards[numbers[i]].state = 1;
    }
    for (let i = random; i < 17; i++) {
        cards[numbers[i]].state = 2;
    }
    cards[numbers[17]].state = 3;
}

function mixer(list) {
    for (let i = 0; i < list.length; i++) {
        let ran = Math.floor(Math.random() * list.length)
        let save = list[i];
        list[i] = list[ran];
        list[ran] = save;
    }
    return list;
}

var spyCount = 0;

function spyCounter() {
    if (!spyCount) {
        spyCount++;
        socket.emit('spyClicked')
    }
}

function spyNum(number) {
    let word = document.getElementById("spymaster").getElementsByTagName('span')[0].innerHTML;
    let times = parseInt(word[word.length - 1]);
    if (number == undefined)
        document.getElementById("spymaster").getElementsByTagName('span')[0].innerHTML = "SPYMASTER + " + (times + 1)
    else
        document.getElementById("spymaster").getElementsByTagName('span')[0].innerHTML = "SPYMASTER + " + (number)

}
socket.on('spyClicked', function (times) {
    spyNum(times);
})

function spymasterFunc(correct) {
    spyCounter();
    if (correct != undefined) {
        for (let i = 0; i < numCards; i++) {
            if (!cards[i].clicked) {
                cards[i].div.style.backgroundColor = colorsSpy[cards[i].state];
            }
        }
    }
}

function playerFunc() {
    for (let i = 0; i < numCards; i++) {
        if (!cards[i].clicked) {
            cards[i].div.style.backgroundColor = unclicked;
        }
    }
}

function nextGameFunc(match) {
    for (let i = 0; i < document.getElementsByClassName("cards").length;) {
        document.getElementsByClassName("cards")[i].remove();
    }
    for (let i = 0; i < document.getElementsByClassName("clues").length;) {
        document.getElementsByClassName("clues")[i].remove();
    }
    cards = [];
    document.getElementById("clock").getElementsByTagName('span')[0].innerHTML = turnTime;
    createMatch(match);
    spyNum(0);
    spyCount = 0;
    remainingWords();
}

socket.on('addedWord', function (newWords) {
    words = newWords;
})

function addWords() {
    let actualWord = "";
    if (inputWords.value.charAt(inputWords.value.length - 1) != ',') {
        inputWords.value += ','
    }
    console.log('words:', words)

    for (let i = 0; i < inputWords.value.length; i++) {
        if (inputWords.value.charCodeAt(i) != 44) {
            if ((inputWords.value.charCodeAt(i) != 32) ||
                (inputWords.value.charCodeAt(i - 1) != 44 && inputWords.value.charCodeAt(i + 1) != 32 &&
                    inputWords.value.charCodeAt(i + 1) != 44 && i != 0)) {
                actualWord += inputWords.value.charAt(i);
            } else {
                inputWords.value = setCharAt(inputWords.value, i, '');
                i--;
            }
        } else {
            actualWord = actualWord.replace(/(\r\n|\n|\r)/gm, "");
            if (actualWord.length - 1 > 1 && indexOf(actualWord.toUpperCase(), words) == -1) {
                words.push(actualWord.toUpperCase());
                socket.emit('addedWord', words)
            }
            actualWord = "";
        }
    }
    console.log('words:', words)
    inputWords.value = "";
}

function indexOf(element, array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] == element) {
            return i;
        }
    }
    return -1;
}

function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substr(0, index) + chr + str.substr(index + 1);
}

function clock() {
    let number = document.getElementById("clock").getElementsByTagName('span')[0].innerHTML;
    console.log('number:', number)
    let mins = parseInt(number.charAt(0)) * 10 + parseInt(number.charAt(1))
    let secs = parseInt(number.charAt(3)) * 10 + parseInt(number.charAt(4))
    if (!mins && !secs) {
        socket.emit('clickClock', undefined);
        return;
    }
    if (!secs) {
        mins -= 1;
        secs = 59;
    } else {
        secs -= 1;
    }
    document.getElementById("clock").getElementsByTagName('span')[0].innerHTML = ("00" + mins).slice(-2) + ":" + (
        "00" + secs).slice(-2)
}
socket.on('clickClock', function () {
    resetClock(turnTime);
    clockInterval = setInterval(clock, 1000);
})
socket.on('clockSetUp', function (info) {
    console.log('info[0]:', info[0])
    console.log('clockBefore:', getElement('clock').getElementsByTagName('span')[0].innerHTML)
    document.getElementById('clock').getElementsByTagName('span')[0].innerHTML = info[0];
    console.log('clockAfter:', getElement('clock').getElementsByTagName('span')[0].innerHTML)
    if (info[1] == 1) {
        getElement('clock').getElementsByTagName('span')[0].style.color = colorsClicked[1];
    }
    clockInterval = setInterval(clock, 1000);
})

function resetClock(time) {
    clearInterval(clockInterval);
    let clock = document.getElementById("clock");
    if (getCssProperty("clock", "color") == colorsClicked[2]) {
        clock.style.color = colorsClicked[1]
    } else {
        clock.style.color = colorsClicked[2];
    }
    clock.getElementsByTagName('span')[0].innerHTML = time;

}

function getCssProperty(elmId, property) {
    var elem = document.getElementById(elmId);
    return window.getComputedStyle(elem, null).getPropertyValue(property);
}