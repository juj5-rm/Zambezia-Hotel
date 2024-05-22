import { getUserData } from "../login-page/userData.js";

// Llama a getUserData para obtener los datos del usuario
const userData = getUserData();

// Espera a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {
  const servicios = document.querySelectorAll(".gridservicios .servicio");
  const habitaciones = document.querySelectorAll(".gridservicios .habitacion");
  const descripciones = document.querySelectorAll(
    ".descripciones .serviciodescripcion"
  );
  const descripcioneshabitaciones = document.querySelectorAll(
    ".descripciones .habitaciondescripcion"
  );

  function resetservice() {
    servicios.forEach((servicio) => servicio.classList.remove("active"));
    descripciones.forEach(
      (descripcion) => (descripcion.style.display = "none")
    );
  }
  // Función para reiniciar colores y ocultar todas las descripciones
  function resetroom() {
    habitaciones.forEach((room) => room.classList.remove("active"));
    descripcioneshabitaciones.forEach(
      (descripcionhabitacion) => (descripcionhabitacion.style.display = "none")
    );
  }

  // Añadir el evento de clic a cada servicio
  servicios.forEach((servicio, index) => {
    servicio.addEventListener("click", function () {
      resetservice(); // Reiniciar todos los estilos y descripciones
      this.classList.add("active"); // Añadir clase 'active' al servicio clickeado
      descripciones[index].style.display = "flex"; // Mostrar la descripción correspondiente
    });
  });

  habitaciones.forEach((habitacion, index) => {
    habitacion.addEventListener("click", function () {
      resetroom(); // Reiniciar todos los estilos y descripciones
      this.classList.add("active"); // Añadir clase 'active' al servicio clickeado
      descripcioneshabitaciones[index].style.display = "flex"; // Mostrar la descripción correspondiente
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const carousels = document.querySelectorAll(".carrusel");

  carousels.forEach((carrusel) => {
    const items = carrusel.querySelectorAll(".itemCarrusel");
    let currentIndex = 0;

    function showSlide(index) {
      items.forEach((item, idx) => {
        item.classList.toggle("active", idx === index);
      });
    }

    function navigateCarousel(e) {
      e.preventDefault();
      const targetId = e.target.closest("a").getAttribute("href").slice(1);
      const targetIndex = [...items].findIndex((item) => item.id === targetId);
      if (targetIndex !== -1) {
        currentIndex = targetIndex;
        showSlide(currentIndex);
      }
    }

    carrusel.querySelectorAll(".flechaCarrusel a").forEach((anchor) => {
      anchor.addEventListener("click", navigateCarousel);
    });

    showSlide(currentIndex);
  });
});
