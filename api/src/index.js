import express from "express";
import cors from "cors";
import { pool } from "../dataBase/connectionPostgreSql.js";
import { Resend } from "resend";

const app = express();
const PORT = 3000;
const resend = new Resend("re_dSHD1cVX_JoPkFrdDMpsXa3ZVQWqMzH6Y");

app.use(express.json());
app.use(cors());

function logRecent(method, url, success = true, errorMessage = "") {
  const status = success ? "success" : "error";
  if (status === "error") {
    console.log(
      `[${new Date().toLocaleString()}] ${method} ${url} - ${status} - ${errorMessage}`
    );
    return;
  }
  console.log(`[${new Date().toLocaleString()}] ${method} ${url} - ${status}`);
}

// Obtiene los usuarios
app.get("/getUsers", async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM public.users ORDER BY "idUser" ASC'
    );

    const users = result.rows;
    logRecent(req.method, req.url);
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    logRecent(req.method, req.url, false, "Internal Server Error");
  }
});

// Obtiene los tipos de habitaciones
app.get("/getTypeRooms", async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM public."typeRoom" ORDER BY "id" ASC'
    );

    const typeRooms = result.rows;
    logRecent(req.method, req.url);
    res.json(typeRooms);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    logRecent(req.method, req.url, false, "Internal Server Error");
  }
});

// Obtiene las habitaciones
app.get("/getRooms", async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM public."room" ORDER BY "idRoom" ASC'
    );

    const rooms = result.rows;
    logRecent(req.method, req.url);
    res.json(rooms);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    logRecent(req.method, req.url, false, "Internal Server Error");
  }
});

//Obtiene las reservaciones
app.get("/getBookings", async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM public."booking" ORDER BY "idBooking" ASC'
    );

    const bookings = result.rows;
    logRecent(req.method, req.url);
    res.json(bookings);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    logRecent(req.method, req.url, false, "Internal Server Error");
  }
});

// Obtener un usuario
app.get("/getUser/:idUser", async (req, res) => {
  const idUserParam = req.params.idUser;

  try {
    const result = await pool.query(
      'SELECT * FROM public.users WHERE "idUser" = $1',
      [idUserParam]
    );

    const user = result.rows[0];
    logRecent(req.method, req.url);
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    logRecent(req.method, req.url, false, "Internal Server Error");
  }
});

//Obterner los usuarios que son tipo cliente
app.get("/getClients", async (req, res) => {
  const typeUserParam = "client";
  try {
    const result = await pool.query(
      'SELECT * FROM public.users WHERE "typeUser" = $1',
      [typeUserParam]
    );
    const clients = result.rows;
    logRecent(req.method, req.url);
    res.json(clients);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    logRecent(req.method, req.url, false, "Internal Server Error");
  }
});

// Crear un usuario
app.post("/createUser", async (req, res) => {
  const {
    passwordUser,
    nameUser,
    lastNameUser,
    documentUser,
    emailUser,
    phoneNumberUser,
    adressUser,
    typeUser,
  } = req.body; // Obtener los datos del objeto User enviado en la solicitud

  try {
    // Verificar si ya existe un usuario con el mismo email o documento
    const existingUser = await pool.query(
      'SELECT * FROM public.users WHERE "emailUser" = $1 OR "documentUser" = $2',
      [emailUser, documentUser]
    );

    if (existingUser.rows.length > 0) {
      logRecent(req.method, req.url, false, "User already exists");
      return res.status(400).json({ error: "User already exists" });
    }

    // Insertar el nuevo usuario en la base de datos y obtener el ID generado
    const result = await pool.query(
      'INSERT INTO public.users ("passwordUser","nameUser", "lastNameUser","documentUser", "emailUser", "phoneNumberUser", "adressUser", "typeUser") VALUES ($1, $2, $3, $4, $5, $6, $7 ,$8) RETURNING "idUser"',
      [
        passwordUser,
        nameUser,
        lastNameUser,
        documentUser,
        emailUser,
        phoneNumberUser,
        adressUser,
        typeUser,
      ]
    );

    const idUser = result.rows[0].idUser; // Obtener el ID generado
    logRecent(req.method, req.url);
    res.json({ message: "User created successfully", data: { idUser } }); // Devolver el ID del usuario creado en la respuesta
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    logRecent(req.method, req.url, false, "Internal Server Error");
  }
});

// Actualizar un usuario
app.put("/updateUser/:idUser", async (req, res) => {
  const idUserParam = req.params.idUser;
  const {
    passwordUser,
    nameUser,
    lastNameUser,
    documentUser,
    emailUser,
    phoneNumberUser,
    adressUser,
    typeUser,
  } = req.body; // Obtener los datos del objeto User enviado en la solicitud

  try {
    // Verificar si el usuario con el ID proporcionado existe
    const userExistence = await pool.query(
      'SELECT * FROM public.users WHERE "idUser" = $1',
      [idUserParam]
    );

    // Si no se encontró ningún usuario con ese ID, devuelve un mensaje de error
    if (userExistence.rows.length === 0) {
      logRecent(req.method, req.url, false, "User not found");
      return res.status(404).json({ error: "User not found" });
    }

    // Si el usuario existe, procede a actualizar sus datos y actualizar la columna 'updatedAt'
    await pool.query(
      'UPDATE public.users SET "passwordUser" = $1, "nameUser" = $2, "lastNameUser" = $3, "documentUser" = $4, "emailUser" = $5, "phoneNumberUser" = $6, "adressUser" = $7, "typeUser" = $8, "updatedAt" = NOW() WHERE "idUser" = $9',
      [
        passwordUser,
        nameUser,
        lastNameUser,
        documentUser,
        emailUser,
        phoneNumberUser,
        adressUser,
        typeUser,
        idUserParam,
      ]
    );

    logRecent(req.method, req.url);
    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    logRecent(req.method, req.url, false, "Internal Server Error");
  }
});

// Eliminar un usuario
app.delete("/deleteUser/:idUser", async (req, res) => {
  const idUserParam = req.params.idUser;

  try {
    // Eliminar las reservas asociadas al usuario
    await pool.query('DELETE FROM public."booking" WHERE "idUser" = $1', [
      idUserParam,
    ]);

    // Eliminar el usuario de la base de datos
    await pool.query('DELETE FROM public."users" WHERE "idUser" = $1', [
      idUserParam,
    ]);

    logRecent(req.method, req.url);
    res.json({ message: "User and their bookings deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    logRecent(req.method, req.url, false, "Internal Server Error");
  }
});

//Cambiar contraseña de un usuario
app.put("/changePassword/:emailUser", async (req, res) => {
  const emailUserParam = req.params.emailUser;
  const { passwordUser } = req.body; // Obtener la nueva contraseña enviada en la solicitud

  try {
    // Verificar si el usuario existe
    const userExistence = await pool.query(
      'SELECT * FROM public.users WHERE "emailUser" = $1',
      [emailUserParam]
    );

    if (userExistence.rows.length === 0) {
      // Si no se encontró ningún usuario con ese correo electrónico, devuelve un mensaje de error
      logRecent(req.method, req.url, false, "User not found");
      return res.status(404).json({ error: "User not found" });
    }

    // Si el usuario existe, procede a actualizar su contraseña y actualizar la columna 'updatedAt'
    await pool.query(
      'UPDATE public.users SET "passwordUser" = $1, "updatedAt" = NOW() WHERE "emailUser" = $2',
      [passwordUser, emailUserParam]
    );

    logRecent(req.method, req.url);
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    logRecent(req.method, req.url, false, "Internal Server Error");
  }
});

// Verificar existencia de usuario
app.post("/verifyUser", async (req, res) => {
  const { emailUser, passwordUser } = req.body;

  try {
    // Validar que se proporcionen email y contraseña
    if (!emailUser || !passwordUser) {
      logRecent(req.method, req.url, false, "Email and password are required");
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Buscar usuario por email en la base de datos
    const result = await pool.query(
      'SELECT "idUser","nameUser","lastNameUser","typeUser" FROM public.users WHERE "emailUser" = $1 AND "passwordUser" = $2',
      [emailUser, passwordUser]
    );

    const user = result.rows[0];

    // Verificar si se encontró un usuario
    if (user) {
      // Devolver solo el ID del usuario
      logRecent(req.method, req.url);
      res.json({
        idUser: user.idUser,
        nameUser: user.nameUser,
        lastNameUser: user.lastNameUser,
        typeUser: user.typeUser,
      });
    } else {
      // Usuario no encontrado o contraseña incorrecta
      logRecent(req.method, req.url, false, "Incorrect email or password");
      res.status(401).json({ error: "Incorrect email or password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    logRecent(req.method, req.url, false, "Internal Server Error");
  }
});

// Obtener un tipo de habitación
app.get("/getTypeRoom/:id", async (req, res) => {
  const idTypeRoomParam = req.params.id;

  try {
    const result = await pool.query(
      'SELECT * FROM public."typeRoom" WHERE "id" = $1',
      [idTypeRoomParam]
    );

    const typeRoom = result.rows[0];
    logRecent(req.method, req.url);
    res.json(typeRoom);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    logRecent(req.method, req.url, false, "Internal Server Error");
  }
});

// Crear un tipo de habitación
app.post("/createTypeRoom", async (req, res) => {
  const { nameTypeRoom, maxCapacity, price } = req.body; // Obtener los datos del objeto TypeRoom enviado en la solicitud

  try {
    // Verificar si ya existe un tipo de habitación con el mismo nombre
    const existingTypeRoom = await pool.query(
      'SELECT * FROM public."typeRoom" WHERE "nameTypeRoom" = $1',
      [nameTypeRoom]
    );

    if (existingTypeRoom.rows.length > 0) {
      logRecent(req.method, req.url, false, "TypeRoom already exists");
      return res.status(400).json({ error: "TypeRoom already exists" });
    }

    // Insertar el nuevo tipo de habitación en la base de datos y obtener el ID generado
    const result = await pool.query(
      'INSERT INTO public."typeRoom" ("nameTypeRoom", "maxCapacity", "price") VALUES ($1, $2, $3) RETURNING "id"',
      [nameTypeRoom, maxCapacity, price]
    );

    const idTypeRoom = result.rows[0].id; // Obtener el ID generado
    logRecent(req.method, req.url);
    res.json({
      message: "TypeRoom created successfully",
      data: { id: idTypeRoom }, // Corregido de 'id' a 'idTypeRoom'
    }); // Devolver el ID del tipo de habitación creado en la respuesta
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    logRecent(req.method, req.url, false, "Internal Server Error");
  }
});

// Actualizar un tipo de habitación
app.put("/updateTypeRoom/:id", async (req, res) => {
  const idTypeRoomParam = req.params.id;
  const { nameTypeRoom, maxCapacity, price } = req.body; // Obtener los datos del objeto TypeRoom enviado en la solicitud

  try {
    // Verificar si el tipo de habitación con el ID proporcionado existe
    const typeRoomExistence = await pool.query(
      'SELECT * FROM public."typeRoom" WHERE "id" = $1',
      [idTypeRoomParam]
    );

    // Si no se encontró ningún tipo de habitación con ese ID, devuelve un mensaje de error
    if (typeRoomExistence.rows.length === 0) {
      logRecent(req.method, req.url, false, "TypeRoom not found");
      return res.status(404).json({ error: "TypeRoom not found" });
    }

    // Si el tipo de habitación existe, procede a actualizar sus datos y actualizar la columna 'updatedAt'
    await pool.query(
      'UPDATE public."typeRoom" SET "nameTypeRoom" = $1, "maxCapacity" = $2, "price" = $3, "updatedAt" = NOW() WHERE "id" = $4',
      [nameTypeRoom, maxCapacity, price, idTypeRoomParam]
    );

    logRecent(req.method, req.url);
    res.json({ message: "TypeRoom updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    logRecent(req.method, req.url, false, "Internal Server Error");
  }
});

// Eliminar un tipo de habitación
app.delete("/deleteTypeRoom/:id", async (req, res) => {
  const idTypeRoomParam = req.params.id;

  try {
    // Verificar si hay habitaciones asociadas a este tipo de habitación
    const roomsWithType = await pool.query(
      'SELECT * FROM public."room" WHERE "typeRoom" = $1',
      [idTypeRoomParam]
    );

    // Si existen habitaciones con este tipo de habitación, actualizarlas al tipo de habitación predeterminado
    if (roomsWithType.rows.length > 0) {
      await pool.query(
        'UPDATE public."room" SET "typeRoom" = 1 WHERE "typeRoom" = $1',
        [idTypeRoomParam]
      );
    }

    // Eliminar el tipo de habitación de la base de datos
    await pool.query('DELETE FROM public."typeRoom" WHERE "id" = $1', [
      idTypeRoomParam,
    ]);

    logRecent(req.method, req.url);
    res.json({ message: "TypeRoom deleted successfully and rooms updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    logRecent(req.method, req.url, false, "Internal Server Error");
  }
});

// crear una habitación
app.post("/createRoom", async (req, res) => {
  const { numberRoom, typeRoom } = req.body; // Obtener los datos del objeto Room enviado en la solicitud

  try {
    // Insertar la nueva habitación en la base de datos y obtener el ID generado
    const result = await pool.query(
      'INSERT INTO public."room" ("numberRoom", "typeRoom") VALUES ($1, $2) RETURNING "idRoom"',
      [numberRoom, typeRoom]
    );

    const idRoom = result.rows[0].idRoom; // Obtener el ID generado
    logRecent(req.method, req.url);
    res.json({ message: "Room created successfully", data: { idRoom } }); // Devolver el ID de la habitación creada en la respuesta
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    logRecent(req.method, req.url, false, "Internal Server Error");
  }
});

// Actualizar una habitación
app.put("/updateRoom/:idRoom", async (req, res) => {
  const idRoomParam = req.params.idRoom;
  const { numberRoom, typeRoom, restrictions } = req.body; // Obtener los datos del objeto Room enviado en la solicitud

  try {
    // Verificar si la habitación con el ID proporcionado existe
    const roomExistence = await pool.query(
      'SELECT * FROM public."room" WHERE "idRoom" = $1',
      [idRoomParam]
    );

    // Si no se encontró ninguna habitación con ese ID, devuelve un mensaje de error
    if (roomExistence.rows.length === 0) {
      logRecent(req.method, req.url, false, "Room not found");
      return res.status(404).json({ error: "Room not found" });
    }

    // Si la habitación existe, procede a actualizar sus datos y actualizar la columna 'updatedAt'
    await pool.query(
      'UPDATE public."room" SET "numberRoom" = $1, "typeRoom" = $2, "restrictions" = $3, "updatedAt" = NOW() WHERE "idRoom" = $4',
      [numberRoom, typeRoom, restrictions, idRoomParam]
    );

    logRecent(req.method, req.url);
    res.json({ message: "Room updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    logRecent(req.method, req.url, false, "Internal Server Error");
  }
});

// Obtener todas las reservaciones de un usuario
app.get("/getBookings/:idUser", async (req, res) => {
  const idUserParam = req.params.idUser;

  try {
    const result = await pool.query(
      'SELECT b.*,r."numberRoom",tr."nameTypeRoom" FROM public."booking" b JOIN public."room" r ON b."idRoom" = r."idRoom" JOIN public."typeRoom" tr ON tr."id"=r."typeRoom" WHERE b."idUser" =$1 ORDER BY b."idBooking" ASC;',
      [idUserParam]
    );

    const userBookings = result.rows;
    logRecent(req.method, req.url);
    res.json(userBookings);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    logRecent(req.method, req.url, false, "Internal Server Error");
  }
});

//Crear una reserva
app.post("/createBooking", async (req, res) => {
  const { startDate, endDate, idRoom, idUser } = req.body; // Obtener los datos del objeto Booking enviado en la solicitud

  try {
    // Insertar la nueva reserva en la base de datos y obtener el ID generado
    const result = await pool.query(
      'INSERT INTO public."booking" ("startDate", "endDate", "idRoom", "idUser") VALUES ($1, $2, $3, $4) RETURNING "idBooking"',
      [startDate, endDate, idRoom, idUser]
    );

    const idBooking = result.rows[0].idBooking; // Obtener el ID generado
    logRecent(req.method, req.url);
    res.json({ message: "Booking created successfully", data: { idBooking } }); // Devolver el ID de la reserva creada en la respuesta
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    logRecent(req.method, req.url, false, "Internal Server Error");
  }
});

//Actualizar una reserva
app.put("/updateBooking/:idBooking", async (req, res) => {
  const idBookingParam = req.params.idBooking;
  const { idRoom, startDate, endDate } = req.body; // Obtener los datos del objeto Booking enviado en la solicitud
  try {
    // Verificar si la reserva con el ID proporcionado existe
    const bookingExistence = await pool.query(
      'SELECT * FROM public."booking" WHERE "idBooking" = $1',
      [idBookingParam]
    );

    // Si no se encontró ninguna reserva con ese ID, devuelve un mensaje de error
    if (bookingExistence.rows.length === 0) {
      logRecent(req.method, req.url, false, "Booking not found");
      return res.status(404).json({ error: "Booking not found" });
    }

    // Si la reserva existe, procede a actualizar sus datos y actualizar la columna 'updatedAt'
    await pool.query(
      'UPDATE public."booking" SET "startDate" = $1, "endDate" = $2, "idRoom"= $3,  "updatedAt" = NOW() WHERE "idBooking" = $4',
      [startDate, endDate, idRoom, idBookingParam]
    );

    logRecent(req.method, req.url);
    res.json({ message: "Booking updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    logRecent(req.method, req.url, false, "Internal Server Error");
  }
});

// Eliminar una reserva
app.delete("/deleteBooking/:idBooking", async (req, res) => {
  const idBookingParam = req.params.idBooking;

  try {
    // Eliminar la reserva de la base de datos
    await pool.query('DELETE FROM public."booking" WHERE "idBooking" = $1', [
      idBookingParam,
    ]);
    logRecent(req.method, req.url);
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    logRecent(req.method, req.url, false, "Internal Server Error");
  }
});

//Obtener todas las habitaciones que esten disponibles en una fecha y que ademas pertenezcan al tipo de habitacion que se solicita
app.get(
  "/getAvailableRooms/:startDate/:endDate/:idTypeRoom",
  async (req, res) => {
    const startDateParam = req.params.startDate;
    const endDateParam = req.params.endDate;
    const idTypeRoomParam = req.params.idTypeRoom;

    try {
      const result = await pool.query(
        `SELECT * FROM public."room" 
         WHERE "typeRoom" = $1 
           AND "idRoom" NOT IN (
             SELECT "idRoom" 
             FROM public."booking" 
             WHERE "startDate" < $3 AND "endDate" > $2
           )
           AND (
             "startUndisponibility" IS NULL 
             OR "endUndisponibility" IS NULL 
             OR NOT ("startUndisponibility" < $3 AND "endUndisponibility" > $2)
           )`,
        [idTypeRoomParam, startDateParam, endDateParam]
      );

      const availableRooms = result.rows;
      logRecent(req.method, req.url);
      res.json(availableRooms);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
      logRecent(req.method, req.url, false, "Internal Server Error");
    }
  }
);

//Poner en manteniiento una habitación por fecha
app.put("/maintenanceRoom/:idRoom/:startDate/:endDate", async (req, res) => {
  const idRoomParam = req.params.idRoom;
  const startDateParam = req.params.startDate;
  const endDateParam = req.params.endDate;

  try {
    // Verificar si la habitación con el ID proporcionado existe
    const roomExistence = await pool.query(
      'SELECT * FROM public."room" WHERE "idRoom" = $1',
      [idRoomParam]
    );

    // Si no se encontró ninguna habitación con ese ID, devuelve un mensaje de error
    if (roomExistence.rows.length === 0) {
      logRecent(req.method, req.url, false, "Room not found");
      return res.status(404).json({ error: "Room not found" });
    }

    // Actualizar la disponibilidad de la habitación
    await pool.query(
      'UPDATE public."room" SET "startUndisponibility" = $1, "endUndisponibility" = $2, "updatedAt" = NOW() WHERE "idRoom" = $3',
      [startDateParam, endDateParam, idRoomParam]
    );

    // Verificar reservas que se solapan con el periodo de mantenimiento
    const overlappingReservations = await pool.query(
      'SELECT * FROM public."booking" WHERE "idRoom" = $1 AND ("startDate" < $2 AND "endDate" > $3)',
      [idRoomParam, endDateParam, startDateParam]
    );

    // Mover reservas afectadas
    for (const reservation of overlappingReservations.rows) {
      // Encontrar una nueva habitación disponible
      const newRoom = await pool.query(
        'SELECT * FROM public."room" WHERE "idRoom" != $1 AND ("startUndisponibility" IS NULL OR "endUndisponibility" IS NULL OR "endUndisponibility" < $2) LIMIT 1',
        [idRoomParam, reservation.startDate]
      );

      if (newRoom.rows.length > 0) {
        const newRoomId = newRoom.rows[0].idRoom;
        // Actualizar la reserva con la nueva habitación
        await pool.query(
          'UPDATE public."booking" SET "idRoom" = $1 WHERE "idBooking" = $2',
          [newRoomId, reservation.idBooking]
        );
      } else {
        // Si no se encuentra una habitación disponible, revertir los cambios anteriores y retornar error
        await pool.query(
          'UPDATE public."room" SET "startUndisponibility" = NULL, "endUndisponibility" = NULL, "updatedAt" = NOW() WHERE "idRoom" = $1',
          [idRoomParam]
        );
        logRecent(
          req.method,
          req.url,
          false,
          "No available rooms to move the reservation"
        );
        return res
          .status(409)
          .json({ error: "No available rooms to move the reservation" });
      }
    }

    logRecent(req.method, req.url);
    res.json({
      message: "Room in maintenance successfully and reservations updated",
    });
  } catch (error) {
    console.log(error);
    // En caso de error, revertir los cambios de mantenimiento
    await pool.query(
      'UPDATE public."room" SET "startUndisponibility" = NULL, "endUndisponibility" = NULL, "updatedAt" = NOW() WHERE "idRoom" = $1',
      [idRoomParam]
    );
    res.status(500).json({ error: "Internal Server Error" });
    logRecent(req.method, req.url, false, "Internal Server Error");
  }
});

//Consumo de api para mandar correos
app.post("/sendEmail", async (req, res) => {
  const { user, email, message } = req.body;
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "hotelzambezia@gmail.com",
      subject: `${user} - ${email}`,
      html: message,
    });
    // Respuesta exitosa
    logRecent(req.method, req.url);
    res.status(200).json({ message: "Correo electrónico enviado con éxito" });
  } catch (error) {
    // Manejo de errores
    logRecent(req.method, req.url, false, "Error sending email");
    res
      .status(500)
      .json({ error: "Se produjo un error al enviar el correo electrónico" });
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
