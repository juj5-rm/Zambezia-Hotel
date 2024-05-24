// Importa la función setUserData desde el archivo especificado (sin 'default')
import { setUserData } from "./userData.js";

window.onload = function () {
  // Ocultar el loader
  document.getElementById("loader").style.display = "none";
  document.body.style.overflow = "auto";
};

// Event listener para el formulario de inicio de sesión
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Mostrar el loader
  document.getElementById("loader").style.display = "flex";
  document.body.style.overflow = "hidden";

  try {
    const response = await fetch(
      "https://final-proyect-db.onrender.com/verifyUser",
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
      window.location.href = "../home-page/index.html";
    } else {
      alert("Credenciales incorrectas. Por favor, inténtelo de nuevo.");
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
  } finally {
    // Ocultar el loader
    document.getElementById("loader").style.display = "none";
    document.body.style.overflow = "auto";
  }
});


const emailField = document.getElementById("email");

function toLowerCase() {
  emailField.value = emailField.value.toLowerCase();
}

emailField.addEventListener("input", toLowerCase);
emailField.addEventListener("blur", toLowerCase);