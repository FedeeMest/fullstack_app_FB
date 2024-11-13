# Pasos para iniciar el  Sistema de Gestion BF
Sistema de gestión del instituto diseñado para simplificar y optimizar todas las tareas administrativas y académicas. 

## Backend

comandos: 
* pnpm install (si es la primera vez utilizando el proyecto)
* pnpm star:dev
* enjoy :)

## Frontend
* pnpm install (si es la primera vez utilizando el proyecto)
* ng serve --o 
* enjoy :)

## Base de datos

### Crear las tablas
create database if not exists sistema;

use sistema;

create table if not exists `sistema`.`alumno` (

  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  
  `nombre` VARCHAR(255) NOT NULL,
  
  `apellido` VARCHAR(255) NOT NULL,
  
  `plan` VARCHAR(255) NOT NULL,
  
  `mail` VARCHAR(255) NOT NULL,
  
  `direccion` VARCHAR(255) NOT NULL,
  
  `fecha_n` VARCHAR(50) NOT NULL,
  
  `legajo` VARCHAR(50) NOT NULL,
  
  PRIMARY KEY (`id`));


  

create table if not exists `sistema`.`materia` (

  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  
  `nombre` VARCHAR(255) NOT NULL UNIQUE,
  
  `horas_anuales` INT NOT NULL,
  
  `modalidad` VARCHAR(50) NOT NULL,
  
  PRIMARY KEY (`id`));


  

create table if not exists `sistema`.`inscripcion` (

  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  
  `alumno` INT UNSIGNED NOT NULL,
  
  `materia` INT UNSIGNED NOT NULL,
  
  `fecha` VARCHAR(50) NOT NULL,
  
  PRIMARY KEY (`id`),
  
  CONSTRAINT 'fk_alumno'
  
  FOREIGN KEY (`alumno`)
    
  REFERENCES `sistema`.`alumno` (`id`)
    
  ON DELETE CASCADE
    
  ON UPDATE CASCADE,
    
  CONSTRAINT `fk_materia`
  
  FOREIGN KEY (`materia`)
    
  REFERENCES `sistema`.`materia` (`id`)
    
  ON DELETE RESTRICT
    
  ON UPDATE CASCADE);

