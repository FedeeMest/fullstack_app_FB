import { Entity, Property, PrimaryKey } from '@mikro-orm/core';

@Entity()
export class usuario {
  @PrimaryKey({ nullable: false })
  id!: number;

  @Property({ nullable: false })
  usuario!: string;

  @Property({ nullable: false })
  contraseña!: string;

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
  tipo_usuario!: string; //  campo para distinguir entre Alumno y Admin
}