// Información del local
const infoLocal = {
    nombreLocal: "Bixler Nails Studio",
    direccion: "C. de los Pinos 600, Hacienda los Morales 2do Sector, 66495 San Nicolás de los Garza, N.L.",
    telefono: "12345678",
    horarioApertura: "9:00 AM",
    horarioCierre: "7:00 PM",
    diasAbierto: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
};

console.log(infoLocal);

// Servicios ofrecidos
const servicios = [
    { nombre: "Gelish", precio: 200 },
    { nombre: "Manicure Gelish", precio: 300 },
    { nombre: "Uñas Esculpidas", precio: 350 },
    { nombre: "Uñas Esculpidas + Gelish", precio: 400 },
];

console.table(servicios);

// Clase para manejar la información del cliente
class Cliente {
    constructor(nombre, apellido, email, telefono) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.telefono = telefono;
        this.historialCliente = [];
    }

    agregarCita(fecha, hora, servicio, precio, estado) {
        const nuevaCita = {
            fecha,
            hora,
            servicio,
            precio,
            estado,
        };
        this.historialCliente.push(nuevaCita);
    }
}

// Almacenar información del cliente en el localStorage
function guardarClienteLocalStorage(cliente) {
    localStorage.setItem("infoCliente", JSON.stringify(cliente));
}

// Recuperar información del cliente del localStorage
function cargarClienteLocalStorage() {
    let clienteData = localStorage.getItem("infoCliente");
    if (clienteData) {
        return JSON.parse(clienteData);
    }
    return null;
}

// Función para obtener el precio de un servicio
function obtenerPrecioServicio(servicio) {
    const servicioSeleccionado = servicios.find(s => s.nombre === servicio);
    return servicioSeleccionado ? servicioSeleccionado.precio : 0;
}

// Función para obtener las horas ocupadas en una fecha específica
function obtenerHorasOcupadas(fecha) {
    let clienteCargado = cargarClienteLocalStorage();
    if (clienteCargado) {
        const cliente = new Cliente(
            clienteCargado.nombre,
            clienteCargado.apellido,
            clienteCargado.email,
            clienteCargado.telefono
        );
        cliente.historialCliente = clienteCargado.historialCliente;

        const citasEnLaFecha = cliente.historialCliente.filter(cita => cita.fecha === fecha);
        return citasEnLaFecha.map(cita => cita.hora);
    }
    return [];
}

// Función para actualizar las opciones del horario según disponibilidad
function actualizarHorarioDisponibilidad() {
    const fechaSeleccionada = document.getElementById("fecha").value;
    const horasOcupadas = obtenerHorasOcupadas(fechaSeleccionada);
    const horarioInput = document.getElementById("horario");

    // Hacer que solo muestre horas en punto
    const opcionesHorario = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

    horarioInput.innerHTML = ""; // Limpiar las opciones existentes

    opcionesHorario.forEach(hora => {
        if (!horasOcupadas.includes(hora)) {
            const option = document.createElement("option");
            option.value = hora;
            option.text = hora;
            horarioInput.appendChild(option);
        }
    });
}

// Escuchar los cambios en la fecha para actualizar las horas disponibles
document.getElementById("fecha").addEventListener("change", actualizarHorarioDisponibilidad);

// Manejo del formulario de turnos
const turnosForm = document.getElementById("turnosForm");
const mensajeCliente = document.getElementById("mensajeCliente");

turnosForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const telefono = document.getElementById("telefono").value;
    const email = document.getElementById("email").value;
    const servicio = document.getElementById("servicio").value;
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("horario").value;

    // Verificar campos vacíos
    if (!nombre || !apellido || !telefono || !email || !servicio || !fecha || !hora) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const precio = obtenerPrecioServicio(servicio);
    let clienteCargado = cargarClienteLocalStorage();
    let cliente;

    if (clienteCargado) {
        cliente = new Cliente(
            clienteCargado.nombre,
            clienteCargado.apellido,
            clienteCargado.email,
            clienteCargado.telefono
        );
        cliente.historialCliente = clienteCargado.historialCliente;
    } else {
        cliente = new Cliente(nombre, apellido, email, telefono);
    }

    cliente.agregarCita(fecha, hora, servicio, precio, "Esperando feedback");

    guardarClienteLocalStorage(cliente);

    mensajeCliente.classList.remove("d-none");
    mensajeCliente.innerText = "¡Cita reservada con éxito!";
    setTimeout(() => {
        window.location.href = "../index.html";
    }, 2000);

    turnosForm.reset();
    actualizarHorarioDisponibilidad();
});

// Cargar la información del cliente al cargar la página
window.onload = function () {
    actualizarHorarioDisponibilidad(); // Cargar disponibilidad al cargar la página
};
