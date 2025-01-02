document.addEventListener("DOMContentLoaded", function () {
  // Función para validar y enviar formulario
  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const nameInput = form.querySelector('input[name="name"]');
    const phoneInput = form.querySelector('input[name="phone"]');
    const submitButton = form.querySelector('button[type="submit"]');
    const loadingDiv = form.querySelector(".loading");
    const formId = form.id || "unknownForm";
    const timestamp = new Date().toLocaleString('es-EC', { timeZone: 'America/Guayaquil' });

    try {
      // Mostrar loading
      if (loadingDiv) loadingDiv.classList.remove("hidden");

      // Validar nombre
      const namePattern = /^[A-Za-záéíóúñÁÉÍÓÚÑ\s]+$/;
      if (!namePattern.test(nameInput.value.trim())) {
        throw new Error("El nombre solo debe contener letras y espacios");
      }

      // Validar teléfono
      const phonePattern = /^\+593\d{9}$/;
      if (!phonePattern.test(phoneInput.value.trim())) {
        throw new Error("El teléfono debe tener el formato +593XXXXXXXXX");
      }

      // Deshabilitar el botón
      submitButton.disabled = true;

      // Preparar los datos
      const formData = {
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        timestamp: timestamp,
        landingPage: 'Fixinol',
        formType: formId,
      };

      // Enviar los datos
      const response = await fetch("/api/form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      // Si la respuesta fue exitosa, redirigir
      if (response.ok) {
        window.location.href = "/gracias.html";
        return;
      } else {
        throw new Error(result.message || "Error al procesar la solicitud");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error: " + error.message);
    } finally {
      // Ocultar loading y habilitar botón
      if (loadingDiv) loadingDiv.classList.add("hidden");
      submitButton.disabled = false;
    }
  }

  // Agregar el manejador a todos los formularios
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", handleSubmit);
  });

  // Manejo de navegación suave
  document.querySelectorAll(".navigate").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("data-target");
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Mostrar el popup al hacer clic en el botón .feedback
  const feedbackButton = document.querySelector(".feedback");
  const popupWindow = document.querySelector(".popup-window");
  const closePopupButton = document.querySelector(".close-popup");

  if (feedbackButton && popupWindow) {
    feedbackButton.addEventListener("click", () => {
      popupWindow.style.display = "block";
    });
  }

  // Cerrar el popup al hacer clic en .close-popup
  if (closePopupButton && popupWindow) {
    closePopupButton.addEventListener("click", () => {
      popupWindow.style.display = "none";
    });
  }

  // Cerrar popup con tecla ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popupWindow.classList.contains("active")) {
      closePopupHandler();
    }
  });
});
