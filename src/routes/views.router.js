import { Router } from "express";
import { ProductManager } from "../productManager.js";

const router = Router();
const productManagerInstance = new ProductManager('./products.json');

 // Renderizará la vista API/VIEWS correspondiente al "Home" y pasa el listado de productos
router.get('/', async (req, res) => {
    try {
        const products = await productManagerInstance.getProducts();
        res.render('home', { products });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener listado de productos' });
    }
});

// Renderiza la vista API/VIEWS/REALTIMEPRODUCTS y pasa el listado de productos, sumando o eliminando los ítems según lo que ocurra en paralelo.
router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManagerInstance.getProducts();
        res.render('realTimeProducts', { products }); 
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener listado de productos' });
    }
});


// Eliminar un producto x su ID //VER PORQUE NO ME FUNCIONA
router.post('/delete', async (req, res) => {
    try {
      const productId = req.body.productId;
      const deletedProduct = await productManagerInstance.deleteProduct(productId);
      if (deletedProduct) {
        // se emite el evento sólo si se eliminó OK
        socketServer.emit('deleteProduct', productId);
      }
      res.redirect('/api/views/realtimeproducts');
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el producto' });
    }
  });
  

export default router;
