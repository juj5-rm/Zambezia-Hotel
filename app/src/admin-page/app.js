// Function to render a table with data and actions
function renderTable(data, targetElement, entityType) {
  const containerDiv = document.createElement("div");

  const addButton = document.createElement("button");
  addButton.textContent = "Agregar";
  addButton.classList.add("add-Button");
  addButton.onclick = function () {
    showAddForm(entityType);
  };
  containerDiv.appendChild(addButton);

  const table = document.createElement("table");
  const headerRow = table.insertRow();
  if (data.length === 0) {
    const noDataMessageCell = document.createElement("td");
    noDataMessageCell.textContent = "No hay registros disponibles";
    noDataMessageCell.colSpan = 2;
    headerRow.appendChild(noDataMessageCell);
  } else {
    for (const key in data[0]) {
      const th = document.createElement("th");
      const spanishKey = translateToSpanish(key);
      th.textContent = spanishKey;
      headerRow.appendChild(th);
    }
    const actionsHeader = document.createElement("th");
    actionsHeader.textContent = "Acciones";
    headerRow.appendChild(actionsHeader);

    data.forEach((item) => {
      const row = table.insertRow();
      for (const key in item) {
        const cell = row.insertCell();
        cell.textContent = item[key];
      }
      const actionsCell = row.insertCell();

      const editButton = document.createElement("button");
      editButton.textContent = "Editar";
      editButton.classList.add("edit-Button");
      editButton.onclick = function () {
        showEditForm(item, entityType);
      };
      actionsCell.appendChild(editButton);
      actionsCell.appendChild(document.createElement("br"));

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Eliminar";
      deleteButton.classList.add("delete-Button");
      deleteButton.onclick = function () {
        deleteRecord(item.id, entityType);
      };
      actionsCell.appendChild(deleteButton);
      actionsCell.appendChild(document.createElement("br"));
    });
  }

  containerDiv.appendChild(table);
  targetElement.innerHTML = "";
  targetElement.appendChild(containerDiv);
}

// Function to show the add form
function showAddForm(entityType) {
  const editFormSection = document.getElementById("editFormSection");
  const formContainer = document.createElement("div");
  formContainer.classList.add("formulario");

  const closeButton = document.createElement("button");
  closeButton.textContent = "X";
  closeButton.classList.add("close-button");
  closeButton.onclick = function () {
    editFormSection.classList.add("none");
    document.body.classList.remove("no-scroll");
  };
  formContainer.appendChild(closeButton);

  const formTitle = document.createElement("h1");
  formTitle.textContent = "Agregar Registro";
  formContainer.appendChild(formTitle);

  const formElement = document.createElement("form");

  const fields = getFieldsForEntity(entityType);
  fields.forEach((field) => {
    const fieldContainer = document.createElement("div");
    fieldContainer.classList.add(
      field.includes("password") ? "password" : "username"
    );

    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.name = field;
    inputElement.placeholder = translateToSpanish(field);

    fieldContainer.appendChild(inputElement);
    formElement.appendChild(fieldContainer);
  });

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Guardar";
  submitButton.classList.add("save-button");
  submitButton.onclick = function (event) {
    event.preventDefault();
    addRecord(new FormData(formElement), entityType);
  };
  formElement.appendChild(submitButton);

  formContainer.appendChild(formElement);
  editFormSection.innerHTML = "";
  editFormSection.appendChild(formContainer);
  window.scrollTo(0, 0);
  document.body.classList.add("no-scroll");
  editFormSection.classList.remove("none");
}

// Function to show the edit form
function showEditForm(data, entityType) {
  const editFormSection = document.getElementById("editFormSection");
  const formContainer = document.createElement("div");
  formContainer.classList.add("formulario");

  const closeButton = document.createElement("button");
  closeButton.textContent = "X";
  closeButton.classList.add("close-button");
  closeButton.onclick = function () {
    editFormSection.classList.add("none");
    document.body.classList.remove("no-scroll");
  };
  formContainer.appendChild(closeButton);

  const formTitle = document.createElement("h1");
  formTitle.textContent = "Editar Registro";
  formContainer.appendChild(formTitle);

  const formElement = document.createElement("form");

  for (const key in data) {
    const fieldContainer = document.createElement("div");
    fieldContainer.classList.add(
      key.includes("password") ? "password" : "username"
    );

    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.name = key;
    inputElement.value = data[key];
    inputElement.placeholder = translateToSpanish(key);

    fieldContainer.appendChild(inputElement);
    formElement.appendChild(fieldContainer);
  }

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Guardar Cambios";
  submitButton.classList.add("save-button");
  submitButton.onclick = function (event) {
    event.preventDefault();
    updateRecord(new FormData(formElement), entityType, data.id);
  };
  formElement.appendChild(submitButton);

  formContainer.appendChild(formElement);
  editFormSection.innerHTML = "";
  editFormSection.appendChild(formContainer);
  window.scrollTo(0, 0);
  document.body.classList.add("no-scroll");
  editFormSection.classList.remove("none");
}

// Function to translate field names to Spanish
function translateToSpanish(key) {
  const translations = {
    idBooking: "ID de Reserva",
    idUser: "ID de Usuario",
    idRoom: "ID de Habitación",
    startDate: "Fecha de Inicio",
    endDate: "Fecha de Fin",
    createdAt: "Creado en",
    updatedAt: "Actualizado en",
    passwordUser: "Contraseña de Usuario",
    nameUser: "Nombre de Usuario",
    lastNameUser: "Apellido de Usuario",
    documentUser: "Documento de Usuario",
    emailUser: "Correo Electrónico de Usuario",
    phoneNumberUser: "Número de Teléfono de Usuario",
    adressUser: "Dirección de Usuario",
    typeUser: "Tipo de Usuario",
    price: "Precio",
    maxCapacity: "Capacidad Máxima",
    nameTypeRoom: "Nombre de Tipo de Habitación",
    numberRoom: "Número de Habitación",
    typeRoom: "Tipo de Habitación",
    startUndisponibility: "Inicio de Indisponibilidad",
    endUndisponibility: "Fin de Indisponibilidad",
    restictions: "Restricciones",
  };
  return translations[key] || key;
}

// Function to get fields for a specific entity type
function getFieldsForEntity(entityType) {
  const fields = {
    bookings: ["idUser", "idRoom", "startDate", "endDate"],
    rooms: ["numberRoom", "typeRoom", "price", "maxCapacity"],
    typeRooms: ["nameTypeRoom"],
    clients: [
      "nameUser",
      "lastNameUser",
      "documentUser",
      "emailUser",
      "phoneNumberUser",
      "adressUser",
      "typeUser",
    ],
  };
  return fields[entityType] || [];
}

// Function to fetch data from the API and render the table
async function fetchData(url, targetId, entityType) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("La respuesta de la red no fue exitosa");
    }
    const data = await response.json();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      renderTable(data, targetElement, entityType);
    }
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
}

// Function to add a new record
async function addRecord(formData, entityType) {
  const urlMap = {
    bookings: "https://q4l2x4sw-3000.use2.devtunnels.ms/bookings",
    rooms: "https://q4l2x4sw-3000.use2.devtunnels.ms/rooms",
    typeRooms: "https://q4l2x4sw-3000.use2.devtunnels.ms/typeRooms",
    clients: "https://q4l2x4sw-3000.use2.devtunnels.ms/clients",
  };
  const url = urlMap[entityType];
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      console.log("Registro agregado exitosamente");
      alert("Registro agregado exitosamente.");
      location.reload();
    }
  } catch (error) {
    console.error("Error al agregar el registro:", error);
  }
}

// Function to update a record
async function updateRecord(formData, entityType, id) {
  const urlMap = {
    bookings: `https://q4l2x4sw-3000.use2.devtunnels.ms/bookings/${id}`,
    rooms: `https://q4l2x4sw-3000.use2.devtunnels.ms/rooms/${id}`,
    typeRooms: `https://q4l2x4sw-3000.use2.devtunnels.ms/typeRooms/${id}`,
    clients: `https://q4l2x4sw-3000.use2.devtunnels.ms/clients/${id}`,
  };
  const url = urlMap[entityType];
  try {
    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      console.log("Registro actualizado exitosamente");
      alert("Registro actualizado exitosamente.");
      location.reload();
    }
  } catch (error) {
    console.error("Error al actualizar el registro:", error);
  }
}

// Function to delete a record
async function deleteRecord(id, entityType) {
  const urlMap = {
    bookings: `https://q4l2x4sw-3000.use2.devtunnels.ms/bookings/${id}`,
    rooms: `https://q4l2x4sw-3000.use2.devtunnels.ms/rooms/${id}`,
    typeRooms: `https://q4l2x4sw-3000.use2.devtunnels.ms/typeRooms/${id}`,
    clients: `https://q4l2x4sw-3000.use2.devtunnels.ms/clients/${id}`,
  };
  const url = urlMap[entityType];
  try {
    const response = await fetch(url, {
      method: "DELETE",
    });
    if (response.ok) {
      console.log("Registro eliminado exitosamente");
      alert("Registro eliminado exitosamente.");
      location.reload();
    }
  } catch (error) {
    console.error("Error al eliminar el registro:", error);
  }
}

// Fetch and render data for each section
fetchData(
  "https://q4l2x4sw-3000.use2.devtunnels.ms/getBookings",
  "reservationsList",
  "bookings"
);
fetchData(
  "https://q4l2x4sw-3000.use2.devtunnels.ms/getRooms",
  "roomsList",
  "rooms"
);
fetchData(
  "https://q4l2x4sw-3000.use2.devtunnels.ms/getTypeRooms",
  "roomTypesList",
  "typeRooms"
);
fetchData(
  "https://q4l2x4sw-3000.use2.devtunnels.ms/getClients",
  "clientsList",
  "clients"
);

// Espera a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {
  const servicios = document.querySelectorAll(".gridservicios .tabla");
  const descripciones = document.querySelectorAll("main .dataSection");

  // Función para reiniciar colores y ocultar todas las descripciones
  function resetAll() {
    servicios.forEach(
      (servicio) => (servicio.style.backgroundColor = "#ffffff")
    );
    descripciones.forEach(
      (descripcion) => (descripcion.style.display = "none")
    );
  }

  // Añadir el evento de clic a cada servicio
  servicios.forEach((servicio, index) => {
    servicio.addEventListener("click", function () {
      resetAll(); // Reiniciar todos los estilos y descripciones
      this.style.backgroundColor = "#c7b691"; // Cambiar color del servicio clickeado
      descripciones[index].style.display = "flex"; // Mostrar la descripción correspondiente
    });
  });
});
