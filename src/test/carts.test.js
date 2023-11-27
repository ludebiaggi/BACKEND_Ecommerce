import chai from 'chai';
import supertest from 'supertest';
import app from '../app.js'

const expect = chai.expect;
const requester = supertest('hhtp://localhost:8080')
const request = supertest.agent(app);

describe('Testing endpoint de carritos', () => {
    it('Debería crear un nuevo carrito', async () => {
      const res = await request.post('/api/carts');
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('cart');
    });
  
    it('Debería poblar un carrito utilizando el populate', async () => {
      const res = await request.get('/api/carts/:cid');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });
  
    it('Debería agregar un producto al carrito', async () => {
      const res = await request.post('/api/carts/:cid/product/:pid').send({ quantity: 1 }); //Cambiar quantity segun se requiera para el testing
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('cart');
    });

    it('Debería eliminar un producto del carrito', async () => {
        const res = await request.delete('/api/carts/:cid/product/:pid'); 
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('cart');
    });
    
    it('Debería eliminar todos los productos de un carrito', async () => {
        const res = await request.delete('/api/carts/:cid'); 
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('cart');
    });
    
    it('Debería actualizar la cantidad de un producto específico del carrito', async () => {
        const res = await request.put('/api/carts/:cid/product/:pid').send({ quantity: 5 }); //Cambiar quantity segun se requiera para el testing
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('cart');
    });
    
    it('Debería avanzar con el proceso de compra', async () => {
        const res = await request.post('/api/carts/:cid/purchase'); 
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('message').that.equals('Compra exitosa');
        expect(res.body).to.have.property('ticket');
        expect(res.body).to.have.property('notPurchasedProducts');
    });
});