module.exports = {
    instance: {

    }
};
var websocket = {

};
function setUpWebsockets() {
    var socket = null;

    function connect() {
        console.log("Begin connect");
        socket = new WebSocket("ws://" + window.location.hostname + ":8080/ws");

        socket.onerror = function (e) {
            console.error("socket error");
            console.error(e);
        };

        socket.onopen = function () {
            write("Connected");
            socket.send("HELLO MAN");
        };

        socket.onclose = function () {
            write("Disconnected");
            // setTimeout(connect, 5000);
        };

        socket.onmessage = function (event) {
            received(event.data.toString());
        };
    }

    function received(message) {
        console.log(message)
    }

    function write(text) {
        console.log(text);
    }


    connect();
}
