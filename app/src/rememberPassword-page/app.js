const changePasswordForm = document.getElementById("changePasswordForm");

window.onload = () => {
  // Ocultar el loader
  document.getElementById("loader").style.display = "none";
  document.body.style.overflow = "auto";
};

changePasswordForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!checkPasswordMatch()) {
    alert("Las contraseñas no coinciden. Por favor, intenta de nuevo.");
    return;
  }

  const email = document.getElementById("email").value;
  const newPassword = document.getElementById("newPassword").value;

  // Mostrar el loader
  document.getElementById("loader").style.display = "flex";
  document.body.style.overflow = "hidden";

  try {
    const response = await fetch(
      "https://final-proyect-db.onrender.com/changePassword/" + email,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          passwordUser: newPassword,
        }),
      }
    );

    if (response.ok) {
      console.log("Contraseña cambiada exitosamente");
      window.location.href = "../login-page/index.html";
    } else {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Hubo un problema al cambiar la contraseña."
      );
    }
  } catch (error) {
    console.error(error);
    alert(
      "Hubo un error al cambiar la contraseña. Por favor, intenta de nuevo."
    );
  } finally {
    // Ocultar el loader
    document.getElementById("loader").style.display = "none";
    document.body.style.overflow = "auto";
  }
});

function checkPasswordMatch() {
  const newPassword = document.getElementById("newPassword").value;
  const confirmPasswordUser = document.getElementById(
    "confirmPasswordUser"
  ).value;
  const errorElement = document.getElementById("passwordMatchError");

  if (newPassword !== confirmPasswordUser) {
    errorElement.style.display = "block";
    return false;
  } else {
    errorElement.style.display = "none";
    return true;
  }
}

const emailField = document.getElementById("email");

function toLowerCase() {
  emailField.value = emailField.value.toLowerCase();
}

emailField.addEventListener("input", toLowerCase);
emailField.addEventListener("blur", toLowerCase);
