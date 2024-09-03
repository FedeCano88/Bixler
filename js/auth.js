document.addEventListener("DOMContentLoaded", function() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
        mostrarNombreUsuario(loggedInUser);
        activarDropdownUsuario(loggedInUser);
        mostrarDashboardUsuario(loggedInUser); // Mostrar el dashboard si el usuario está logueado
    }

    // Manejo del formulario de registro
    const registroForm = document.getElementById("registroForm");
    if (registroForm) {
        registroForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            // Verificar si ya existe un usuario con el mismo email
            let users = JSON.parse(localStorage.getItem("users")) || [];
            if (users.some(u => u.email === email)) {
                Swal.fire({
                    title: "Error",
                    text: "Este email ya está registrado.",
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });
                return;
            }

            // Crear un objeto de usuario
            const user = { username, email, password, orders: [] };

            users.push(user);
            localStorage.setItem("users", JSON.stringify(users));

            Swal.fire({
                title: "Registro Exitoso",
                text: "¡Te has registrado exitosamente!",
                icon: "success",
                confirmButtonText: "Aceptar"
            }).then(() => {
                document.getElementById("registroForm").reset();
                window.location.href = "login.html"; // Redirige al login después de registrarse
            });
        });
    }

    // Manejo del formulario de login
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;

            if (!email || !password) {
                Swal.fire({
                    title: "Error",
                    text: "Por favor, complete ambos campos.",
                    icon: "warning",
                    confirmButtonText: "Aceptar"
                });
                return;
            }

            let users = JSON.parse(localStorage.getItem("users")) || [];
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                Swal.fire({
                    title: "¡Bienvenido!",
                    text: "Login exitoso.",
                    icon: "success",
                    confirmButtonText: "Aceptar"
                }).then(() => {
                    localStorage.setItem("loggedInUser", JSON.stringify(user));
                    mostrarNombreUsuario(user);
                    activarDropdownUsuario(user);
                    mostrarDashboardUsuario(user);
                    window.location.href = "../index.html"; // Redirige al dashboard después de iniciar sesión
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Email o contraseña incorrectos.",
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });
            }
        });
    }

    function mostrarNombreUsuario(user) {
        const usuarioNombreDisplay = document.getElementById("usuarioNombreDisplay");
        if (usuarioNombreDisplay) {
            usuarioNombreDisplay.innerText = user.username;
        }
    }

    function activarDropdownUsuario(user) {
        const userDropdown = document.getElementById("userDropdown");
        if (userDropdown) {
            userDropdown.classList.remove("d-none"); // Mostrar el dropdown del usuario
        }

        const logoutButton = document.getElementById("logoutButton");
        if (logoutButton) {
            logoutButton.addEventListener("click", function() {
                localStorage.removeItem("loggedInUser"); // Elimina al usuario logueado de localStorage
                window.location.reload(); // Recarga la página para actualizar la UI
            });
        }
    }

    function mostrarDashboardUsuario(user) {
        const userDashboard = document.getElementById("userDashboard");
        const usernameDisplay = document.getElementById("usernameDisplay");
        if (userDashboard && usernameDisplay) {
            userDashboard.classList.remove("d-none"); // Mostrar el dashboard
            usernameDisplay.innerText = user.username; // Mostrar el nombre del usuario en el dashboard
            actualizarHistorialPedidos(user.orders); // Actualiza el historial de pedidos en el dashboard
        }
    }

    function actualizarHistorialPedidos(orders) {
        const orderHistory = document.getElementById("orderHistory");
        if (orderHistory) {
            orderHistory.innerHTML = ''; // Limpiar el historial previo
            orders.forEach(order => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${order.servicio}</td>
                    <td>${order.fecha}</td>
                    <td>${order.hora}</td>
                    <td>${order.precio}</td>
                    <td>${order.estado}</td>
                `;
                orderHistory.appendChild(row);
            });
        }
    }
});






