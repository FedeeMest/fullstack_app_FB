import express from 'express';
import { alumnoRouter } from './alumno/alumno.routes.js';
import cors from 'cors';

const app = express();
app.use(express.json()) 

app.use(cors());

app.use("/api/alumnos", alumnoRouter)


app.use((_, res) => {
    return res.status(404).json({Error:"Ruta no encontrada"});
})

app.listen(3000, () => {
  console.log('Server abierto en http://localhost:3000');
}); 
