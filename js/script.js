// Información del local
const infoLocal = {
    nombreLocal: "Bixler Nails Studio",
    direccion: "C. de los Pinos 600, Hacienda los Morales 2do Sector, 66495 San Nicolás de los Garza, N.L.",
    telefono: "12345678",
    horarioApertura: "9:00 AM",
    horarioCierre: "7:00 PM",
    diasAbierto: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
};

console.log("Información del local:", infoLocal);

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
        console.log("Nueva cita agregada:", nuevaCita);
    }
}

// Almacenar información del cliente en el localStorage
function guardarClienteLocalStorage(cliente) {
    localStorage.setItem("infoCliente", JSON.stringify(cliente));
    console.log("Cliente guardado en localStorage:", cliente);
}

// Recuperar información del cliente del localStorage
function cargarClienteLocalStorage() {
    let clienteData = localStorage.getItem("infoCliente");
    if (clienteData) {
        console.log("Cliente cargado desde localStorage:", clienteData);
        return JSON.parse(clienteData);
    }
    console.log("No se encontró información de cliente en localStorage.");
    return null;
}

// Función para obtener el precio de un servicio
function obtenerPrecioServicio(servicio) {
    const servicioSeleccionado = servicios.find(s => s.nombre === servicio);
    const precio = servicioSeleccionado ? servicioSeleccionado.precio : 0;
    console.log("Precio obtenido para el servicio:", servicio, "es:", precio);
    return precio;
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
        const horasOcupadas = citasEnLaFecha.map(cita => cita.hora);
        console.log("Horas ocupadas en la fecha seleccionada:", horasOcupadas);
        return horasOcupadas;
    }
    console.log("No se encontraron horas ocupadas para la fecha:", fecha);
    return [];
}

// Función para actualizar las opciones del horario según disponibilidad
function actualizarHorarioDisponibilidad() {
    const fechaSeleccionada = document.getElementById("fecha").value;
    console.log("Fecha seleccionada para actualizar disponibilidad:", fechaSeleccionada);
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

    console.log("Opciones de horario actualizadas según la disponibilidad.");
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

    console.log("Formulario enviado con los siguientes datos:");
    console.log({ nombre, apellido, telefono, email, servicio, fecha, hora });

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
    mensajeCliente.innerHTML = "<strong>¡Cita reservada con éxito!</strong>";
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