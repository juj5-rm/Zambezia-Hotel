import express from "express";
import cors from "cors";
import { pool } from "../dataBase/connectionPostgreSql.js";

const app = express();
const PORT = 3000;

// Habilita CORS para todas las solicitudes
app.use(express.json());
app.use(cors());

// Obtiene los usuarios
app.get("/getUsers", async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM public.users ORDER BY "idUser" ASC'
    );

    const users = result.rows;
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Obtiene los tipos de habitaciones
app.get("/getTypeRooms", async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM public."typeRoom" ORDER BY "id" ASC'
    );

    const typeRooms = result.rows;
    res.json(typeRooms);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Obtiene las habitaciones
app.get("/getRooms", async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM public."room" ORDER BY "idRoom" ASC'
    );

    const rooms = result.rows;
    res.json(rooms);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Obtiene las reservaciones
app.get("/getBookings", async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM public."booking" ORDER BY "idBooking" ASC'
    );

    const bookings = result.rows;
    res.json(bookings);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Obtiene las reservaciones para un usuario específico
app.get("/getBookings/:idUser", async (req, res) => {
  const idUserParam = req.params.idUser;

  try {
    const result = await pool.query(
      'SELECT * FROM public."booking" WHERE "idUser" = $1 ORDER BY "idBooking" ASC',
      [idUserParam]
    );

    const userbookings = result.rows;
    res.json(userbookings);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Endpoints para usuario

// Obtener un usuario
app.get("/getUser/:idUser", async (req, res) => {
  const idUserParam = req.params.idUser;

  try {
    const result = await pool.query(
      'SELECT * FROM public.users WHERE "idUser" = $1',
      [idUserParam]
    );

    const user = result.rows[0];
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
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

    res.json({ message: "User created successfully", data: { idUser } }); // Devolver el ID del usuario creado en la respuesta
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
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
    // Actualizar el usuario en la base de datos y actualizar la columna 'updatedAt'
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

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Eliminar un usuario
app.delete("/deleteUser/:idUser", async (req, res) => {
  const idUserParam = req.params.idUser;

  try {
    // Eliminar el usuario de la base de datos
    await pool.query('DELETE FROM public.users WHERE "idUser" = $1', [
      idUserParam,
    ]);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Verificar existencia de usuario
app.post("/verifyUser", async (req, res) => {
  const { emailUser, passwordUser } = req.body;

  try {
    // Validar que se proporcionen email y contraseña
    if (!emailUser || !passwordUser) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Buscar usuario por email en la base de datos
    const result = await pool.query(
      'SELECT "idUser" FROM public.users WHERE "emailUser" = $1 AND "passwordUser" = $2',
      [emailUser, passwordUser]
    );

    const user = result.rows[0];

    // Verificar si se encontró un usuario
    if (user) {
      // Devolver solo el ID del usuario
      res.json({ idUser: user.idUser });
    } else {
      // Usuario no encontrado o contraseña incorrecta
      res.status(401).json({ error: "Incorrect email or password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Endpoints para tipo de habitación

// Obtener un tipo de habitación
app.get("/getTypeRoom/:id", async (req, res) => {
  const idTypeRoomParam = req.params.id;

  try {
    const result = await pool.query(
      'SELECT * FROM public."typeRoom" WHERE "id" = $1',
      [idTypeRoomParam]
    );

    const typeRoom = result.rows[0];
    res.json(typeRoom);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Crear un tipo de habitación
app.post("/createTypeRoom", async (req, res) => {
  const { nameTypeRoom, maxCapacity, price } = req.body; // Obtener los datos del objeto TypeRoom enviado en la solicitud

  try {
    // Insertar el nuevo tipo de habitación en la base de datos y obtener el ID generado
    const result = await pool.query(
      'INSERT INTO public."typeRoom" ("nameTypeRoom", "maxCapacity", "price") VALUES ($1, $2, $3) RETURNING "id"',
      [nameTypeRoom, maxCapacity, price]
    );

    const idTypeRoom = result.rows[0].id; // Obtener el ID generado

    res.json({
      message: "TypeRoom created successfully",
      data: { id },
    }); // Devolver el ID del tipo de habitación creado en la respuesta
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Actualizar un tipo de habitación
app.put("/updateTypeRoom/:id", async (req, res) => {
  const idTypeRoomParam = req.params.id;
  const { nameTypeRoom, maxCapacity, price } = req.body; // Obtener los datos del objeto TypeRoom enviado en la solicitud

  try {
    // Actualizar el tipo de habitación en la base de datos y actualizar la columna 'updatedAt'
    await pool.query(
      'UPDATE public."typeRoom" SET "nameTypeRoom" = $1, "maxCapacity" = $2, "price" = $3, "updatedAt" = NOW() WHERE "id" = $4',
      [nameTypeRoom, maxCapacity, price, idTypeRoomParam]
    );

    res.json({ message: "TypeRoom updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Eliminar un tipo de habitación
app.delete("/deleteTypeRoom/:id", async (req, res) => {
  const idTypeRoomParam = req.params.id;

  try {
    // Eliminar el tipo de habitación de la base de datos
    await pool.query('DELETE FROM public."typeRoom" WHERE "id" = $1', [
      idTypeRoomParam,
    ]);

    res.json({ message: "TypeRoom deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Endpoints para habitación

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
