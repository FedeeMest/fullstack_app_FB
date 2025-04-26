import * as bcrypt from 'bcryptjs';

// Lista de contraseñas originales
const passwords: string[] = [
  'marcosmartin1414',
  'abril02abonizz',
  'fede.mestre1308',
  'belen14guast',
  // Agrega las demás contraseñas aquí
];

// Número de saltos que se utilizarán en el proceso de hash
const saltRounds = 10; // Puedes ajustar este número para más seguridad

// Función para hashear las contraseñas
const hashPasswords = async () => {
  for (const password of passwords) {
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      console.log(`Contraseña original: ${password}`);
      console.log(`Contraseña hasheada: ${hashedPassword}`);
      console.log('----------------------------------');
    } catch (error) {
      console.error(`Error al hashear la contraseña ${password}: ${error}`);
    }
  }
};

// Ejecutar la función
hashPasswords();
