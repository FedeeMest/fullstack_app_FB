import 'reflect-metadata'
import express from 'express';
import { alumnoRouter } from './alumno/alumno.routes.js';
import {orm, syncSchema} from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core';
import { materiaRouter } from './materia/materia.routes.js';
import { inscripcionRouter } from './inscripcion/inscripcion.routes.js';
import cors from 'cors';
import { authRoutes } from './auth/auth.routes.js';
import { verifyRole } from './Middleware/authMiddleware.js'; // Asegúrate de ajustar la ruta según tu estructura de proyecto
import { adminRouter } from './admin/admin.routes.js';


const app = express();
app.use(express.json()) 
app.use(cors());

app.use ((req, res, next) => {
  RequestContext.create(orm.em, next)
})

app.use('/auth', authRoutes);

// Rutas protegidas para admin
app.use('/api/admins',adminRouter);
app.use('/api/materias', materiaRouter);

// Rutas protegidas para admin y alumno
app.use('/api/alumnos', alumnoRouter);
app.use('/api/inscripciones', inscripcionRouter);


app.use((_, res) => {
    return res.status(404).json({Error:"Ruta no encontrada"});
})

await syncSchema()
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.listen(3000, () => {
  console.log('Server abierto en http://localhost:3000');
}); 
