class User {
  idUser; //int
  passwordUser; //String
  nameUser; //String
  lastNameUser; //String
  documentUser; //String
  emailUser; //String
  phoneNumberUser; //int
  adressUser; //String
  typeUser; //String
  createdAt; //Date
  updatedAt; //Date
}

const form = document.getElementById("registerUser");
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Evitar el envío del formulario por defecto
  if (!checkPasswordMatch()) {
    alert("Las contraseñas no coinciden. Por favor, inténtelo de nuevo.");
    return; // Detener el proceso si las contraseñas no coinciden
  }
  const infoUser = new User();
  infoUser.nameUser = document.getElementById("nameUser").value;
  infoUser.lastNameUser = document.getElementById("lastNameUser").value;
  infoUser.documentUser = document
    .getElementById("documentUser")
    .value.toString();
  infoUser.emailUser = document.getElementById("emailUser").value;
  infoUser.phoneNumberUser = document
    .getElementById("phoneNumberUser")
    .value.toString();
  infoUser.adressUser = document.getElementById("adressUser").value;
  infoUser.passwordUser = document.getElementById("passwordUser").value;
  infoUser.typeUser = "Usuario";

  console.log(infoUser);
  try {
    const result = await fetch("https://q4l2x4sw-3000.use2.devtunnels.ms/createUser ", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(infoUser),
    });
    if (result.ok) {
      console.log("User created successfully");
      alert("Usuario creado exitosamente. Por favor, inicia sesión.");
      setTimeout(() => {
        window.location.href = "../login-page/index.html";
      });
    }
  } catch (error) {
    console.log(error);
  }
});

function checkPasswordMatch() {
  var password = document.getElementById("passwordUser").value;
  var confirmPassword = document.getElementById("confirmPasswordUser").value;
  var errorElement = document.getElementById("passwordMatchError");

  if (password !== confirmPassword) {
    errorElement.style.display = "block";
    return false; // Evitar envío del formulario
  } else {
    errorElement.style.display = "none";
    return true; // Permitir envío del formulario
  }
}
