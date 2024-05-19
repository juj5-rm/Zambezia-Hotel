// Importa la función setUserData desde el archivo especificado (sin 'default')
import { setUserData } from "./userData.js";

// Event listener para el formulario de inicio de sesión
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(
      "https://q4l2x4sw-3000.use2.devtunnels.ms/verifyUser",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailUser: email,
          passwordUser: password,
        }),
      }
    );

    if (response.ok) {
      const userDataResponse = await response.json();

      // Actualiza y guarda los datos del usuario usando setUserData
      setUserData(
        userDataResponse.idUser,
        userDataResponse.nameUser,
        userDataResponse.lastNameUser,
        userDataResponse.typeUser
      );

      alert("Sesión iniciada correctamente");
        window.location.href = "../home-page/index.html";
    } else {
      alert("Credenciales incorrectas. Por favor, inténtelo de nuevo.");
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
  }
});
