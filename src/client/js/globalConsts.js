var socket = io();

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
var spyCount = 0;

var words = [
    "ABOGADO", "ACEITE", "ÁFRICA", "AGENTE", "AGUA", "ÁGUILA", "AGUJA", "AGUJERO", "AIRE", "ALEMANIA", "ALGODÓN", "ALIANZA", "ALPES", "AMBULANCIA", "AMÉRICA", "ÁNGEL", "ANILLO", "ANTÁRTIDA", "ANTORCHA", "ARAÑA", "ARCHIVO", "ARCO", "ARGENTINA", "ARTÍCULO", "AS", "ATLÁNTIDA", "AZTECA", "BAILE", "BALA", "BALLENA", "BANCO", "BANDA", "BAÑO", "BARCO", "BARRA", "BATERÍA", "BERLÍN", "BERMUDAS", "BICHO", "BLANCO", "BLOQUE", "BOCA", "BOLA", "BOLSA", "BOMBA", "BOSQUE", "BOTA", "BOTELLA", "BOTÓN", "BRAZO", "BRUJA", "CABALLERO", "CABALLO", "CABEZA", "CABINA", "CABO", "CACTUS", "CADENA", "CAJA", "CAMA", "CÁMARA", "CAMBIO", "CAMPANA", "CAMPO", "CANAL", "CANGURO", "CANTO", "CAÑA", "CAPA", "CAPITAL", "CAQUI", "CARA", "CARAVANA", "CARGA", "CARRERA", "CARRO", "CARTA", "CASCO", "CASINO", "CAZA", "CEMENTERIO", "CENTAURO", "CENTRO", "CERVANTES", "CHECO", "CHOCOLATE", "CHOQUE", "CHULETA", "CIENTÍFICO", "CINTA", "CINTURÓN", "CÍRCULO", "CLASE", "COCHE", "COCINERO", "COCO", "CÓDIGO", "COLA", "CÓLERA", "COLUMNA", "COMETA", "COMPÁS", "CONCIERTO", "CONEJO", "CONTRABANDISTA", "COPA", "CORAZÓN", "CORNETA", "CORONA", "CORREDOR", "CORRIENTE", "CORTE", "CRESTA", "CROMO", "CRUZ", "CUADRO", "CUARTO", "CUBIERTA", "CUBO", "CUCHILLO", "CUELLO", "CUERDA", "CUERNO", "CURA", "DAMA", "DELTA", "DESTINO", "DÍA", "DIAMANTE", "DIANA", "DIARIO", "DIENTE", "DINOSAURIO", "DISCO", "DON", "DRAGÓN", "DUENDE", "EGIPTO", "EMBAJADA", "EMPERADOR", "ENANO", "ENFERMEDAD", "ENFERMERA", "ENLACE", "ESCORPIÓN", "ESPACIO", "ESPÍA", "ESTACIÓN", "ESTADIO", "ESTADO", "ESTRELLA", "ESTUDIO", "ETIQUETA", "EUROPA", "EXTRATERRESTRE", "FALDA", "FANTASMA", "FARO", "FICHA", "FIESTA", "FIGURA", "FLAUTA", "FLECHA", "FOSO", "FRANCIA", "FRENTE", "FUEGO", "FUENTE", "FUERZA", "FURGONETA", "GANCHO", "GATO", "GENIO", "GIGANTE", "GOLFO", "GOLONDRINA", "GOLPE", "GOMA", "GÓNDOLA", "GOTA", "GRADO", "GRANADA", "GRANO", "GRECIA", "GRIFO", "GUANTE", "GUARDIA", "GUERRA", "GUSANO", "HELADO", "HELICÓPTERO", "HIELO", "HIERBA", "HOJA", "HOLLYWOOD", "HORCA", "HOSPITAL", "HOTEL", "IGLESIA", "IMÁN", "INDIA", "ÍNDICE", "INGLATERRA", "ITALIA", "JARRA", "JUDÍA", "JUICIO", "KIWI", "LADRÓN", "LAGO NESS", "LÁSER", "LÁTIGO", "LENGUA", "LEÓN", "LIBRA", "LIMA", "LIMUSINA", "LÍNEA", "LISTA", "LLAMA", "LLAVE", "LOMO", "LONDRES", "LUNA", "LUZ", "MAESTRO", "MAGIA", "MALTA", "MANCHA", "MANDO", "MANGA", "MANGO", "MANO", "MANZANA", "MAÑANA", "MARCA", "MARCHA", "MARFIL", "MASA", "MÁSCARA", "MAZO", "MÉDICO", "MERCURIO", "MESA", "METRO", "MÉXICO", "MICRO", "MICROSCOPI", "COLUMNA VERTEBRAL", "MILLONARIO", "MINA", "MISIL", "MODELO", "MÓDULO", "MONITOR", "MONO", "MORTERO", "MOSCÚ", "MOTOR", "MUELLE", "MUERTE", "MUÑECA", "MURO", "NARANJA", "NAVE", "NIEVE", "NILO", "NINJA", "NOCHE", "NOTA", "NUDO", "NUEVA YORK", "OBRA", "OJO", "OLA", "OLIMPO", "ÓPERA", "ORDEN", "ÓRGANO", "ORNITORRINCO", "ORO", "OSO", "PALA", "PALMA", "PANTALLA", "PAPEL", "PARACAÍDAS", "PASE", "PASO", "PASTA", "PASTEL", "PAVO", "PEKÍN", "PELÍCULA", "PELOTÓN", "PENDIENTE", "PERRO", "PEZ", "PICO", "PIE", "PIEZA", "PILA", "PILOTO", "PINCHO", "PINGÜINO", "PINTA", "PIÑA", "PIRÁMIDE", "PIRATA", "PISTA", "PISTOLA", "PLACA", "PLANO", "PLANTA", "PLÁTANO", "PLAYA", "PLOMO", "PLUMA", "POLICÍA", "POLO", "PORTADA", "PORTERO", "POTRO", "PRENSA", "PRIMA", "PRINCESA", "PUENTE", "PUERTO", "PULPO", "PULSO", "PUNTA", "PUNTO", "RADIO", "RASCACIELOS", "RATÓN", "RAYO", "RED", "REGLA", "REINA", "RESERVA", "REVOLUCIÓN", "REY", "ROBOT", "ROJO", "ROMA", "RONDA", "ROSA", "RULETA", "SABLE", "SÁHARA", "SALSA", "SATÉLITE", "SATURNO", "SEÑAL", "SERIE", "SERPIENTE", "SIERRA", "SILLA", "SIRENA", "SOBRE", "SOLDADO", "SUBMARINISTA", "SUERTE", "SUPERHÉROE", "TABLA", "TABLETA", "TACO", "TACTO", "TALÓN", "TANQUE", "TAPA", "TARDE", "TEATRO", "TECLADO", "TELESCOPIO", "TESTIGO", "TIEMPO", "TIENDA", "TIERRA", "TOKIO", "TOPO", "TORRE", "TRAMA", "TRONCO", "TUBERÍA", "TUBO", "UNICORNIO", "VACÍO", "ISLA", "VAMPIRO", "VELA", "VENENO", "VENUS", "VESTIDO", "VIDA", "VIDRIO", "VIENTO", "YEMA", "ZANAHORIA", "ZAPATO", 
    "Yerba", "Final", "Anteojos", "Ahogado", "Ultimátum", "Control", "psicópata", "diagnóstico", "situación", "auto",
    "salida", "equipaje", "movimiento", "moneda", "impresión", "progreso", "extranjero", "all star",
    "Nutella", "rico", "discurso", "maceta", "Cristina", "presidencial", "programación", "espejo", "llanto", "local", "arcoiris",
    "pensamiento", "luminoso", "perforacion", "caluroso", "recordatorio", "cancion", "seguridad", "crear", "arte",
    "secreto", "mentira", "instrucciones", "britney", "pinza", "angel", "netflix", "instagram", "recepcion", "partir",
    "recreo", "entretenimiento", "crucero", "aeropuerto", "termostato", "PERON", "POLITICA", "GREENPEACE", "FOCO", "SODA",
    "PERCHA", "TIRO", "ECOLOGICO", "DON QUIJOTE", "CARBON", "BOMBILLA", "ESTETOSCOPIO", "ZOOM", "STAR WARS", "PERGAMINO", "MOMIA",
    "IBUPROFENO", "VELA", "PROA", "CORTINA", "BEATLES", "MARADONA", "DULCE", "RAPPI", "TRUCHA", "TRAVESÍA",
    "RECETA", "IDIOMA", "TERRAZA", "MELODÍA", "BICICLETA", "PIMIENTA", "MANIJA", "NARGUILA", "CHINO",
    "LOCUTOR", "ROCK", "MARILYN", "UKELELE", "PIÑATA", "INSULTO", "PARQUE", "BOLETÍN", "ROSS", "SENSUAL", "MILANESA", "discapacidad", "ACCIDENTE"
];
var cards = [];

function getCssProperty(elmId, property) {
    var elem = document.getElementById(elmId);
    return window.getComputedStyle(elem, null).getPropertyValue(property);
}
function getElement(id) {
    let div = document.getElementById(id);
    return div;
}