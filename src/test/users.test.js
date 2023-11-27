import chai from 'chai';
import supertest from 'supertest';
import app from '../app.js'; 

const expect = chai.expect;
const request = supertest.agent(app);

describe('Testing endpoint de usuarios', () => {
    it('Debería registrar un nuevo usuario', async () => {
        const newUser = {
            first_name: 'Nombre',
            last_name: 'Apellido',
            email: 'nuevousario@email.com',
            age: 25,
            password: 'contraseña',
        };

        const res = await request.post('/api/users/register').send(newUser);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('status', 'success');
    });

    it('Debería iniciar sesión con un usuario existente', async () => {
        const credentials = {
            email: 'usuario@email.com',
            password: 'contraseña'
        };

        const res = await request.post('/api/users/login').send(credentials);
        expect(res.status).to.equal(200);
        expect(res.redirects[0]).to.contain('/api/views/products');
    });

    it('Debería cambiar el rol de un usuario', async () => {
        const userId = 'ID_DEL_USUARIO_EXISTENTE'; //Acá reemplazo ID x uno de mi colection user de mi BBDD

        const res = await request.put(`/api/users/premium/${userId}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('status', 'success');
    });
});
