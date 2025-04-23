# Pasos para iniciar el  Sistema de Gestion BF
Sistema de gestión del instituto diseñado para simplificar y optimizar todas las tareas administrativas y académicas. 

## Backend

Scripts: 
* pnpm install (si es la primera vez utilizando el proyecto)
* pnpm star:dev
* enjoy :)

## Frontend
Scripts
* pnpm install (si es la primera vez utilizando el proyecto)
* ng serve --o 
* enjoy :)

## Base de datos

### Imputs
INSERT INTO admin (usuario, password, rol, nombre, apellido, mail, direccion, fecha_n, numero)  
VALUES
('marcosadm', '$2a$10$dZo/6LxArYBYtdu7e/qQM.GiOKvS4HJvTe44HFQtZ5TBfb8CWVnmG', 'admin', 'Marcos', 'Martinez', 'martinezmarcos@gmail.com', 'Oroño 12', '2002-02-10', 1),

('abrilabonizio', '$2a$10$oHSYJkWJq3WDcNuqpl.l/.FGocVU7QU.4Dm4LKcXMXGm1qokxUca6', 'admin', 'Abril', 'Abonizio', 'aabonizio@gmail.com', 'Salta 4125', '2003-02-03', 2),

('pedroadmin', '$2a$10$ht8NxvQIwfY2YBVnZuxzNOaRLT57mz1vY8ZQ7l7epe.4wEacpTJJa', 'admin', 'Pedro', 'Sánchez', 'pedro.sanchez@gmail.com', 'Av. Belgrano 200', '2001-05-15', 3),

('mariacp', '$2a$10$6eFshQvD.OKMzxKPGGoi3OSKSAhuwqtDHMpQQUvCqcXY5AdgB49bW', 'admin', 'María', 'Crespín', 'maria.crespin@gmail.com', 'Calle Libertad 101', '2000-09-12', 4),

('juanmartinez', '$2a$10$hJmlxMDmfbytsPNEWuV0be0ByO95J4Boe8fASRAi3TROMYSPl/stC', 'admin', 'Juan', 'Martínez', 'juan.martinez@gmail.com', '9 de Julio 1000', '1999-12-10', 5);

passwords:
- marcosmartin1414
- abril02abonizz
- pedro123admin
- mariaadmin2020
- juan2021admin

USE sistema;
INSERT INTO alumno (usuario, password, rol, nombre, apellido, plan, mail, direccion, fecha_n, legajo)  
VALUES
('fedemestre', '$2a$10$xbxxdktIb93ztZphE8mEn..njAfHYgz/q4J4Uq1bEiJhQFxSHqqo.', 'alumno', 'Federico', 'Mestre', '01', 'fede.mestre@gmail.com', 'Oroño 12', '2001-08-13', 1),

('belengust', '$2a$10$2RrRhNfksyzLzpXpAcsw/uXJ4gv9LEui.dPUVPZC4FIc3rke4AK7.', 'alumno', 'Belén', 'Guastoni', '98', 'belu.guastoni@gmail.com', 'Salta 4125', '2004-06-14', 2),

('marianomay', '$2a$10$dfK/faC2SGyryCqK7SxHGOILWPkXZVsMI696YR9TAil7vp2AgXySS', 'alumno', 'Mariano', 'Mayorga', '05', 'mayo.mariano@gmail.com', 'Calle 7', '1999-04-01', 3),

('juanpaez', '$2a$10$G/ZTYiS1RGbYFgM0KYXTpOkkVgotaeM6QJ/7aOyqbKTewHCiuMcyS', 'alumno', 'Juan', 'Paez', '10', 'juan.paez@mail.com', 'Av. Libertador 100', '2000-11-22', 4),

('luisaorozco', '$2a$10$0eL41OyfNUtVO8TvR4JMPeUc8LT3cwRRChIjvcr4yfZ4ShW2vNNdK', 'alumno', 'Luisa', 'Orozco', '24', 'luisa.orozco@gmail.com', 'Calle 25', '2002-12-10', 5),

('davidzarco', '$2a$10$V3xnStONlf0N832RY0qcj.vl/W0RWcoiEzvpZgHyLKBGeEkL2P7Ya', 'alumno', 'David', 'Zarco', '01', 'dav.zarco@gmail.com', 'Calle Ficticia 3', '2003-01-15', 6),

('julianmora', '$2a$10$7QIQYBO6BFLWKjLOV135k.oi5HiR8vO9rpwZ8A5BoR/FFcB66QdLq', 'alumno', 'Julián', 'Mora', '98', 'julian.mora@yahoo.com', 'Libertador 250', '2000-08-25', 7),

('lucianafernandez', '$2a$10$..OYaaPAkpv.s.GPbyBqc.CTAZ4ed5LtquFAalAptRaqFmwGldpg2', 'alumno', 'Luciana', 'Fernández', '05', 'luciana.fen@gmail.com', 'Av. Belgrano', '2001-07-20', 8),

('martasosa', '$2a$10$0C3Y0KZvGQ0AQc.sqJkor.drGatLKifYYmxRSd04JN/cc6Gat1Yla', 'alumno', 'Marta', 'Sosa', '10', 'marta.sosa@mail.com', '9 de Julio', '2000-02-13', 9),

('pablovega', '$2a$10$KLknp7g1GjYEz8.bs3Zp4u7BAcIF8E7wfLePm/BUfnjBo7Gaf2CEy', 'alumno', 'Pablo', 'Vega', '24', 'pablo.vega@gmail.com', 'Paseo Colón', '2001-11-04', 10);

passwords:
- 123fede1308
- belen14guast
- mari2021gonz
- juanpaez2020
- uisaluisa2021
- davzarco1998
- julianmora2000
- lucianaf2022
- martasosa08
- pablovega1997

USE sistema;

INSERT INTO materia (nombre, horas_anuales, modalidad)

VALUES

('Psicología', 20, 'Anual'),

('Matemáticas', 15, 'Cuatrimestral'),

('Física', 30, 'Anual'),

('Química', 25, 'Cuatrimestral'),

('Biología', 20, 'Anual'),

('Geografía', 18, 'Cuatrimestral'),

('Historia', 22, 'Anual'),

('Literatura', 10, 'Cuatrimestral'),

('Filosofía', 14, 'Anual'),

('Sociología', 16, 'Cuatrimestral');






