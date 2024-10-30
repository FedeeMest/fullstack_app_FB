import express from 'express';
import { alumnoRouter } from './alumno/alumno.routes.js';
import cors from 'cors';
import { materiaRouter } from './materia/materia.routes.js';
import { inscripcionRouter } from './inscripcion/inscripcion.routes.js';
import { Request, Response, NextFunction } from 'express';

const app = express();
app.use(express.json()) 

app.use(cors());

app.use("/api/alumnos", alumnoRouter)
app.use("/api/materias", materiaRouter)
app.use("/api/inscripciones", inscripcionRouter)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message || err);

  // Define el código de estado
  const statusCode = err.status || 500;

  // Responder con un JSON que contenga el mensaje de error
  res.status(statusCode).json({
      error: {
          message: err.message || 'Error interno del servidor',
          stack: process.env.NODE_ENV === 'development' ? err.stack : undefined // solo en desarrollo
      }
  });
});


app.use((_, res) => {
    return res.status(404).json({Error:"Ruta no encontrada"});
})

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.listen(3000, () => {
  console.log('Server abierto en http://localhost:3000');
}); 
