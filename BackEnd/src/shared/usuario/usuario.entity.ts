import { Entity, Property, PrimaryKey } from '@mikro-orm/core';

@Entity({ discriminatorColumn: 'rol' })
export class Usuario {
  @PrimaryKey({ nullable: false })
  id!: number;

  @Property({ nullable: false })
  usuario!: string;

  @Property({ nullable: false })
  password!: string;

  @Property({ nullable: false })
  nombre!: string;

  @Property({ nullable: false })
  apellido!: string;

  @Property({ nullable: false })
  mail!: string;

  @Property({ nullable: false })
  fecha_n!: string;

  @Property({ nullable: false })
  direccion!: string;

  @Property({ nullable: false })
  rol!: string; //  campo para distinguir entre Alumno y Admin
}