
import { validarMateria } from './validarMateria';

describe('validarMateria', () => {
  
  it('debería devolver true si la materia es válida (más de 3 caracteres)', () => {
    expect(validarMateria('Matematica')).toBe(true);
    expect(validarMateria('Fisica')).toBe(true);
    expect(validarMateria('Química')).toBe(true);
  });

  it('debería devolver false si la materia tiene menos de 3 caracteres', () => {
    expect(validarMateria('AI')).toBe(false);
    expect(validarMateria('')).toBe(false);
  });

  it('debería ignorar espacios al principio y al final', () => {
    expect(validarMateria('  Algebra  ')).toBe(true);
    expect(validarMateria('  Bi  ')).toBe(false);
  });

});

