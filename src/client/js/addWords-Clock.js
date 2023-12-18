socket.on('addedWord', function (newWords) {
    words = newWords;
})
inputWords.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        addWords();
    }
});////
function addWords() {
    let actualWord = "";
    if (inputWords.value.charAt(inputWords.value.length - 1) != ',') {
        inputWords.value += ','
    }
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
    document.getElementById('clock').getElementsByTagName('span')[0].innerHTML = info[0];
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