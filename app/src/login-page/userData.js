let userData = {
  idUser: "",
  nameUser: "",
  lastNameUser: "",
  typeUser: "",
};

function setUserData(idUser, nameUser, lastNameUser, typeUser) {
  userData.idUser = idUser;
  userData.nameUser = nameUser;
  userData.lastNameUser = lastNameUser;
  userData.typeUser = typeUser;

  // Almacena userData en sessionStorage
  sessionStorage.setItem("userData", JSON.stringify(userData));
}

function getUserData() {
  // Obtiene userData desde sessionStorage al inicio de la sesión
  const storedUserData = sessionStorage.getItem("userData");
  if (storedUserData) {
    return JSON.parse(storedUserData);
  } else {
    return userData; // Devuelve userData por defecto si no hay datos en sessionStorage
  }
}

export { setUserData, getUserData };
