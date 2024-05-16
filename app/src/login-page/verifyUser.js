import { getUserData, setUserData } from "./userData.js";

const dialog = document.getElementById("dialog");

document.getElementById("logged-in").addEventListener("click", async () => {
  try {
    const userData = getUserData();

    if (
      userData.idUser !== "" &&
      userData.nameUser !== "" &&
      userData.lastNameUser !== "" &&
      userData.typeUser !== ""
    ) {
      dialog.style.display = "flex";
    } else {
      window.location.href = "../login-page/index.html";
    }
  } catch (error) {
    console.error("Error al verificar el usuario:", error);
  }
});

// Agrega eventos para mostrar/ocultar el diálogo al pasar el cursor sobre el área
dialog.addEventListener("mouseover", () => {
  dialog.style.display = "flex";
});

dialog.addEventListener("mouseout", () => {
  dialog.style.display = "none";
});

// Agregar eventos a los botones dentro del diálogo
document.getElementById("reservationsButton").addEventListener("click", () => {
  window.location.href = "../booking-page/index.html";
  dialog.style.display = "none";
});

document.getElementById("logoutButton").addEventListener("click", () => {
  setUserData("", "", "", "");
  window.location.reload();
});

