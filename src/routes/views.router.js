import { Router } from "express";
import { ProductManager } from "../productManager.js";

const router = Router();
const productManagerInstance = new ProductManager('./products.json');


 // Renderizará la vista API/VIEWS/ correspondiente al "Home" y pasará el listado de productos completo.
router.get('/', async (req, res) => {
    try {
        const products = await productManagerInstance.getProducts();
        res.render('home', { products });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener listado de productos' });
    }
});

// Renderizará la vista API/VIEWS/REALTIMEPRODUCTS y mostrando el listado de productos en tiempo real, sumando o eliminando los ítems según las acciones ingresadas por forms.
router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManagerInstance.getProducts();
        res.render('realTimeProducts', { products }); 
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener listado de productos' });
    }
});


// Eliminar un producto x su ID //VER PORQUE NO ME FUNCIONA
router.post('api/views/delete/:id', async (req, res) => {
    try {
      const productId = req.body.productId;
      const deletedProduct = await productManagerInstance.deleteProduct(productId);
      if (deletedProduct) {
        // Se emite el evento sólo si se eliminó OK
        socketServer.emit('deleteProduct', productId);
        console.log('Producto eliminado:', productId);
      }
      res.redirect('/api/views/realtimeproducts'); //Redirecciona automáticamente a la vista de realtimeproducts
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el producto' });
    }
  });
  

export default router;
