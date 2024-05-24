import express from 'express';
import { finalRouter } from './final/final.routes.js';

const app = express(); 
app.use(express.json()) 

app.use("/api/finales", finalRouter)

app.use((_, res) => {
    return res.status(404).json({Error:"Ruta no encontrada"});
})

app.listen(3000, () => {
  console.log('Server abierto en http://localhost:3000');
}); 
