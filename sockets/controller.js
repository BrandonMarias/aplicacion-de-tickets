const TicketContorller = require("../models/TicketController");

const ticketController = new TicketContorller();

const socketController = (socket) => {
    socket.emit("ultimo-ticket", ticketController.ultimo);
    socket.emit("en-cola", ticketController.tickets.length);
    socket.emit("estado-actual", ticketController.ultimosTickets)

    socket.on("siguiente-ticket", (payload, callback) => {
        const siguiente = ticketController.siguiente();
        socket.broadcast.emit("ultimo-ticket", ticketController.ultimo);
        socket.broadcast.emit("en-cola", ticketController.tickets.length);
        callback(siguiente);
    });

    socket.on("atender-ticket", ({ escritorio }, callback) => {
        if (!escritorio) {
            return callback({ ok: false, msg: "escritorio obligatorio" });
        }

        const ticket = ticketController.atenderTickets(escritorio);

        if (!ticket) {
            return callback({ ok: false, msg: "no hay tickets pendientes" });
        }

        socket.broadcast.emit("en-cola", ticketController.tickets.length);
        socket.broadcast.emit("estado-actual", ticketController.ultimosTickets)
        callback({ ok: true, ticket });
    });
};

module.exports = {
    socketController,
};
