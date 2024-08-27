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

// Variable para almacenar los servicios cargados desde el JSON
let servicios = [];

// Función para cargar los servicios desde el archivo JSON
async function cargarServicios() {
    try {
        const response = await fetch('../json/servicios.json'); // Asegúrate de que la ruta sea correcta
        if (!response.ok) {
            throw new Error('Error al cargar el archivo JSON');
        }
        servicios = await response.json();
        console.log("Servicios cargados:", servicios);
        actualizarOpcionesServicios();
    } catch (error) {
        console.error("Error al cargar los servicios:", error);
    }
}

// Actualizar las opciones del select de servicios en el formulario
function actualizarOpcionesServicios() {
    const selectServicio = document.getElementById("servicio");
    selectServicio.innerHTML = '<option selected disabled>Servicios</option>'; // Limpiar opciones previas
    servicios.forEach(servicio => {
        const option = document.createElement("option");
        option.value = servicio.nombre;
        option.text = servicio.nombre;
        selectServicio.appendChild(option);
    });
}

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
    try {
        let clientes = cargarClientesLocalStorage();
        const clienteExistenteIndex = clientes.findIndex(c => c.nombre === cliente.nombre && c.apellido === cliente.apellido);
        
        if (clienteExistenteIndex !== -1) {
            clientes[clienteExistenteIndex] = cliente;
        } else {
            clientes.push(cliente);
        }

        localStorage.setItem("clientes", JSON.stringify(clientes));
        console.log("Cliente guardado en localStorage:");
        console.log(cliente);
    } catch (error) {
        console.error("Error al guardar en localStorage:", error);
        alert("Hubo un problema al guardar la información. Por favor, inténtalo de nuevo.");
    }
}

// Cargar todos los clientes del localStorage
function cargarClientesLocalStorage() {
    try {
        let clientesData = localStorage.getItem("clientes");
        if (clientesData) {
            return JSON.parse(clientesData);
        }
        return [];
    } catch (error) {
        console.error("Error al cargar clientes de localStorage:", error);
        return [];
    }
}

// Función para mostrar todos los clientes en la consola con detalles de sus citas
function mostrarClientesEnConsola() {
    const clientes = cargarClientesLocalStorage();
    if (clientes.length === 0) {
        console.log("No hay clientes registrados.");
    } else {
        clientes.forEach(cliente => {
            const citasInfo = cliente.historialCliente.map(cita => ({
                Nombre: cliente.nombre,
                Apellido: cliente.apellido,
                Teléfono: cliente.telefono,
                Email: cliente.email,
                Servicio: cita.servicio,
                Precio: cita.precio,
                Día: cita.fecha,
                Horario: cita.hora
            }));
            console.table(citasInfo);
        });
    }
}

// Función para obtener el precio de un servicio
function obtenerPrecioServicio(servicio) {
    const servicioSeleccionado = servicios.find(s => s.nombre === servicio);
    const precio = servicioSeleccionado ? servicioSeleccionado.precio : 0;
    console.log("Precio obtenido para el servicio:", servicio, "es:", precio);
    return precio;
}

// Función para obtener las horas ocupadas en una fecha específica por todos los clientes
function obtenerHorasOcupadas(fecha) {
    let clientes = cargarClientesLocalStorage();
    let horasOcupadas = [];

    clientes.forEach(cliente => {
        const citasEnLaFecha = cliente.historialCliente.filter(cita => cita.fecha === fecha);
        horasOcupadas = horasOcupadas.concat(citasEnLaFecha.map(cita => cita.hora));
    });

    console.log("Horas ocupadas en la fecha seleccionada:", horasOcupadas);
    return horasOcupadas;
}

// Función para deshabilitar los domingos en el calendario
function deshabilitarDomingos() {
    const inputFecha = document.getElementById("fecha");
    const date = new Date();
    const today = date.toISOString().split('T')[0];

    inputFecha.setAttribute('min', today); // Establecer fecha mínima como hoy

    inputFecha.addEventListener("input", function () {
        const selectedDate = new Date(this.value);
        if (selectedDate.getDay() === 0) {
            alert("No se pueden reservar turnos los domingos. Por favor, elige otro día.");
            this.value = ''; // Limpiar la selección
        }
    });
}

// Función para colorear días según disponibilidad
function colorearDiasDisponibilidad() {
    const inputFecha = document.getElementById("fecha");
    const horasDisponibles = obtenerHorasDisponibles(inputFecha.value);

    if (horasDisponibles.length >= 6) {
        inputFecha.classList.add("verde");
        inputFecha.classList.remove("amarillo", "rojo");
    } else if (horasDisponibles.length >= 3 && horasDisponibles.length <= 5) {
        inputFecha.classList.add("amarillo");
        inputFecha.classList.remove("verde", "rojo");
    } else if (horasDisponibles.length <= 2) {
        inputFecha.classList.add("rojo");
        inputFecha.classList.remove("verde", "amarillo");
    }
}

// Función para obtener la disponibilidad de horas
function obtenerHorasDisponibles(fecha) {
    const horasTotales = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];
    const horasOcupadas = obtenerHorasOcupadas(fecha);
    return horasTotales.filter(hora => !horasOcupadas.includes(hora));
}

// Función para actualizar los horarios tachados
function actualizarHorarioDisponibilidad() {
    const fechaSeleccionada = document.getElementById("fecha").value;
    const horasOcupadas = obtenerHorasOcupadas(fechaSeleccionada);
    const horarioInput = document.getElementById("horario");

    const opcionesHorario = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

    horarioInput.innerHTML = ""; // Limpiar las opciones existentes

    opcionesHorario.forEach(hora => {
        const option = document.createElement("option");
        option.value = hora;
        option.text = hora;

        if (horasOcupadas.includes(hora)) {
            option.classList.add("tachado");
            option.disabled = true;
        }

        horarioInput.appendChild(option);
    });

    console.log("Opciones de horario actualizadas según la disponibilidad.");
}

// Escuchar los cambios en la fecha para actualizar las horas disponibles y colores de día
document.getElementById("fecha").addEventListener("change", function () {
    actualizarHorarioDisponibilidad();
    colorearDiasDisponibilidad();
});

// Manejo del formulario de turnos
const turnosForm = document.getElementById("turnosForm");
const mensajeCliente = document.getElementById("mensajeCliente");

turnosForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

    try {
        const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellido").value;
        const telefono = document.getElementById("telefono").value;
        const email = document.getElementById("email").value;
        const servicio = document.getElementById("servicio").value;
        const fecha = document.getElementById("fecha").value;
        const hora = document.getElementById("horario").value;

        console.log("Formulario enviado con los siguientes datos:");
        console.log({ nombre, apellido, telefono, email, servicio, fecha, hora });

        // Verificar si la fecha seleccionada es domingo
        const fechaSeleccionada = new Date(fecha);
        if (fechaSeleccionada.getDay() === 0) {
            alert("No se pueden reservar turnos los domingos. Por favor, elige otro día.");
            return;
        }

        // Verificar campos vacíos
        if (!nombre || !apellido || !telefono || !email || !servicio || !fecha || !hora) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const precio = obtenerPrecioServicio(servicio);
        let clienteCargado = cargarClientesLocalStorage().find(c => c.nombre === nombre && c.apellido === apellido);

        if (!clienteCargado) {
            clienteCargado = new Cliente(nombre, apellido, email, telefono);
        }

        clienteCargado.agregarCita(fecha, hora, servicio, precio, "Esperando feedback");

        guardarClienteLocalStorage(clienteCargado);

        mensajeCliente.classList.remove("d-none");
        mensajeCliente.innerHTML = "<strong>¡Cita reservada con éxito!</strong>";
        setTimeout(() => {
            window.location.href = "../index.html";
        }, 2000);

        turnosForm.reset();
        actualizarHorarioDisponibilidad();
    } catch (error) {
        console.error("Error en el proceso de reserva de cita:", error);
        alert("Ocurrió un error al procesar la reserva. Por favor, inténtelo de nuevo.");
    }
});

// Cargar la información del cliente al cargar la página
window.onload = function () {
    cargarServicios(); // Cargar servicios desde JSON
    deshabilitarDomingos(); // Deshabilitar domingos al cargar la página
    actualizarHorarioDisponibilidad(); // Cargar disponibilidad al cargar la página
    mostrarClientesEnConsola(); // Mostrar clientes en consola al cargar la página
};

// Ejemplo de funciones async y await
async function verificarDisponibilidad(fecha, hora) {
    try {
        let respuesta = await fetch(`https://api.ejemplo.com/disponibilidad?fecha=${fecha}&hora=${hora}`);
        let datos = await respuesta.json();
        return datos.disponible;
    } catch (error) {
        console.error("Error al verificar la disponibilidad:", error);
        return false;
    }
}

async function procesarReserva() {
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("horario").value;
    const disponible = await verificarDisponibilidad(fecha, hora);
    
    if (!disponible) {
        alert("La fecha y hora seleccionadas no están disponibles. Por favor, elige otra.");
        return;
    }

    // Continuar con el procesamiento de la reserva...
}



