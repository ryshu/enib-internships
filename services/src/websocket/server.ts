import socketIO from 'socket.io';

class WebSocketServer {
    public io: socketIO.Server;

    constructor() {
        this.io = null;
    }

    public setIO(io: socketIO.Server) {
        this.io = io;
    }
}

const wss = new WebSocketServer();
export default wss;
