export function NotificationService() {

    var SOCKET_EVENT_CONNECTION = "connection";
    var SOCKET_EVENT_CREATED = "created";
    var SOCKET_EVENT_STATE_CHANGED = "state_changed";

    let http = require('http');
    let websocket_port = 8081;
    let websocket;

    this.start = (app) => {
        let httpServer = http.createServer(app);
        httpServer.listen(websocket_port);
        let socket_io = require('socket.io')(httpServer);
        socket_io.on(SOCKET_EVENT_CONNECTION, function (socket) {
            websocket = socket;
        });
    }

    this.broadcastNewConversion = (file) => {
        websocket.emit(SOCKET_EVENT_CREATED, file);
    }

    this.broadcastStateChanged = (id, status) => {
        websocket.emit(SOCKET_EVENT_STATE_CHANGED, id, status);
    }
}
