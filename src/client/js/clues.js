inputClue.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        socket.emit('newClue', document.getElementById("inputClue").value)
    }
});
socket.on('newClue', function (clueWord) {
    addClue(clueWord);
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