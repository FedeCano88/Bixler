document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();
    // Mostrar alerta de SweetAlert2
    Swal.fire({
        title: "¡Mensaje enviado con éxito!",
        text: "Nos pondremos en contacto contigo pronto.",
        icon: "success",
        confirmButtonText: "Aceptar"
    }).then(() => {
        // Enviar el formulario al servidor
        this.submit(); // Envía el formulario después de que el usuario haga clic en "Aceptar"
    });
});