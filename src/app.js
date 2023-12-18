console.log('Hello World!')
var express = require('express');
const {
    send
} = require('process');
const {
    SSL_OP_SSLEAY_080_CLIENT_DH_BUG
} = require('constants');
const {
    time
} = require('console');
var app = express();
var serv = require('http').Server(app);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html')
});
app.use('/client', express.static(__dirname + '/client'))

serv.listen(process.env.PORT || 2000)
console.log("Server started.");

function match() {
    this.SOCKET_LIST = {};
    this.gameCards;
    this.SPY_LIST = {};
    this.spyPressed = 0;
    this.clues = [];
    this.timer = "05:00";
    this.clockCounter = 0;
    this.clockInterval;
    this.name;
}
var matches = {};
var SOCKET_LIST = {};

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function (socket) {
    console.log('socket connection');
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    socket.on('created', function (setUp) {
        let thisMatch = matches[socket.match]
        thisMatch.gameCards = setUp;
        thisMatch.SPY_LIST = {};
        thisMatch.spyPressed = 0;
        thisMatch.clues = [];
        thisMatch.timer = "05:00"; //no resetear clckcounter
        thisMatch.spyPass = undefined;
        clearInterval(thisMatch.clockInterval)
        emitThings(thisMatch, 'start', thisMatch.gameCards)
    })

    socket.on('newMatch', function (name) {
        if (matches[name] != undefined) {
            socket.emit('repetido')
        } else {
            socket.match = name;
            matches[name] = new match();
            let thisMatch = matches[name]
            thisMatch.SOCKET_LIST[socket.id] = socket;
            thisMatch.name = name;
            socket.emit('start', thisMatch.gameCards); //tiene que ser lo primero after el on created
            if (thisMatch.clockCounter != 0) {
                socket.emit('clockSetUp', [thisMatch.timer, thisMatch.clockCounter % 2]);
            }
            socket.emit('spyClicked', thisMatch.spyPressed);

            for (let i = 0; i < thisMatch.clues.length; i++) {
                socket.emit('newClue', thisMatch.clues[i]);
            }
        }
    })
    socket.on('enterMatch', function (name) {
        if (matches[name] != undefined) {
            let thisMatch = matches[name];
            socket.match = name;
            thisMatch.SOCKET_LIST[socket.id] = socket;
            socket.emit('start', thisMatch.gameCards); //tiene que ser lo primero after el on created
            if (thisMatch.clockCounter != 0) {
                socket.emit('clockSetUp', [thisMatch.timer, thisMatch.clockCounter % 2]);
            }
            socket.emit('spyClicked', thisMatch.spyPressed);

            for (let i = 0; i < thisMatch.clues.length; i++) {
                socket.emit('newClue', thisMatch.clues[i]);
            }
        }
    })
    socket.on('clickedWord', function (position) {
        let thisMatch = matches[socket.match]
        thisMatch.gameCards[position].clicked = true;
        emitThings(thisMatch, 'clickedWord', position);
    })


    socket.on('clickClock', function (position) {
        let thisMatch = matches[socket.match]
        thisMatch.timer = "05:00"
        thisMatch.clockCounter++;
        if (thisMatch.clockCounter == 1) {
            thisMatch.clockInterval = setInterval(function () {
                clock(thisMatch)
            }, 1000)
        }
        emitThings(thisMatch, 'clickClock', position);
    })

    socket.on('addedWord', function (words) {
        emitThings(matches[socket.match], 'addedWord', words);
    })

    socket.on('newClue', function (clueWord) {
        matches[socket.match].clues.push(clueWord);
        emitThings(matches[socket.match], 'newClue', clueWord);
    })

    socket.on('deleteClue', function (number) {
        matches[socket.match].clues.splice(number, 1)
        emitThings(matches[socket.match], 'deleteClue', number)
    })

    socket.on('spyPass', function (pass) {
        matches[socket.match].spyPass = pass;
    })

    socket.on('spyClicked', function () {
        socket.emit('spyPass', matches[socket.match].spyPass)
    })
    socket.on('correctSpy', function () {
        matches[socket.match].spyPressed++;
        matches[socket.match].SPY_LIST[socket.id] = socket;
        emitThings(matches[socket.match], 'spyClicked', undefined);
    })

    socket.on('disconnect', function () {
        if (matches[socket.match] != undefined) {
            delete matches[socket.match].SOCKET_LIST[socket.id];
            if (matches[socket.match].SPY_LIST[socket.id] != undefined) {
                matches[socket.match].spyPressed--;
                emitThings(matches[socket.match], 'spyClicked', matches[socket.match].spyPressed)
            }
            if (Object.keys(matches[socket.match].SOCKET_LIST).length == 0) {
                setTimeout(function () {
                    if (Object.keys(matches[socket.match].SOCKET_LIST).length == 0) {
                        delete matches[socket.match];
                    }
                }, 100000)
            }
        }
    });

});

function clock(thisMatch) {
    let mins = parseInt(thisMatch.timer.charAt(0)) * 10 + parseInt(thisMatch.timer.charAt(1))
    let secs = parseInt(thisMatch.timer.charAt(3)) * 10 + parseInt(thisMatch.timer.charAt(4))
    if (!secs) {
        mins -= 1;
        secs = 59;
    } else {
        secs -= 1;
    }
    thisMatch.timer = ("00" + mins).slice(-2) + ":" + ("00" + secs).slice(-2)
}

function emitThings(thisMatch, code, thing) {
    for (var i in thisMatch.SOCKET_LIST) {
        var socket = thisMatch.SOCKET_LIST[i];
        socket.emit(code, thing);
    }
}