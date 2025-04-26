import { MikroORM } from "@mikro-orm/core"; // MikroORM para interactuar con la base de datos
import { defineConfig } from "@mikro-orm/mysql"; // Configuración específica para MySQL
import { SqlHighlighter } from "@mikro-orm/sql-highlighter"; // Resaltador para las consultas SQL en los logs

// Inicializar MikroORM con la configuración definida
export const orm = await MikroORM.init(defineConfig({
    entities: ['dist/**/*.entity.js'], // Ruta a las entidades compiladas en JavaScript
    entitiesTs: ['src/**/*.entity.ts'], // Ruta a las entidades en TypeScript (para desarrollo)
    dbName: 'sistema', // Nombre de la base de datos
    clientUrl: 'mysql://dsw:dsw@localhost:3306', // URL de conexión a la base de datos (usuario, contraseña, host y puerto)
    highlighter: new SqlHighlighter(), // Resaltador para las consultas SQL en los logs
    debug: true, // Habilitar el modo de depuración para mostrar consultas SQL en la consola
    schemaGenerator: {
        disableForeignKeys: true, // Deshabilitar temporalmente las claves foráneas al generar el esquema
        createForeignKeyConstraints: true, // Crear restricciones de claves foráneas
        ignoreSchema: [], // Esquemas que se deben ignorar (vacío en este caso)
    },
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