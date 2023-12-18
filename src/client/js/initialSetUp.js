socket.on('start', function (setUp) {
    getElement('home').style.display = "none";
    getElement('game').style.display = "block";
    nextGameFunc(setUp)
})
socket.on('repetido', function () {
    alert("YA EXISTE UN PARTIDO CON ESE NOMBRE")
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
function clickedWord(position) {
    cards[position].clicked = true;
    cards[position].div.style.backgroundColor = colorsClicked[cards[position].state];
    if (cards[position].state)
        cards[position].div.getElementsByTagName('span')[0].style.color = "white";
    remainingWords();
    if (cards[position].state == 3) {
        spyCount=2;
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
        spyCount=2;
        spymasterFunc();
    }
    document.getElementById("remainingBlue").innerHTML = remainingBlue + "";
    document.getElementById("remainingRed").innerHTML = remainingRed + "";

}
function updateGameState() {
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].clicked) {
            clickedWord(i);
        }
    }
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
                        if (colorsClicked[cards[i].state] != getCssProperty('clockLetters', 'color')&&cards[i].clicked==false) {
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
    let palabrasRojas = 8
    let random = Math.floor(Math.random() * 2) + palabrasRojas;
    for (let i = 0; i < random; i++) {
        cards[numbers[i]].state = 1;
    }
    for (let i = random; i < palabrasRojas*2+1; i++) {
        cards[numbers[i]].state = 2;
    }
    cards[numbers[palabrasRojas*2+1]].state = 3;
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
