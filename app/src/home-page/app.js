import { getUserData } from "../login-page/userData.js";

// Llama a getUserData para obtener los datos del usuario
const userData = getUserData();

// Imprime los datos del usuario en la consola
console.log("Datos del usuario:", userData);

// Espera a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {
  const servicios = document.querySelectorAll(".gridservicios .servicio");
  const descripciones = document.querySelectorAll(
    ".descripciones .serviciodescripcion"
  );

  // Función para reiniciar colores y ocultar todas las descripciones
  function resetAll() {
    servicios.forEach((servicio) => servicio.classList.remove("active"));
    descripciones.forEach(
      (descripcion) => (descripcion.style.display = "none")
    );
  }

  // Añadir el evento de clic a cada servicio
  servicios.forEach((servicio, index) => {
    servicio.addEventListener("click", function () {
      resetAll(); // Reiniciar todos los estilos y descripciones
      this.classList.add("active"); // Añadir clase 'active' al servicio clickeado
      descripciones[index].style.display = "flex"; // Mostrar la descripción correspondiente
    });
  });
});
