document.addEventListener("DOMContentLoaded", function() {
    // Verificar si hay un usuario logueado almacenado en localStorage
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
        mostrarNombreUsuario(loggedInUser);
        activarDropdownUsuario(loggedInUser);
        mostrarDashboardUsuario(loggedInUser);
    }

    // Manejo del formulario de registro
    const registroForm = document.getElementById("registroForm");
    if (registroForm) {
        registroForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            // Validaciones de campos
            if (!username || !email || !password) {
                Swal.fire({
                    title: "Error",
                    text: "Todos los campos son obligatorios.",
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });
                return;
            }

            // Verificar si ya existe un usuario con el mismo email en localStorage
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

            // Simular una llamada fetch a un servidor para registrar el usuario
            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/posts', { // URL de ejemplo
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });

                if (!response.ok) throw new Error('Error al registrar el usuario');

                // Crear un objeto de usuario y guardar en localStorage
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
                    window.location.href = "./login.html"; 
                });
            } catch (error) {
                Swal.fire({
                    title: "Error",
                    text: "Hubo un problema al registrar el usuario.",
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });
                console.error("Error en el registro:", error);
            }
        });
    }

    // Manejo del formulario de login
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;

            // Validaciones de campos
            if (!email || !password) {
                Swal.fire({
                    title: "Error",
                    text: "Por favor, complete ambos campos.",
                    icon: "warning",
                    confirmButtonText: "Aceptar"
                });
                return;
            }

            // Simular una llamada fetch a un servidor para verificar el login
            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', { // URL de ejemplo
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) throw new Error('Email o contraseña incorrectos');

                // Validar las credenciales del usuario localmente
                let users = JSON.parse(localStorage.getItem("users")) || [];
                const user = users.find(u => u.email === email && u.password === password);

                if (user) {
                    localStorage.setItem("loggedInUser", JSON.stringify(user));
                    mostrarNombreUsuario(user);
                    activarDropdownUsuario(user);
                    mostrarDashboardUsuario(user);

                    Swal.fire({
                        title: "¡Bienvenido!",
                        text: "Login exitoso.",
                        icon: "success",
                        confirmButtonText: "Aceptar"
                    }).then(() => {
                        window.location.href = "../index.html"; 
                    });
                } else {
                    Swal.fire({
                        title: "Error",
                        text: "Email o contraseña incorrectos.",
                        icon: "error",
                        confirmButtonText: "Aceptar"
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: "Error",
                    text: "Hubo un problema al iniciar sesión.",
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });
                console.error("Error en el login:", error);
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
            userDropdown.classList.remove("d-none");
        }

        const logoutButton = document.getElementById("logoutButton");
        if (logoutButton) {
            logoutButton.addEventListener("click", function() {
                localStorage.removeItem("loggedInUser");
                window.location.reload();
            });
        }
    }

    function mostrarDashboardUsuario(user) {
        const userDashboard = document.getElementById("userDashboard");
        const usernameDisplay = document.getElementById("usernameDisplay");
        if (userDashboard && usernameDisplay) {
            userDashboard.classList.remove("d-none");
            usernameDisplay.innerText = user.username;
            actualizarHistorialPedidos(user.orders);
        }
    }

    function actualizarHistorialPedidos(orders) {
        const orderHistory = document.getElementById("orderHistory");
        if (orderHistory) {
            orderHistory.innerHTML = '';
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








