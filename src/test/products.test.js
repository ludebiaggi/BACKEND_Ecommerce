import chai from 'chai';
import supertest from 'supertest';
import app from '../app.js'; 

const expect = chai.expect;
const request = supertest.agent(app);

describe('Testing endpoint de productos', () => {
    it('Debería crear un nuevo producto', async () => {
        const newProduct = {
            title: 'Producto de prueba',
            description: 'Descripción del producto de prueba',
            code: 'TEST123',
            price: 99.99,
            stock: 10,
            category: 'Test',
            thumbnails: ['thumbnail1.jpg', 'thumbnail2.jpg']
        };

        const res = await request.post('/api/products').send(newProduct);
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('product');
    });

    it('Debería obtener un listado de productos', async () => {
        const res = await request.get('/api/products');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('products').that.is.an('array');
    });

    it('Debería obtener un producto por ID', async () => {
        const productId = 'ID_DEL_PRODUCTO_EXISTENTE'; //Acá reemplazo el ID de producto x uno de mi BBDD
        const res = await request.get(`/api/products/${productId}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('product');
    });

    it('Debería actualizar un producto existente', async () => {
        const productId = 'ID_DEL_PRODUCTO_EXISTENTE'; //Acá reemplazo el ID de producto x uno de mi BBDD
        const updatedProduct = {
            price: 12500.99,
            stock: 150
        };

        const res = await request.put(`/api/products/${productId}`).send(updatedProduct);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('product');
    });

    it('Debería eliminar un producto existente', async () => {
        const productId = 'ID_DEL_PRODUCTO_EXISTENTE'; //Acá reemplazo el ID de producto x uno de mi BBDD
        const res = await request.delete(`/api/products/${productId}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('product');
    });
});
