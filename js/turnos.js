let servicios = [];

// Función para cargar los servicios desde el archivo JSON
async function cargarServicios() {
    try {
        const response = await fetch('../json/servicios.json');
        if (!response.ok) {
            throw new Error('Error al cargar el archivo JSON');
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
            throw new Error('Los servicios no están en el formato adecuado');
        }
        servicios = data;
        console.log("Servicios cargados:", servicios);
        actualizarOpcionesServicios();
    } catch (error) {
        console.error("Error al cargar los servicios:", error);
        alert("No se pudieron cargar los servicios. Inténtelo más tarde.");
    }
}

document.addEventListener("DOMContentLoaded", function() {
    try {
        if (window.location.pathname.includes('turnos.html')) {
            const usuarioLogueado = JSON.parse(localStorage.getItem("loggedInUser"));
            if (!usuarioLogueado || typeof usuarioLogueado !== 'object') {
                Swal.fire({
                    title: "Acceso Denegado",
                    text: "Debes estar registrado para reservar un turno.",
                    icon: "warning",
                    confirmButtonText: "Aceptar"
                }).then(() => {
                    window.location.href = "../pages/login.html";
                });
            }
        }
    } catch (error) {
        console.error("Error al verificar el usuario logueado:", error);
    }
});

// Actualizar las opciones del select de servicios en el formulario
function actualizarOpcionesServicios() {
    try {
        const selectServicio = document.getElementById("servicio");
        if (!selectServicio) {
            throw new Error("El elemento select para servicios no existe");
        }
        selectServicio.innerHTML = '<option selected disabled>Servicios</option>';
        servicios.forEach(servicio => {
            if (!servicio.nombre) {
                console.warn("Servicio sin nombre encontrado:", servicio);
                return;
            }
            const option = document.createElement("option");
            option.value = servicio.nombre;
            option.text = servicio.nombre;
            selectServicio.appendChild(option);
        });
    } catch (error) {
        console.error("Error al actualizar las opciones de servicios:", error);
    }
}

// Clase para manejar la información del cliente
class Cliente {
    constructor(nombre, apellido, email, telefono) {
        this.nombre = nombre || "Desconocido";
        this.apellido = apellido || "Desconocido";
        this.email = email || "Sin correo";
        this.telefono = telefono || "Sin teléfono";
        this.historialCliente = [];
    }

    agregarCita(fecha, hora, servicio, precio, estado) {
        if (!fecha || !hora || !servicio || !precio) {
            console.error("Datos incompletos para agregar cita");
            return;
        }
        const nuevaCita = { fecha, hora, servicio, precio, estado };
        this.historialCliente.push(nuevaCita);
        console.log("Nueva cita agregada:", nuevaCita);
    }
}

// Almacenar información del cliente en el localStorage
function guardarClienteLocalStorage(cliente) {
    try {
        if (!(cliente instanceof Cliente)) {
            throw new Error("El objeto proporcionado no es una instancia válida de Cliente");
        }
        let clientes = cargarClientesLocalStorage();
        const clienteExistenteIndex = clientes.findIndex(c => c.nombre === cliente.nombre && c.apellido === cliente.apellido);

        if (clienteExistenteIndex !== -1) {
            clientes[clienteExistenteIndex] = cliente;
        } else {
            clientes.push(cliente);
        }

        localStorage.setItem("clientes", JSON.stringify(clientes));
        console.log("Cliente guardado en localStorage:", cliente);
    } catch (error) {
        console.error("Error al guardar en localStorage:", error);
        alert("Hubo un problema al guardar la información. Por favor, inténtalo de nuevo.");
    }
}

// Cargar todos los clientes del localStorage
function cargarClientesLocalStorage() {
    try {
        let clientesData = localStorage.getItem("clientes");
        if (!clientesData) return [];
        let clientes = JSON.parse(clientesData);
        if (!Array.isArray(clientes)) {
            throw new Error("Los clientes en localStorage no tienen el formato adecuado");
        }
        return clientes.map(cliente => {
            const nuevoCliente = new Cliente(cliente.nombre, cliente.apellido, cliente.email, cliente.telefono);
            nuevoCliente.historialCliente = cliente.historialCliente || [];
            return nuevoCliente;
        });
    } catch (error) {
        console.error("Error al cargar clientes de localStorage:", error);
        return [];
    }
}

// Función para mostrar todos los clientes en la consola con detalles de sus citas
function mostrarClientesEnConsola() {
    try {
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
    } catch (error) {
        console.error("Error al mostrar los clientes en la consola:", error);
    }
}

// Función para obtener el precio de un servicio
function obtenerPrecioServicio(servicio) {
    try {
        if (!servicio) {
            console.error("El servicio proporcionado no es válido");
            return 0;
        }
        const servicioSeleccionado = servicios.find(s => s.nombre === servicio);
        const precio = servicioSeleccionado ? servicioSeleccionado.precio : 0;
        console.log("Precio obtenido para el servicio:", servicio, "es:", precio);
        return precio;
    } catch (error) {
        console.error("Error al obtener el precio del servicio:", error);
        return 0;
    }
}

// Función para obtener las horas ocupadas en una fecha específica por todos los clientes
function obtenerHorasOcupadas(fecha) {
    try {
        let clientes = cargarClientesLocalStorage();
        let horasOcupadas = [];

        clientes.forEach(cliente => {
            const citasEnLaFecha = cliente.historialCliente.filter(cita => cita.fecha === fecha);
            horasOcupadas = horasOcupadas.concat(citasEnLaFecha.map(cita => cita.hora));
        });

        console.log("Horas ocupadas en la fecha seleccionada:", horasOcupadas);
        return horasOcupadas;
    } catch (error) {
        console.error("Error al obtener las horas ocupadas:", error);
        return [];
    }
}

// Función para deshabilitar los domingos en el calendario
function deshabilitarDomingos() {
    const inputFecha = document.getElementById("fecha");

    inputFecha.addEventListener("input", function () {
        if (this.value) {
            const selectedDate = new Date(this.value + 'T00:00:00');
            const selectedDay = selectedDate.getDay();

            console.log("Día seleccionado (0 para domingo, 1 para lunes, etc.):", selectedDay);

            if (selectedDay === 0) {
                Swal.fire({
                    title: "Reserva no disponible",
                    text: "No se pueden reservar turnos los domingos. Por favor, elige otro día.",
                    icon: "warning",
                    confirmButtonText: "Aceptar"
                });
                this.value = '';
            }
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
    try {
        const horasTotales = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];
        const horasOcupadas = obtenerHorasOcupadas(fecha);
        return horasTotales.filter(hora => !horasOcupadas.includes(hora));
    } catch (error) {
        console.error("Error al obtener horas disponibles:", error);
        return [];
    }
}

// Función para actualizar los horarios tachados
function actualizarHorarioDisponibilidad() {
    try {
        const fechaSeleccionada = document.getElementById("fecha").value;
        const horasOcupadas = obtenerHorasOcupadas(fechaSeleccionada);
        const horarioInput = document.getElementById("horario");

        const opcionesHorario = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

        horarioInput.innerHTML = "";

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
    } catch (error) {
        console.error("Error al actualizar la disponibilidad de horarios:", error);
    }
}

// Escuchar los cambios en la fecha para actualizar las horas disponibles y colores de día
document.getElementById("fecha").addEventListener("change", function () {
    actualizarHorarioDisponibilidad();
    colorearDiasDisponibilidad();
});

// Manejo del formulario de turnos
const turnosForm = document.getElementById("turnosForm");

turnosForm.addEventListener("submit", function (e) {
    e.preventDefault();

    try {
        const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellido").value;
        const telefono = document.getElementById("telefono").value;
        const email = document.getElementById("email").value;
        const servicio = document.getElementById("servicio").value;
        const fecha = document.getElementById("fecha").value;
        const hora = document.getElementById("horario").value;

        console.log("Formulario enviado con los siguientes datos:", { nombre, apellido, telefono, email, servicio, fecha, hora });

        const fechaSeleccionada = new Date(fecha + 'T00:00:00');
        if (fechaSeleccionada.getDay() === 0) {
            alert("No se pueden reservar turnos los domingos. Por favor, elige otro día.");
            return;
        }

        if (!nombre || !apellido || !telefono || !email || !servicio || !fecha || !hora) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const precio = obtenerPrecioServicio(servicio);
        let clienteCargado = cargarClientesLocalStorage().find(c => c.nombre === nombre && c.apellido === apellido);

        if (!clienteCargado) {
            clienteCargado = new Cliente(nombre, apellido, email, telefono);
        } else {
            clienteCargado = new Cliente(clienteCargado.nombre, clienteCargado.apellido, clienteCargado.email, clienteCargado.telefono);
            clienteCargado.historialCliente = clienteCargado.historialCliente || [];
        }

        clienteCargado.agregarCita(fecha, hora, servicio, precio, "Esperando feedback");

        guardarClienteLocalStorage(clienteCargado);

        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (loggedInUser) {
            const users = JSON.parse(localStorage.getItem("users")) || [];
            const userIndex = users.findIndex(user => user.email === loggedInUser.email);

            if (userIndex !== -1) {
                const reserva = { fecha, hora, servicio, precio, estado: "Esperando feedback" };
                users[userIndex].orders.push(reserva);
                localStorage.setItem("users", JSON.stringify(users));
                localStorage.setItem("loggedInUser", JSON.stringify(users[userIndex]));
            }
        }

        Swal.fire({
            title: "¡Cita reservada con éxito!",
            text: "Nos pondremos en contacto contigo pronto.",
            icon: "success",
            confirmButtonText: "Aceptar"
        }).then(() => {
            window.location.href = "../index.html";
        });

        turnosForm.reset();
        actualizarHorarioDisponibilidad();
    } catch (error) {
        console.error("Error en el proceso de reserva de cita:", error);
        alert("Ocurrió un error al procesar la reserva. Por favor, inténtelo de nuevo.");
    }
});

// Cargar la información del cliente al cargar la página
window.onload = function () {
    try {
        cargarServicios();
        deshabilitarDomingos();
        actualizarHorarioDisponibilidad();
        mostrarClientesEnConsola();
    } catch (error) {
        console.error("Error al cargar la página:", error);
    }
};








