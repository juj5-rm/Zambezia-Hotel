import { getUserData } from "../login-page/userData.js";
const userData = getUserData();

async function getBooking(idUser) {
  try {
    const response = await fetch(
      `https://q4l2x4sw-3000.use2.devtunnels.ms/getBookings/${idUser}`,
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
  console.log(bookings);

  // Seleccionar el contenedor donde se añadirán las reservas
  var containerBookings = document.querySelector(".containerBookings");

  if (bookings.length === 0) {
    // Crear el contenedor de "Sin resultados"
    var noResultsDiv = document.createElement("div");
    noResultsDiv.className = "booking";

    var h3NoResults = document.createElement("h3");
    h3NoResults.textContent = "Sin resultados";
    noResultsDiv.appendChild(h3NoResults);

    var pNoResults = document.createElement("p");
    pNoResults.textContent = "En este momento no has realizado ninguna reserva";
    noResultsDiv.appendChild(pNoResults);

    // Añadir el contenedor de "Sin resultados" al contenedor de reservas
    containerBookings.appendChild(noResultsDiv);
  } else {
    // Iterar sobre room types y añadir opciones al select
    bookings.forEach((booking) => {
      // Crear el contenedor principal de la reserva
      var bookingDiv = document.createElement("div");
      bookingDiv.className = "booking";

      // Crear el contenedor de información de la reserva
      var bookingInfoDiv = document.createElement("div");
      bookingInfoDiv.className = "bookingInfo";

      // Añadir el contenido de la información de la reserva
      var h3 = document.createElement("h3");
      h3.textContent = "Reserva #" + booking.idBooking;
      bookingInfoDiv.appendChild(h3);

      var h5FechaLlegada = document.createElement("h5");
      h5FechaLlegada.textContent = "Fecha de llegada:";
      bookingInfoDiv.appendChild(h5FechaLlegada);

      var pFechaLlegada = document.createElement("p");
      pFechaLlegada.textContent = formatDate(booking.startDate);
      bookingInfoDiv.appendChild(pFechaLlegada);

      var h5FechaSalida = document.createElement("h5");
      h5FechaSalida.textContent = "Fecha de salida:";
      bookingInfoDiv.appendChild(h5FechaSalida);

      var pFechaSalida = document.createElement("p");
      pFechaSalida.textContent = formatDate(booking.endDate);
      bookingInfoDiv.appendChild(pFechaSalida);

      var h5Habitacion = document.createElement("h5");
      h5Habitacion.textContent = "Habitación:";
      bookingInfoDiv.appendChild(h5Habitacion);

      var pHabitacion = document.createElement("p");
      pHabitacion.textContent = booking.nameTypeRoom;
      bookingInfoDiv.appendChild(pHabitacion);

      var h5NumeroHabitacion = document.createElement("h5");
      h5NumeroHabitacion.textContent = "Número de habitación:";
      bookingInfoDiv.appendChild(h5NumeroHabitacion);

      var pNumeroHabitacion = document.createElement("p");
      pNumeroHabitacion.textContent = booking.numberRoom;
      bookingInfoDiv.appendChild(pNumeroHabitacion);

      // Añadir el contenedor de información al contenedor principal
      bookingDiv.appendChild(bookingInfoDiv);

      // Crear el contenedor de botones
      var bookingButtonsDiv = document.createElement("div");
      bookingButtonsDiv.className = "bookingButtons";

      // Crear y añadir los botones de modificar y cancelar
      var buttonModificar = document.createElement("button");
      buttonModificar.className = "buttonBooking";
      buttonModificar.textContent = "Modificar";
      buttonModificar.onclick = () => {
        modificateBooking(booking);
      };
      bookingButtonsDiv.appendChild(buttonModificar);

      var buttonCancelar = document.createElement("button");
      buttonCancelar.className = "buttonBooking";
      buttonCancelar.textContent = "Cancelar";
      buttonCancelar.onclick = () => {
        deleteBooking(booking.idBooking);
      };
      bookingButtonsDiv.appendChild(buttonCancelar);

      // Añadir el contenedor de botones al contenedor principal
      bookingDiv.appendChild(bookingButtonsDiv);

      // Añadir el nuevo div de reserva al contenedor de reservas
      containerBookings.appendChild(bookingDiv);
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
  var idlogin = userData.idUser;
  if (idlogin.value == "") {
    window.alert("Por favor, inicie sesión para continuar."); // Muestra un mensaje de alerta
    window.location.href = "../login-page/index.html"; // Redirige al usuario a la página de inicio de sesión
    return false; // Devuelve false para evitar que el formulario se envíe
  } else {
    return true; // Devuelve true si el campo de identificación no está vacío
  }
}

async function deleteBooking(idBooking) {
  try {
    const response = await fetch(
      `https://q4l2x4sw-3000.use2.devtunnels.ms/deleteBooking/${idBooking}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Error al eliminar la reserva");
    }

    const data = await response.json();
    window.alert("Reserva eliminada exitosamente.");
    window.location.reload(); // Recargar la página
  } catch (error) {
    console.log(error);
    window.alert("Hubo un error al eliminar la reserva: " + error.message);
  }
}

function modificateBooking(booking) {
  document.getElementById("modificacionReserva").style.display = "flex";
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
      "https://q4l2x4sw-3000.use2.devtunnels.ms/getTypeRooms",
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
      `https://q4l2x4sw-3000.use2.devtunnels.ms/getAvailableRooms/${startDate}/${endDate}/${idTypeRoom}`,
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

  const infoBooking = new modificateBookingClass();
  console.log(infoBooking);
  infoBooking.idRoom = parseInt(document.getElementById("idroom").value);
  infoBooking.startDate = document.getElementById("startDateReservation").value;
  infoBooking.endDate = document.getElementById("finishDateReservation").value;

  console.log(infoBooking);
  try {
    const result = await fetch(
      `https://q4l2x4sw-3000.use2.devtunnels.ms/updateBooking/${
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
      alert("Reserva modificadas exitosamente.");
      setTimeout(() => {
        window.location.href = "../mibooking-page/index.html";
      });
    }
  } catch (error) {
    console.log(error);
  }
});

window.loadRoomIntoSelect = loadRoomIntoSelect;
