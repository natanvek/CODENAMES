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
function createTeams() {
    if(getElement("players").value<=16&&getElement("players").value%1==0&&getElement("teams").value<=4&&getElement("teams").value%1==0){
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
}

function newMatch(){
    socket.emit('newMatch',getElement('newMatchInput').value)
}
function enterMatch(){
    socket.emit('enterMatch',getElement('enterMatchInput').value)
}