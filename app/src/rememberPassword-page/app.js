const changePasswordForm = document.getElementById("changePasswordForm");

changePasswordForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!checkPasswordMatch()) {
    alert("Las contraseñas no coinciden. Por favor, intenta de nuevo.");
    return;
  }

  const email = document.getElementById("email").value;
  const newPassword = document.getElementById("newPassword").value;

  const changePasswordData = {
    email: email,
    newPassword: newPassword,
  };

  try {
    const response = await fetch("http://localhost:3000/changePassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(changePasswordData),
    });

    if (response.ok) {
      console.log("Contraseña cambiada exitosamente");
      alert(
        "Contraseña cambiada exitosamente. Por favor, inicia sesión con tu nueva contraseña."
      );
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
  }
});

function checkPasswordMatch() {
  const newPassword = document.getElementById("newPassword").value;
  const confirmPasswordUser =
    document.getElementById("confirmPasswordUser").value;
  const errorElement = document.getElementById("passwordMatchError");

  if (newPassword !== confirmPasswordUser) {
    errorElement.style.display = "block";
    return false;
  } else {
    errorElement.style.display = "none";
    return true;
  }
}
