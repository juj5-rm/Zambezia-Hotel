function renderTable(data, targetElement, entityType) {
  const containerDiv = document.createElement("div");
  containerDiv.className = "table-container";
  const table = document.createElement("table");
  const headerRow = table.insertRow();

  if (data.length === 0) {
    const noDataMessage = document.createElement("div");
    noDataMessage.textContent = "No hay registros disponibles";
    noDataMessage.className = "no-data-message";
    noDataMessage.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i><br /><p>No hay registros disponibles</p>`;
    containerDiv.appendChild(noDataMessage);
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
      editButton.title = "Editar";
      editButton.classList.add("edit-Button");
      editButton.onclick = function () {
        showEditForm(item, entityType, getIdForEntityType(entityType, item)); // Se pasa el ID según la entidad
      };

      var iconModificar = document.createElement("i");
      iconModificar.className = "fa-solid fa-pencil";
      editButton.appendChild(iconModificar);
      actionsCell.appendChild(editButton);
      actionsCell.appendChild(document.createElement("br"));

      const deleteButton = document.createElement("button");
      deleteButton.title = "Eliminar";
      deleteButton.classList.add("delete-Button");
      deleteButton.onclick = async () => {
        const entityId = getIdForEntityType(entityType, item); // Se obtiene el ID según la entidad
        try {
          await deleteRecord(entityId, entityType);
        } catch (error) {
          console.error("Error al eliminar el registro:", error);
        }
      };

      var iconCancelar = document.createElement("i");
      iconCancelar.className = "fa-solid fa-trash-can";
      deleteButton.appendChild(iconCancelar);
      actionsCell.appendChild(deleteButton);
      actionsCell.appendChild(document.createElement("br"));
    });

    // Add the add button only for non-bookings tables
    if (entityType !== "bookings") {
      const addButton = document.createElement("button");
      addButton.textContent = "Agregar";
      addButton.classList.add("add-Button");
      addButton.onclick = function () {
        showAddForm(entityType);
      };
      containerDiv.appendChild(addButton);
    }
  }

  containerDiv.appendChild(table);
  targetElement.innerHTML = "";
  targetElement.appendChild(containerDiv);
}

// Function to get the ID for a specific entity type
function getIdForEntityType(entityType, item) {
  switch (entityType) {
    case "bookings":
      return item.idBooking;
    case "rooms":
      return item.idRoom;
    case "typeRooms":
      return item.id;
    case "clients":
      return item.idUser;
    default:
      return null;
  }
}

// Function to show the edit form
async function showEditForm(data, entityType, id) {
  const editFormSection = document.getElementById("editFormSection");
  const formContainer = document.createElement("div");
  formContainer.classList.add("formulario");
  document.getElementById("editFormSection").classList.remove("none");
  editFormSection.classList.add("no-scroll");

  const closeButton = document.createElement("button");
  closeButton.textContent = "X";
  closeButton.classList.add("close-button");
  closeButton.onclick = function () {
    editFormSection.classList.add("none");
    document.body.classList.remove("no-scroll");
  };
  formContainer.appendChild(closeButton);

  const formTitle = document.createElement("h2");
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
    updateRecord(new FormData(formElement), entityType, id);
  };
  formElement.appendChild(submitButton);

  formContainer.appendChild(formElement);
  editFormSection.innerHTML = "";
  editFormSection.appendChild(formContainer);
  window.scrollTo(0, 0);
  document.body.classList.add("no-scroll");
  editFormSection.classList.remove("none");
}

// Function to show the add form
function showAddForm(entityType) {
  const editFormSection = document.getElementById("editFormSection");
  const formContainer = document.createElement("div");
  formContainer.classList.add("formulario");
  document.getElementById("editFormSection").classList.remove("none");
  editFormSection.classList.add("no-scroll");

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
    if (field === "numberRoom" || field === "typeRoom") {
      const fieldContainer = document.createElement("div");
      fieldContainer.classList.add(
        field.includes("password") ? "password" : "username"
      );

      const inputElement = document.createElement("input");
      inputElement.type = field.includes("password") ? "password" : "text";
      inputElement.name = field;
      inputElement.placeholder = translateToSpanish(field);

      fieldContainer.appendChild(inputElement);
      formElement.appendChild(fieldContainer);
    }
  });

  // Add password input field only for clients
  if (entityType === "clients") {
    const nameUserFieldContainer = document.createElement("div");
    nameUserFieldContainer.classList.add("username");

    const nameUserInputElement = document.createElement("input");
    nameUserInputElement.type = "text";
    nameUserInputElement.name = "nameUser";
    nameUserInputElement.placeholder = translateToSpanish("nameUser");

    nameUserFieldContainer.appendChild(nameUserInputElement);
    formElement.appendChild(nameUserFieldContainer);

    const lastNameUserFieldContainer = document.createElement("div");
    lastNameUserFieldContainer.classList.add("username");

    const lastNameUserInputElement = document.createElement("input");
    lastNameUserInputElement.type = "text";
    lastNameUserInputElement.name = "lastNameUser";
    lastNameUserInputElement.placeholder = translateToSpanish("lastNameUser");

    lastNameUserFieldContainer.appendChild(lastNameUserInputElement);
    formElement.appendChild(lastNameUserFieldContainer);

    const documentUserFieldContainer = document.createElement("div");
    documentUserFieldContainer.classList.add("username");

    const documentUserInputElement = document.createElement("input");
    documentUserInputElement.type = "number";
    documentUserInputElement.name = "documentUser";
    documentUserInputElement.placeholder = translateToSpanish("documentUser");

    documentUserFieldContainer.appendChild(documentUserInputElement);
    formElement.appendChild(documentUserFieldContainer);

    const emailUserFieldContainer = document.createElement("div");
    emailUserFieldContainer.classList.add("username");

    const emailUserInputElement = document.createElement("input");
    emailUserInputElement.type = "email";
    emailUserInputElement.name = "emailUser";
    emailUserInputElement.placeholder = translateToSpanish("emailUser");

    emailUserFieldContainer.appendChild(emailUserInputElement);
    formElement.appendChild(emailUserFieldContainer);

    const phoneNumberUserFieldContainer = document.createElement("div");
    phoneNumberUserFieldContainer.classList.add("username");

    const phoneNumberUserInputElement = document.createElement("input");
    phoneNumberUserInputElement.type = "number";
    phoneNumberUserInputElement.name = "phoneNumberUser";
    phoneNumberUserInputElement.placeholder =
      translateToSpanish("phoneNumberUser");

    phoneNumberUserFieldContainer.appendChild(phoneNumberUserInputElement);
    formElement.appendChild(phoneNumberUserFieldContainer);

    const adressUserFieldContainer = document.createElement("div");
    adressUserFieldContainer.classList.add("username");

    const adressUserInputElement = document.createElement("input");
    adressUserInputElement.type = "text";
    adressUserInputElement.name = "adressUser";
    adressUserInputElement.placeholder = translateToSpanish("adressUser");

    adressUserFieldContainer.appendChild(adressUserInputElement);
    formElement.appendChild(adressUserFieldContainer);

    const typeUserFieldContainer = document.createElement("div");
    typeUserFieldContainer.classList.add("username");

    const typeUserInputElement = document.createElement("input");
    typeUserInputElement.type = "text";
    typeUserInputElement.name = "typeUser";
    typeUserInputElement.placeholder = translateToSpanish("typeUser");

    typeUserFieldContainer.appendChild(typeUserInputElement);
    formElement.appendChild(typeUserFieldContainer);
    const passwordFieldContainer = document.createElement("div");
    passwordFieldContainer.classList.add("password");

    const passwordInputElement = document.createElement("input");
    passwordInputElement.type = "password";
    passwordInputElement.name = "passwordUser";
    passwordInputElement.placeholder = translateToSpanish("passwordUser");

    passwordFieldContainer.appendChild(passwordInputElement);
    formElement.appendChild(passwordFieldContainer);
  }

  // Add specific fields for typeRooms
  if (entityType === "typeRooms") {
    const nameTypeRoomFieldContainer = document.createElement("div");
    nameTypeRoomFieldContainer.classList.add("username");

    const nameTypeRoomInputElement = document.createElement("input");
    nameTypeRoomInputElement.type = "text";
    nameTypeRoomInputElement.name = "nameTypeRoom";
    nameTypeRoomInputElement.placeholder = translateToSpanish("nameTypeRoom");

    nameTypeRoomFieldContainer.appendChild(nameTypeRoomInputElement);
    formElement.appendChild(nameTypeRoomFieldContainer);

    const capacityFieldContainer = document.createElement("div");
    capacityFieldContainer.classList.add("username");

    const capacityInputElement = document.createElement("input");
    capacityInputElement.type = "number";
    capacityInputElement.name = "maxCapacity";
    capacityInputElement.placeholder = translateToSpanish("maxCapacity");

    capacityFieldContainer.appendChild(capacityInputElement);
    formElement.appendChild(capacityFieldContainer);

    const priceFieldContainer = document.createElement("div");
    priceFieldContainer.classList.add("username");

    const priceInputElement = document.createElement("input");
    priceInputElement.type = "number";
    priceInputElement.name = "price";
    priceInputElement.placeholder = translateToSpanish("price");

    priceFieldContainer.appendChild(priceInputElement);
    formElement.appendChild(priceFieldContainer);
  }

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
  } finally {
    document.getElementById("loader").style.display = "none";
    document.body.style.overflow = "auto";
  }
}

async function addRecord(formData, entityType) {
  const urlMap = {
    bookings: "https://q4l2x4sw-3000.use2.devtunnels.ms/createBooking",
    rooms: "https://q4l2x4sw-3000.use2.devtunnels.ms/createRoom",
    typeRooms: "https://q4l2x4sw-3000.use2.devtunnels.ms/createTypeRoom",
    clients: "https://q4l2x4sw-3000.use2.devtunnels.ms/createUser",
  };
  const url = urlMap[entityType];
  try {
    document.getElementById("loader").style.display = "flex";
    document.body.style.overflow = "hidden";

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      console.log("Registro agregado exitosamente");
      document.getElementById("loader").style.display = "none";
      document.body.style.overflow = "auto";
      location.reload();
    }
  } catch (error) {
    document.getElementById("loader").style.display = "none";
    document.body.style.overflow = "auto";
    console.error("Error al agregar el registro:", error);
  }
}

// Function to update a record
async function updateRecord(formData, entityType, id) {
  const urlMap = {
    bookings: `https://q4l2x4sw-3000.use2.devtunnels.ms/updateBooking/${id}`,
    rooms: `https://q4l2x4sw-3000.use2.devtunnels.ms/updateRoom/${id}`,
    typeRooms: `https://q4l2x4sw-3000.use2.devtunnels.ms/updateTypeRoom/${id}`,
    clients: `https://q4l2x4sw-3000.use2.devtunnels.ms/updateUser/${id}`,
  };
  const url = urlMap[entityType];
  try {
    document.getElementById("loader").style.display = "flex";
    document.body.style.overflow = "hidden";

    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      console.log("Registro actualizado exitosamente");
      document.getElementById("loader").style.display = "none";
      document.body.style.overflow = "auto";
      location.reload();
    }
  } catch (error) {
    document.getElementById("loader").style.display = "none";
    document.body.style.overflow = "auto";
    console.error("Error al actualizar el registro:", error);
  }
}

// Function to delete a record
async function deleteRecord(userId, entityType) {
  const urlMap = {
    bookings: `https://q4l2x4sw-3000.use2.devtunnels.ms/deleteBooking/${userId}`,
    rooms: `https://q4l2x4sw-3000.use2.devtunnels.ms/deleteRoom/${userId}`,
    typeRooms: `https://q4l2x4sw-3000.use2.devtunnels.ms/deleteTypeRoom/${userId}`,
    clients: `https://q4l2x4sw-3000.use2.devtunnels.ms/deleteUser/${userId}`,
  };
  const url = urlMap[entityType];
  try {
    document.getElementById("loader").style.display = "flex";
    document.body.style.overflow = "hidden";

    const response = await fetch(url, {
      method: "DELETE",
    });
    if (response.ok) {
      console.log("Registro eliminado exitosamente");
      document.getElementById("loader").style.display = "none";
      document.body.style.overflow = "auto";
      location.reload();
    }
  } catch (error) {
    document.getElementById("loader").style.display = "none";
    document.body.style.overflow = "auto";
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

document.addEventListener("DOMContentLoaded", function () {
  const encabezados = document.querySelectorAll(".gridservicios .tabla");
  const descripciones = document.querySelectorAll("main .dataSection");

  // Función para reiniciar colores y ocultar todas las descripciones
  function resetAll() {
    encabezados.forEach((encabezado) => encabezado.classList.remove("active"));
    descripciones.forEach(
      (descripcion) => (descripcion.style.display = "none")
    );
  }

  // Añadir el evento de clic a cada servicio
  encabezados.forEach((encabezado, index) => {
    encabezado.addEventListener("click", function () {
      resetAll(); // Reiniciar todos los estilos y descripciones
      this.classList.add("active"); // Añadir clase 'active' al servicio clickeado
      descripciones[index].style.display = "flex"; // Mostrar la descripción correspondiente
    });
  });
});
