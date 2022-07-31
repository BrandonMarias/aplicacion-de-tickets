const fs = require("fs");
const path = require("path");

class Ticket {
    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }
}

class TicketContorller {
    constructor() {
        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = [];
        this.ultimosTickets = [];

        this.init();
    }

    get toJson() {
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimosTickets: this.ultimosTickets,
        };
    }

    init() {
        const {
            hoy,
            tickets,
            ultimo,
            ultimosTickets,
        } = require("../db/data.json");
        if (hoy === this.hoy) {
            this.ultimo = ultimo;
            this.tickets = tickets;
            this.ultimosTickets = ultimosTickets;
        } else {
            //es otro dia
            this.guardarDb();
        }
    }

    guardarDb() {
        const dbPath = path.join(__dirname, "../db/data.json");
        fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
    }

    siguiente() {
        this.ultimo++;
        const ticket = new Ticket(this.ultimo, null);
        this.tickets.push(ticket);

        this.guardarDb();

        return ticket.numero;
    }

    atenderTickets(escritorio) {
        if (this.tickets.length === 0) {
            return null;
        }

        const ticket = this.tickets.shift();

        ticket.escritorio = escritorio;

        this.ultimosTickets.unshift(ticket);

        if (this.ultimosTickets.length > 4) {
            this.ultimosTickets.pop();
        }

        this.guardarDb();
        return ticket;
    }
}

module.exports = TicketContorller;
