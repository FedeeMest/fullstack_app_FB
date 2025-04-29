import 'reflect-metadata'; // Importa metadatos necesarios para decoradores (usado por MikroORM)
import express from 'express'; // Framework para crear el servidor HTTP
import { alumnoRouter } from './alumno/alumno.routes.js'; // Rutas para el módulo de alumnos
import { orm, syncSchema } from './shared/db/orm.js'; // ORM y función para sincronizar el esquema de la base de datos
import { RequestContext } from '@mikro-orm/core'; // Contexto de solicitud para MikroORM
import { materiaRouter } from './materia/materia.routes.js'; // Rutas para el módulo de materias
import { inscripcionRouter } from './inscripcion/inscripcion.routes.js'; // Rutas para el módulo de inscripciones
import cors from 'cors'; // Middleware para habilitar CORS
import { authRoutes } from './auth/auth.routes.js'; // Rutas para autenticación
import { verifyRole } from './Middleware/authMiddleware.js'; // Middleware para verificar roles
import { adminRouter } from './admin/admin.routes.js'; // Rutas para el módulo de administradores
import * as dotenv from 'dotenv';

// Crear una instancia de la aplicación Express
const app = express();

// Middleware para analizar solicitudes JSON
app.use(express.json());

// Middleware para habilitar CORS (permite solicitudes desde otros dominios)
app.use(cors());

// Middleware para crear un contexto de solicitud para MikroORM
app.use((req, res, next) => {
  RequestContext.create(orm.em, next); // Asocia el EntityManager al contexto de la solicitud
});

// Rutas públicas para autenticación
app.use('/auth', authRoutes);

// Rutas protegidas para administradores
app.use('/api/admins', adminRouter);
app.use('/api/materias', materiaRouter);

// Rutas protegidas para administradores y alumnos
app.use('/api/alumnos', alumnoRouter);
app.use('/api/inscripciones', inscripcionRouter);

dotenv.config({ path: './envirement.env' });
console.log('JWT_SECRET:', process.env.JWT_SECRET);

// Middleware para manejar rutas no encontradas
app.use((_, res) => {
  return res.status(404).json({ Error: "Ruta no encontrada" }); // Devuelve un error 404 si la ruta no existe
});

// Sincronizar el esquema de la base de datos
await syncSchema();

// Manejo de excepciones no capturadas
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error); // Loguea errores no capturados
});

// Manejo de promesas rechazadas no manejadas
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason); // Loguea promesas rechazadas no manejadas
});

// Iniciar el servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server abierto en http://localhost:${PORT}`);
}); 
