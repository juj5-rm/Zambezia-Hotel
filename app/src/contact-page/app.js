window.onload = function () {
  // Ocultar el loader
  document.getElementById("loader").style.display = "none";
  document.body.style.overflow = "auto";
};

const buttonMessage = document.getElementById("buttonMessage");

buttonMessage.addEventListener("click", async () => {
  const user = document.getElementById("nameUser").value;
  const email = document.getElementById("emailUser").value;
  const message = document.getElementById("messageUser").value;
  // Mostrar el loader
  document.getElementById("loader").style.display = "flex";
  document.body.style.overflow = "hidden";
  try {
    const response = await fetch(
      "https://final-proyect-db.onrender.com/sendEmail",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user,
          email: email,
          message: message,
        }),
      }
    );
    alert("Mensaje enviado correctamente");
  } catch (error) {
    console.log(error);
    alert("Error al enviar el mensaje");
  } finally {
    user.value = "";
    email.value = "";
    message.value = "";
    // Ocultar el loader
    document.getElementById("loader").style.display = "none";
    document.body.style.overflow = "auto";
  }

});
