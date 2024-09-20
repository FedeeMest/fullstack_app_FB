import 'reflect-metadata'
import express from 'express';
import { alumnoRouter } from './alumno/alumno.routes.js';
import {orm, syncSchema} from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core';


const app = express();
app.use(express.json()) 

app.use ((req, res, next) => {
  RequestContext.create(orm.em, next)
})

app.use("/api/alumnos", alumnoRouter)


app.use((_, res) => {
    return res.status(404).json({Error:"Ruta no encontrada"});
})

await syncSchema()

app.listen(3000, () => {
  console.log('Server abierto en http://localhost:3000');
}); 
