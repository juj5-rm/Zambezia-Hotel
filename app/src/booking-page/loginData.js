import { getUserData } from "../login-page/userData.js";
const userData = getUserData();

document.getElementById("iduser").value = userData["idUser"];
