import { validarHorasMateria } from './validarHorasMateria';

describe('validarHorasMateria', () => {

  it('debería devolver true si las horas anuales son mayores a 0', () => {
    expect(validarHorasMateria(100)).toBe(true);
    expect(validarHorasMateria(1)).toBe(true);
  });

  it('debería devolver false si las horas anuales son 0 o negativas', () => {
    expect(validarHorasMateria(0)).toBe(false);
    expect(validarHorasMateria(-10)).toBe(false);
  });

});