// Function to fetch room types from the API
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

  // Show loader
  document.getElementById("loader").style.display = "flex";
  document.body.style.overflow = "hidden";

  // Get room types
  var roomTypes = await getRoomTypes();

  // Iterate over room types and add options to the select
  roomTypes.forEach((typeRoom) => {
    var option = document.createElement("option");
    option.value = typeRoom.id;
    option.textContent = typeRoom.nameTypeRoom;
    selectRoomType.appendChild(option);
  });

  // Hide loader
  document.getElementById("loader").style.display = "none";
  document.body.style.overflow = "auto";
}

// Call the function to load room types into the select when the page loads
window.onload = () => {
  validationid();
  loadRoomTypesIntoSelect();
};

function showup() {
  var campo1 = document.getElementById("startDateReservation").value;
  var campo2 = document.getElementById("finishDateReservation").value;
  var campo3 = document.getElementById("typeroom").value;

  if (campo1 !== "" && campo2 !== "" && campo3 !== "") {
    document.getElementById("botonDisponibilidad").style.display = "none";
    document.getElementById("botonReserva").style.display = "flex";

    // Show loader
    document.getElementById("loader").style.display = "flex";
    document.body.style.overflow = "hidden";

    loadRoomIntoSelect();
  }
}

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
  var idlogin = document.getElementById("iduser");
  if (idlogin.value == "") {
    window.alert("Por favor, inicie sesión para continuar."); // Muestra un mensaje de alerta
    window.location.href = "../login-page/index.html"; // Redirige al usuario a la página de inicio de sesión
    return false; // Devuelve false para evitar que el formulario se envíe
  } else {
    return true; // Devuelve true si el campo de identificación no está vacío
  }
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

document
  .getElementById("typeroom")
  .addEventListener("change", loadRoomIntoSelect);

// Function to load room types into the select element
async function loadRoomIntoSelect() {
  // Get the select element
  var selectIdRoom = document.getElementById("idroom");

  var rooms = await getIdRoom(
    document.getElementById("startDateReservation").value,
    document.getElementById("finishDateReservation").value,
    document.getElementById("typeroom").value
  );

  // Limpiar opciones existentes en el select
  selectIdRoom.innerHTML = "";

  // Hide loader if no rooms are available
  document.getElementById("loader").style.display = "none";
  document.body.style.overflow = "auto";

  if (rooms.length === 0) {
    window.alert(
      "Lo sentimos, en este momento no hay habitaciones de este tipo disponibles"
    ); // Muestra un mensaje de alerta
    window.location.href = "../booking-page/index.html"; // Redirige al usuario a la página de inicio
  } else {
    document.getElementById("idRoom").style.display = "flex";
    // Iterate over room types and add options to the select
    rooms.forEach((room) => {
      var option = document.createElement("option");
      option.value = room.idRoom;
      option.textContent = room.numberRoom;
      selectIdRoom.appendChild(option);
    });
  }

  // Hide loader after options are loaded
  document.getElementById("loader").style.display = "none";
  document.body.style.overflow = "auto";
}

class Booking {
  idUser; //int
  idRoom; //int
  startDate; //date
  endDate; //date
}

const form = document.getElementById("bookingUser");
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Evitar el envío del formulario por defecto

  const infoBooking = new Booking();
  infoBooking.idUser = document.getElementById("iduser").value;
  infoBooking.idRoom = document.getElementById("idroom").value;
  infoBooking.startDate = document.getElementById("startDateReservation").value;
  infoBooking.endDate = document.getElementById("finishDateReservation").value;


  // Show loader
  document.getElementById("loader").style.display = "flex";
  document.body.style.overflow = "hidden";

  try {
    const result = await fetch(
      "https://final-proyect-db.onrender.com/createBooking ",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(infoBooking),
      }
    );
    if (result.ok) {
      console.log("Booking created successfully");
      setTimeout(() => {
        window.location.href = "../mibooking-page/index.html";
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    // Hide loader
    document.getElementById("loader").style.display = "none";
    document.body.style.overflow = "auto";
  }
});
