import { getUserData, setUserData } from "./userData.js";

const dialog = document.getElementById("dialog");
const userData = getUserData();
console.log(userData);
document.getElementById("logged-in").style.cursor = "pointer";

document.getElementById("logged-in").addEventListener("click", async () => {
  try {
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

if (userData.typeUser === "client") {
  document.getElementById("adminButton").style.display = "none";
}
if (userData.typeUser === "admin") {
  document.getElementById("adminButton").addEventListener("click", () => {
    window.location.href = "../admin-page/index.html";
    dialog.style.display = "none";
  });
}

// Agregar eventos a los botones dentro del diálogo
document.getElementById("reservationsButton").addEventListener("click", () => {
  window.location.href = "../mibooking-page/index.html";
  dialog.style.display = "none";
});

document.getElementById("logoutButton").addEventListener("click", () => {
  setUserData("", "", "", "");
  window.location.reload();
  window.location.href = "../home-page/index.html";
});

document
  .getElementById("deleteUserButton")
  .addEventListener("click", async () => {
    await deleteUser();
    setUserData("", "", "", "");
    window.location.href = "../home-page/index.html";
  });

async function deleteUser() {
  try {
    const response = await fetch(
      `https://q4l2x4sw-3000.use2.devtunnels.ms/deleteUser/${userData.idUser}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Error al eliminar la reserva");
    }

    const data = await response.json();
    window.location.reload(); // Recargar la página
  } catch (error) {
    window.alert("Hubo un error al eliminar la reserva: " + error.message);
  }
}
