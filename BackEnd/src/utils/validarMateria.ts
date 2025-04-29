export function validarMateria(nombreMateria: string): boolean {
    const materiaTrimmed = nombreMateria.trim();
    
    if (materiaTrimmed.length < 3) {
      return false;
    }
  
    return true;
  }