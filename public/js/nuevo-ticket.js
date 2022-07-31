const lblNuevoTicket = document.getElementById("lblNuevoTicket")
const btnNuevoTicket = document.getElementById("btnNuevoTicket")

const socket = io();

socket.on("connect", () => {
    btnNuevoTicket.disable = false
})

socket.on("disconnect", () => {
    btnNuevoTicket.disable = true;
})

socket.on("ultimo-ticket", (ticket) => {
    lblNuevoTicket.textContent = `Turno numero ${ticket}`;
})


btnNuevoTicket.addEventListener("click", () => {
    socket.emit("siguiente-ticket", null, (ticket) => {
        lblNuevoTicket.textContent = `Turno numero ${ticket}`;
    })
})