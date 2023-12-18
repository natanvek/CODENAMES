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
function spyCounter() {
    if (!spyCount) {
        spyCount++;
        socket.emit('spyClicked')
    }
}
function spymasterFunc(correct) {
    spyCounter();
    if (correct != undefined||spyCount==2) {
        spyCount=2;
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