import { getUserData, setUserData } from "./userData.js";

document.getElementById("logged-in").addEventListener("click", async () => {
  try {
    // Obtiene los datos del usuario almacenados en localStorage
    const userData = getUserData();

    // Verifica si existen datos de usuario
    if (
      userData.idUser !== "" &&
      userData.nameUser !== "" &&
      userData.lastNameUser !== "" &&
      userData.typeUser !== ""
    ) {
      // Si hay datos de usuario, procede con la lógica deseada (por ejemplo, verificar o redirigir)
      const dialog = document.getElementById("dialog");
      dialog.style.display = "flex";
      document
        .getElementById("reservationsButton")
        .addEventListener("click", () => {
          // Redirigir a la página de reservas
          window.location.href = "./booking-page/index.html";
          // Ocultar el cuadro de diálogo después de redirigir
          dialog.style.display = "none";
        });

      // Agregar evento click al botón "Cerrar sesión"
      document.getElementById("logoutButton").addEventListener("click", () => {
        // Borrar la información de userData y recargar la página
        setUserData("", "", "", ""); // Borra los datos de userData
        window.location.reload(); // Recarga la página actual
      });
      document.getElementById("closeBlockButton").addEventListener("click", () => {
        window.location.reload(); // Recarga la página actual
      });
      // Aquí puedes realizar otras acciones, como redirigir a otra página o ejecutar más lógica de la aplicación
    } else {
      // Si no hay datos de usuario, redirige al formulario de inicio de sesión
      window.location.href = "../login-page/index.html";
    }
  } catch (error) {
    console.error("Error al verificar el usuario:", error);
  }
});
