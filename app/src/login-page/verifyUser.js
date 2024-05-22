import { getUserData, setUserData } from "./userData.js";

const dialog = document.getElementById("dialog");
const userData = getUserData();
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
  document.getElementById("deleteUserButton").style.display = "none";
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

document.getElementById("deleteUserButton").addEventListener("click", () => {
  showConfirmationDialog(
    "¿Estás seguro de que deseas eliminar tu cuenta?",
    async (confirmed) => {
      if (confirmed) {
        // Mostrar el loader
        document.getElementById("loader").style.display = "flex";
        document.body.style.overflow = "hidden";

        await deleteUser();

        // Ocultar el loader
        document.getElementById("loader").style.display = "none";
        document.body.style.overflow = "auto";

        setUserData("", "", "", "");
        window.location.href = "../home-page/index.html";
      }
    }
  );
});

async function deleteUser() {
  try {
    const response = await fetch(
      `https://final-proyect-db.onrender.com/deleteUser/${userData.idUser}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Error al eliminar la cuenta");
    }

    const data = await response.json();
    window.location.reload(); // Recargar la página
  } catch (error) {
    window.alert("Hubo un error al eliminar la cuenta: " + error.message);
  }
}

function showConfirmationDialog(message, callback) {
  document.body.style.overflow = "hidden";
  const confirmationDialog = document.createElement("div");
  confirmationDialog.classList.add("confirmation-dialog");

  const dialogBox = document.createElement("div");
  dialogBox.classList.add("dialog-box");

  const messageElement = document.createElement("p");
  messageElement.textContent = message;

  const yesButton = document.createElement("button");
  yesButton.textContent = "Sí";
  yesButton.classList.add("dialog-button");
  yesButton.addEventListener("click", () => {
    document.body.style.overflow = "auto";
    document.body.removeChild(confirmationDialog);
    callback(true);
  });

  const noButton = document.createElement("button");
  noButton.textContent = "No";
  noButton.classList.add("dialog-button");
  noButton.addEventListener("click", () => {
    document.body.style.overflow = "auto";
    document.body.removeChild(confirmationDialog);
    callback(false);
  });

  dialogBox.appendChild(messageElement);
  dialogBox.appendChild(yesButton);
  dialogBox.appendChild(noButton);
  confirmationDialog.appendChild(dialogBox);
  document.body.appendChild(confirmationDialog);
}
