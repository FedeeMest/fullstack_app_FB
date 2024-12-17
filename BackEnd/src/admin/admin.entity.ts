import { Entity, Property } from '@mikro-orm/core';
import { Usuario } from '../shared/usuario/usuario.entity.js';

@Entity()
export class Admin extends Usuario {
  @Property({ nullable: false })
  numero!: string;
}

