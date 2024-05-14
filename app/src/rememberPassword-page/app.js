function checkPasswordMatch() {
  var password = document.getElementById("newPassword").value;
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
