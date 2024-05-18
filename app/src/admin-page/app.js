function renderTable(data, targetElement) {
  const containerDiv = document.createElement("div");

  const addButton = document.createElement("button");
  addButton.textContent = "Agregar";
  addButton.classList.add("add-Button");
  addButton.onclick = function () {
      console.log("Agregar nueva entrada");
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
              showEditForm(item);
          };
          actionsCell.appendChild(editButton);
          actionsCell.appendChild(document.createElement("br"));

          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Eliminar";
          deleteButton.classList.add("delete-Button");
          actionsCell.appendChild(deleteButton);
          actionsCell.appendChild(document.createElement("br"));
      });
  }

  containerDiv.appendChild(table);
  targetElement.innerHTML = "";
  targetElement.appendChild(containerDiv);
}

function showEditForm(data) {
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
    fieldContainer.classList.add(key.includes("password") ? "password" : "username");

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
  formElement.appendChild(submitButton);

  formContainer.appendChild(formElement);
  editFormSection.innerHTML = "";
  editFormSection.appendChild(formContainer);
  window.scrollTo(0, 0);
  document.body.classList.add("no-scroll");
  editFormSection.classList.remove("none");
}

// Función para traducir los nombres de los campos al español
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

async function fetchData(url, targetId) {
try {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("La respuesta de la red no fue exitosa");
  }
  const data = await response.json();
  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    renderTable(data, targetElement);
  }
} catch (error) {
  console.error("Error al obtener los datos:", error);
}
}

// Obtener reservas activas y mostrarlas
fetchData(
"https://q4l2x4sw-3000.use2.devtunnels.ms/getBookings",
"reservationsList"
);

// Obtener todas las habitaciones y mostrarlas
fetchData("https://q4l2x4sw-3000.use2.devtunnels.ms/getRooms", "roomsList");

// Obtener todos los tipos de habitación y mostrarlos
fetchData(
"https://q4l2x4sw-3000.use2.devtunnels.ms/getTypeRooms",
"roomTypesList"
);

// Obtener todos los clientes y mostrarlos
fetchData("https://q4l2x4sw-3000.use2.devtunnels.ms/getClients", "clientsList");
