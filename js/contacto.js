document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre")?.value || "";
    const email = document.getElementById("email")?.value || "";
    const mensaje = document.getElementById("mensaje")?.value || "";

    if (!nombre || !email || !mensaje) {
        Swal.fire({
            title: "Error",
            text: "Todos los campos son obligatorios.",
            icon: "error",
            confirmButtonText: "Aceptar"
        });
        return;
    }

    Swal.fire({
        title: "¡Mensaje enviado con éxito!",
        text: "Nos pondremos en contacto contigo pronto.",
        icon: "success",
        confirmButtonText: "Aceptar"
    }).then(() => {
        try {
            this.submit();
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
        }
    });
});