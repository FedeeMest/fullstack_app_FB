import { MikroORM } from "@mikro-orm/core"; // MikroORM para interactuar con la base de datos
import { defineConfig } from "@mikro-orm/mysql"; // Configuración específica para MySQL
import { SqlHighlighter } from "@mikro-orm/sql-highlighter"; // Resaltador para las consultas SQL en los logs
import * as dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo envirement.env
dotenv.config();

// Inicializar MikroORM con la configuración definida
export const orm = await MikroORM.init(defineConfig({
    entities: ['dist/**/*.entity.js'], // Ruta a las entidades compiladas en JavaScript
    entitiesTs: ['src/**/*.entity.ts'], // Ruta a las entidades en TypeScript (para desarrollo)
    dbName: process.env.DB_NAME || 'sistema', // Nombre de la base de datos
    clientUrl: `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    highlighter: new SqlHighlighter(), // Resaltador para las consultas SQL en los logs
    debug: process.env.NODE_ENV === 'development', // Habilitar el modo de depuración solo en desarrollo
    schemaGenerator: {
        disableForeignKeys: true, // Deshabilitar temporalmente las claves foráneas al generar el esquema
        createForeignKeyConstraints: true, // Crear restricciones de claves foráneas
        ignoreSchema: [], // Esquemas que se deben ignorar (vacío en este caso)
    },
     ensureDatabase: false,
}));

// Función para sincronizar el esquema de la base de datos
export const syncSchema = async () => {
    const generator = orm.getSchemaGenerator(); // Obtener el generador de esquemas

    /*
    // Opcional: Eliminar y recrear el esquema desde cero
    await generator.dropSchema(); // Eliminar el esquema existente
    await generator.createSchema(); // Crear un nuevo esquema
    */

    // Actualizar el esquema existente para reflejar cambios en las entidades
    await generator.updateSchema();
};