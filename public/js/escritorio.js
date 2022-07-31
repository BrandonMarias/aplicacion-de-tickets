const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has("escritorio")) {
  window.location = "/";
}

const escritorio = searchParams.get("escritorio");

if (!escritorio.trim()) {
  window.location = "/";
}

const nombreEscritorio = document.getElementById("nombreEscritorio")
nombreEscritorio.textContent = escritorio;
const atendiendoCliente = document.getElementById("atendiendoCliente")

const socket = io();
const btnAtender = document.getElementById("btnAtender")
const alerta = document.getElementById("alerta")
const enCola = document.getElementById("enCola")

socket.on("connect", () => {
    btnAtender.disable = false
})

socket.on("disconnect", () => {
    btnAtender.disable = true;
})

socket.on("en-cola",(cola) => {
    enCola.textContent = cola;
    if (cola > 0) {
        alerta.classList.add("d-none")
    }
})


btnAtender.addEventListener("click", () => {

    socket.emit("atender-ticket", {escritorio}, ({ok, ticket, msg}) => {
        if (!ok) {
            alerta.classList.remove("d-none")
            atendiendoCliente.textContent = `Nadie`
            return console.error(msg)
        }
        enCola.textContent = Number(enCola.textContent) - 1
        atendiendoCliente.textContent = `Cliente numero ${ticket.numero}`

    })
})