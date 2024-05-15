// Function to fetch room types from the API
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

// Call the function to load room types into the select when the page loads
window.onload = () => {
  loadRoomTypesIntoSelect();
};

function showup() {
  var campo1 = document.getElementById("startDateReservation").value;
  var campo2 = document.getElementById("finishDateReservation").value;
  var campo3 = document.getElementById("typeroom").value;

  if (campo1 !== "" && campo2 !== "" && campo3 !== "") {
    document.getElementById("idRoom").style.display = "flex";
    document.getElementById("botonDisponibilidad").style.display = "none";
    document.getElementById("botonReserva").style.display = "flex";
    loadRoomIntoSelect();
  }
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
async function loadRoomIntoSelect() {
  // Get the select element
  var selectIdRoom = document.getElementById("idroom");

  var rooms = await getIdRoom(
    document.getElementById("startDateReservation").value,
    document.getElementById("finishDateReservation").value,
    document.getElementById("typeroom").value
  );

  // Iterate over room types and add options to the select
  rooms.forEach((room) => {
    var option = document.createElement("option");
    option.value = room.idRoom;
    option.textContent = room.numberRoom;
    selectIdRoom.appendChild(option);
  });
}
