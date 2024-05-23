import { getUserData } from "../login-page/userData.js";
const userData = getUserData();

async function getBooking(idUser) {
  try {
    const response = await fetch(
      `https://final-proyect-db.onrender.com/getBookings/${idUser}`,
      {
        method: "GET",
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

async function loadBookings() {
  var bookings = await getBooking(userData.idUser);
  // Seleccionar el cuerpo de la tabla
  var tableBody = document.querySelector("#BookingsView tbody");
  // Eliminar la fila de "noResults" si existe
  var noResultsRow = document.querySelector(".noResults");
  if (noResultsRow) {
    tableBody.removeChild(noResultsRow);
  }

  if (bookings.length === 0) {
    // Si no hay reservas, volver a mostrar la fila "noResults"
    document.getElementById("loader").style.display = "none";
    document.body.style.overflow = "hidden";
    var noResultsRow = document.createElement("tr");
    noResultsRow.className = "noResults";
    noResultsRow.innerHTML = `
  <td colspan="6">
    <i class="fa-solid fa-magnifying-glass"></i><br />
    En este momento no has realizado ninguna reserva
  </td>`;
    tableBody.appendChild(noResultsRow);
  } else {
    document.getElementById("loader").style.display = "none";
    document.body.style.overflow = "hidden";
    // Iterar sobre las reservas y añadir filas a la tabla
    bookings.forEach((booking) => {
      var row = document.createElement("tr");

      // Añadir ID de reserva
      var tdId = document.createElement("td");
      tdId.textContent = booking.idBooking;
      row.appendChild(tdId);

      // Añadir Fecha de llegada
      var tdFechaLlegada = document.createElement("td");
      tdFechaLlegada.textContent = formatDate(booking.startDate);
      row.appendChild(tdFechaLlegada);

      // Añadir Fecha de salida
      var tdFechaSalida = document.createElement("td");
      tdFechaSalida.textContent = formatDate(booking.endDate);
      row.appendChild(tdFechaSalida);

      // Añadir Tipo de habitación
      var tdHabitacion = document.createElement("td");
      tdHabitacion.textContent = booking.nameTypeRoom;
      row.appendChild(tdHabitacion);

      // Añadir Número de habitación
      var tdNumeroHabitacion = document.createElement("td");
      tdNumeroHabitacion.textContent = booking.numberRoom;
      row.appendChild(tdNumeroHabitacion);

      // Añadir botones de acción
      var tdAccion = document.createElement("td");

      // Crear botón de modificar con icono y título
      var buttonModificar = document.createElement("button");
      buttonModificar.className = "buttonBooking";
      buttonModificar.title = "Modificar";
      buttonModificar.onclick = () => {
        modificateBooking(booking);
      };

      var iconModificar = document.createElement("i");
      iconModificar.className = "fa-solid fa-pencil";
      buttonModificar.appendChild(iconModificar);

      tdAccion.appendChild(buttonModificar);

      // Crear botón de cancelar con texto
      var buttonCancelar = document.createElement("button");
      buttonCancelar.className = "buttonBooking";
      buttonCancelar.title = "Cancelar";
      buttonCancelar.onclick = () => {
        deleteBooking(booking.idBooking);
      };

      var iconCancelar = document.createElement("i");
      iconCancelar.className = "fa-solid fa-trash-can";
      buttonCancelar.appendChild(iconCancelar);

      tdAccion.appendChild(buttonCancelar);

      row.appendChild(tdAccion);

      // Añadir la fila al cuerpo de la tabla
      tableBody.appendChild(row);
    });
  }
}

window.onload = () => {
  validationid();
  loadBookings();
};

var fechaActual = new Date();

document
  .getElementById("finishDateReservation")
  .addEventListener("change", function () {
    validationde();
  });

function validationde() {
  var startDateInput = document.getElementById("startDateReservation").value;
  var endDateInput = document.getElementById("finishDateReservation").value;

  var startDate = new Date(startDateInput);
  var endDate = new Date(endDateInput);

  if (endDate <= startDate) {
    document.getElementById("error2").style.display = "flex";
    return false;
  } else {
    document.getElementById("error2").style.display = "none";
    return true;
  }
}

document
  .getElementById("startDateReservation")
  .addEventListener("change", function () {
    validationds();
  });

function validationds() {
  var startDateInput = document.getElementById("startDateReservation").value;
  var startDate = new Date(startDateInput);
  var fechaFormateada = new Date(
    fechaActual.getFullYear(),
    fechaActual.getMonth(),
    fechaActual.getDate()
  );

  if (startDate < fechaFormateada) {
    document.getElementById("error").style.display = "flex";
    return false;
  } else {
    document.getElementById("error").style.display = "none";
    return true;
  }
}

function validationid() {
  if (userData.idUser == "") {
    window.alert("Por favor, inicie sesión para continuar."); // Muestra un mensaje de alerta
    window.location.href = "../login-page/index.html"; // Devuelve true si el campo de identificación no está vacío
  }
}

async function deleteBooking(idBooking) {
  document.getElementById("loader").style.display = "flex";
  document.body.style.overflow = "hidden";
  try {
    const response = await fetch(
      `https://final-proyect-db.onrender.com/deleteBooking/${idBooking}`,
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
    console.log(error);
    window.alert("Hubo un error al eliminar la reserva: " + error.message);
  }
}

function modificateBooking(booking) {
  document.getElementById("modificacionReserva").style.display = "flex";
  document.getElementById("vistaTablaReservas").style.display = "none";
  document.getElementById("startDateReservation").value =
    booking.startDate.split("T")[0];
  document.getElementById("finishDateReservation").value =
    booking.endDate.split("T")[0];
  loadRoomTypesIntoSelect();
  document.getElementById("typeroom").value = booking.nameTypeRoom;
  document.getElementById("iduser").value = booking.idUser;
  document.getElementById("modificateIdBooking").value = booking.idBooking;
}

async function getRoomTypes() {
  try {
    const response = await fetch(
      "https://final-proyect-db.onrender.com/getTypeRooms",
      {
        method: "GET",
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

// Function to load room types into the select element
async function loadRoomTypesIntoSelect() {
  // Get the select element
  var selectRoomType = document.getElementById("typeroom");

  // Get room types
  var roomTypes = await getRoomTypes();
  // Iterate over room types and add options to the select
  roomTypes.forEach((typeRoom) => {
    var option = document.createElement("option");
    option.value = typeRoom.id;
    option.textContent = typeRoom.nameTypeRoom;
    selectRoomType.appendChild(option);
  });
}

async function getIdRoom(startDate, endDate, idTypeRoom) {
  try {
    const response = await fetch(
      `https://final-proyect-db.onrender.com/getAvailableRooms/${startDate}/${endDate}/${idTypeRoom}`,
      {
        method: "GET",
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

// Function to load room types into the select element
export async function loadRoomIntoSelect() {
  // Get the select element
  var selectIdRoom = document.getElementById("idroom");

  var rooms = await getIdRoom(
    document.getElementById("startDateReservation").value,
    document.getElementById("finishDateReservation").value,
    document.getElementById("typeroom").value
  );

  // Limpiar opciones existentes en el select
  selectIdRoom.innerHTML = "";

  if (rooms.length === 0) {
    window.alert(
      "Lo sentimos, en este momento no hay habitaciones de este tipo disponibles"
    ); // Muestra un mensaje de alerta
    window.location.href = "../booking-page/index.html"; // Redirige al usuario a la página de inicio
  } else {
    document.getElementById("botonDisponibilidad").style.display = "none";
    document.getElementById("botonReserva").style.display = "flex";
    // Iterate over room types and add options to the select
    rooms.forEach((room) => {
      var option = document.createElement("option");
      option.value = room.idRoom;
      option.textContent = room.numberRoom;
      selectIdRoom.appendChild(option);
    });
  }
}

class modificateBookingClass {
  idRoom; //int
  startDate; //date
  endDate; //date
}

const form = document.getElementById("modificateBookingUser");
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Evitar el envío del formulario por defecto
  document.getElementById("loader").style.display = "flex";
  document.body.style.overflow = "hidden";
  const infoBooking = new modificateBookingClass();
  infoBooking.idRoom = parseInt(document.getElementById("idroom").value);
  infoBooking.startDate = document.getElementById("startDateReservation").value;
  infoBooking.endDate = document.getElementById("finishDateReservation").value;

  try {
    const result = await fetch(
      `https://final-proyect-db.onrender.com/updateBooking/${
        document.getElementById("modificateIdBooking").value
      }`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(infoBooking),
      }
    );
    if (result.ok) {
      console.log("Booking modificate successfully");
      window.location.href = "../mibooking-page/index.html";
    }
  } catch (error) {
    console.log(error);
  }
});

window.loadRoomIntoSelect = loadRoomIntoSelect;
