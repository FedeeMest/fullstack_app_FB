import request from 'supertest';
import { app } from '../app';
import { orm } from '../shared/db/orm';
import { Materia } from '../materia/materia.entity';

describe('Materia Controller - Add Function', () => {
    beforeAll(async () => {
        await orm.getSchemaGenerator().refreshDatabase(); // Reset database before tests
    });

    afterAll(async () => {
        await orm.close(); // Close ORM connection after tests
    });

    it('should create a new Materia successfully', async () => {
        const newMateria = {
            nombre: 'Matemáticas',
            horas_anuales: 120,
            modalidad: 'Presencial',
        };

        const response = await request(app)
            .post('/api/materias')
            .send(newMateria)
            .set('Accept', 'application/json');

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('mensaje', 'Materia creada con éxito');
        expect(response.body.data).toMatchObject(newMateria);
    });

    it('should return 400 if the nombre is less than 3 characters', async () => {
        const invalidMateria = {
            nombre: 'Ma',
            horas_anuales: 120,
            modalidad: 'Presencial',
        };

        const response = await request(app)
            .post('/api/materias')
            .send(invalidMateria)
            .set('Accept', 'application/json');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('mensaje', 'El nombre de la materia debe tener al menos 3 caracteres');
    });

    it('should return 400 if horas_anuales is less than or equal to 0', async () => {
        const invalidMateria = {
            nombre: 'Matemáticas',
            horas_anuales: 0,
            modalidad: 'Presencial',
        };

        const response = await request(app)
            .post('/api/materias')
            .send(invalidMateria)
            .set('Accept', 'application/json');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('mensaje', 'Las horas anuales deben ser mayores a 0');
    });

    it('should return 400 if a Materia with the same nombre already exists', async () => {
        const duplicateMateria = {
            nombre: 'Matemáticas',
            horas_anuales: 120,
            modalidad: 'Presencial',
        };

        // Create the first Materia
        await request(app).post('/api/materias').send(duplicateMateria);

        // Attempt to create a duplicate Materia
        const response = await request(app)
            .post('/api/materias')
            .send(duplicateMateria)
            .set('Accept', 'application/json');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('mensaje', 'Ya existe una materia con ese nombre');
    });
});