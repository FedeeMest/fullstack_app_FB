# Documentación del Proyecto SysAcad
Descripción del Proyecto
SysAcad es una aplicación Full Stack diseñada para la gestión académica de una institución educativa. 
Permite a los administradores gestionar alumnos, materias, inscripciones y otros aspectos relacionados con la administración académica. 
Los alumnos pueden acceder a su información personal y realizar consultas relacionadas con su progreso académico.

El sistema está dividido en dos partes principales:\
**FrontEnd**: Una aplicación web desarrollada en Angular para la interacción con los usuarios.\
**BackEnd**: Una API RESTful desarrollada en Node.js para manejar la lógica del servidor y la base de datos.

## Objetivo del Proyecto
El objetivo principal de SysAcad es proporcionar una solución eficiente y escalable para la gestión académica, permitiendo:\
A los **administradores**: gestionar alumnos, materias, inscripciones y otros recursos académicos.\
A los **alumnos**: consultar su información personal, inscribirse en materias y realizar otras acciones relacionadas con su progreso académico.
## Tecnologias Utilizadas
**FrontEnd**
* Framework: Angular 18.1.2
* Lenguaje: TypeScript
* Estilos: CSS, Bootstrap
* Autenticación: JWT (JSON Web Tokens)
* Testing:
* Unit Testing: Karma
* End-to-End Testing: Playwright
* Gestión de Dependencias: PNPM
  
**BackEnd**
* Framework: Express.js
* Lenguaje: TypeScript
* Base de Datos: MySQL
* ORM: MikroORM
* Autenticación: JWT (JSON Web Tokens)
* Encriptación: bcryptjs
* Gestión de Dependencias: PNPM
  
**Testing:**
* Unit Testing: Jest
* API Testing: Supertest

## Estructura del Proyecto
**FrontEnd**\
Ubicación: FrontEnd/SysAcad\
Estructura de Carpetas:
* src/app: Contiene los componentes, servicios e interfaces de la aplicación.
* components: Componentes como navbar, login, etc.
* services: Servicios para interactuar con la API del BackEnd.
* interfaces: Definiciones de tipos e interfaces.
* public: Archivos estáticos como imágenes y estilos globales.
* tests: Pruebas end-to-end con Playwright.\

**Archivos Clave**
* angular.json: Configuración del proyecto Angular.
* package.json: Dependencias y scripts del FrontEnd.
* server.ts: Configuración del servidor para SSR (Server-Side Rendering).
* vercel.json: Configuración para el despliegue en Vercel.

**BackEnd**\
Ubicación: BackEnd\
Estructura de Carpetas:
* src: Contiene la lógica del servidor.
* auth: Manejo de autenticación y generación de tokens JWT.
* admin: Controladores y servicios para la gestión de administradores.
* alumno: Controladores y servicios para la gestión de alumnos.
* materia: Controladores y servicios para la gestión de materias.
* Middleware: Middleware para validaciones y autenticación.
* shared: Configuración de la base de datos y utilidades comunes.
* utils: Funciones auxiliares y scripts.
* tests: Pruebas unitarias y de integración.

**Archivos Clave**
* app.ts: Configuración principal del servidor Express.
* package.json: Dependencias y scripts del BackEnd.
* .env: Variables de entorno para la configuración del servidor.
* tsconfig.json: Configuración de TypeScript.

## Funcionalidades Principales
**Para Administradores**
* Gestión de alumnos: Crear, editar, eliminar y consultar información de alumnos.
* Gestión de materias: Crear, editar, eliminar y consultar materias.
* Gestión de inscripciones: Inscribir alumnos en materias.
* Autenticación segura con roles.

**Para Alumnos**
* Consulta de información personal.
* Inscripción en materias.
* Visualización de materias inscritas.

## Configuración y Ejecución
**FrontEnd**
(Estar en la ruta Frontend/sysacad)
1. Instalar dependencias → ` pnpm install `
2. Ejecutar el servidor de desarrollo →  ` ng serve -–o `
3. Acceder a la aplicación en: http://localhost:4200/.

**BackEnd**
1. Instalar dependencias → ` pnpm install `
2. Configurar las variables de entorno en el archivo .env.
3. Ejecutar el servidor → ` pnpm start:dev `
4. La API estará disponible en: http://localhost:3000/.

## Test
**FrontEnd**
* Ejecutar pruebas unitarias → ` ng test `
* Ejecutar pruebas end-to-end → ` ng npx playwright test tests/gestion-materias.spec.ts `

**BackEnd**
* Ejecutar pruebas unitarias → pnpm test

# Configuración de la base de datos
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=dsw
    DB_PASSWORD=dsw
    DB_NAME=sistema
    NODE_ENV=development
    JWT_SECRET=belenfede123
    PORT=3000
Crear un archivo .env en la raiz de la carpara Backend con la informacion nombrada anteriormente

Modificar los imports de los servicios del FrontEnd por la siguiente informacion:\
` import { environment } from '../environments/environment'`

# Carga de Base de Datos para entorno de prueba local
```
USE sistema;
INSERT INTO alumno (usuario, password, rol, nombre, apellido, plan, mail, direccion, fecha_n, legajo)  
VALUES
('juanpaez', '$2a$10$G/ZTYiS1RGbYFgM0KYXTpOkkVgotaeM6QJ/7aOyqbKTewHCiuMcyS', 'alumno', 'Juan', 'Paez', '10', 'juan.paez@mail.com', 'Av. Libertador 100', '2000-11-22', 1),
('luisaorozco', '$2a$10$0eL41OyfNUtVO8TvR4JMPeUc8LT3cwRRChIjvcr4yfZ4ShW2vNNdK', 'alumno', 'Luisa', 'Orozco', '24', 'luisa.orozco@gmail.com', 'Calle 25', '2002-12-10', 2),
('davidzarco', '$2a$10$V3xnStONlf0N832RY0qcj.vl/W0RWcoiEzvpZgHyLKBGeEkL2P7Ya', 'alumno', 'David', 'Zarco', '01', 'dav.zarco@gmail.com', 'Calle Ficticia 3', '2003-01-15', 3),
('lucianafernandez', '$2a$10$..OYaaPAkpv.s.GPbyBqc.CTAZ4ed5LtquFAalAptRaqFmwGldpg2', 'alumno', 'Luciana', 'Fernández', '05', 'luciana.fen@gmail.com', 'Av. Belgrano', '2001-07-20', 4),
('martasosa', '$2a$10$0C3Y0KZvGQ0AQc.sqJkor.drGatLKifYYmxRSd04JN/cc6Gat1Yla', 'alumno', 'Marta', 'Sosa', '10', 'marta.sosa@mail.com', '9 de Julio', '2000-02-13', 5),

INSERT INTO admin (usuario, password, rol, nombre, apellido, mail, direccion, fecha_n, numero)  
VALUES
('abrilabonizio', '$2a$10$oHSYJkWJq3WDcNuqpl.l/.FGocVU7QU.4Dm4LKcXMXGm1qokxUca6', 'admin', 'Abril', 'Abonizio', 'aabonizio@gmail.com', 'Salta 4125', '2003-02-03', 1),
('pedroadmin', '$2a$10$ht8NxvQIwfY2YBVnZuxzNOaRLT57mz1vY8ZQ7l7epe.4wEacpTJJa', 'admin', 'Pedro', 'Sánchez', 'pedro.sanchez@gmail.com', 'Av. Belgrano 200', '2001-05-15', 2),
('mariacp', '$2a$10$6eFshQvD.OKMzxKPGGoi3OSKSAhuwqtDHMpQQUvCqcXY5AdgB49bW', 'admin', 'María', 'Crespín', 'maria.crespin@gmail.com', 'Calle Libertad 101', '2000-09-12', 3),
('juanmartinez', '$2a$10$hJmlxMDmfbytsPNEWuV0be0ByO95J4Boe8fASRAi3TROMYSPl/stC', 'admin', 'Juan', 'Martínez', 'juan.martinez@gmail.com', '9 de Julio 1000', '1999-12-10', 4);

INSERT INTO materia (nombre, horas_anuales, modalidad)
VALUES
('Psicología', 20, 'Anual'),
('Física', 30, 'Anual'),
('Química', 25, 'Cuatrimestral'),
('Biología', 20, 'Anual'),
('Geografía', 18, 'Cuatrimestral')
```
## Credenciales para Inicio de Sesion (¡ENTORNO LOCAL!):
**Alumnos:**\
User: juanpaez - Password: juanpaez2020\
User: luisaorozco - Password: luisaluisa2021\
User: davidzarco - Password: davzarco1998\
User: lucianafernandez - Password: lucianaf2022\
User: martasosa - Password: martasosa08

**Admins:**\
User: pedroadmin - Password: pedro123admin\
User: mariacp - Password: mariaadmin2020\
User: juanmartinez - Password: juan2021admin\
User: abrilabonizio - Password: abril02abonizz

## Uso del deployd de la app
**URL del deployd**\
`URL:`\
\
**Credenciales para el uso de la app**\
Admin:\
`User: belenght - Password: belen123`\
Alumno:\
`User: fedems - Password: fede123`

