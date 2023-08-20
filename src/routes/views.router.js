import { Router } from "express";
import { ProductManager } from "../managers/productManager.js";

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
        res.status(500).json({ error: 'Error al obtener el listado de productos' });
    }
});


  //Renderizará automáticamente el listado nuevamente, quitando el producto eliminado por ID.
  router.delete('/api/views/delete/:id', async (req, res) => {
    const productId = parseInt(req.params.id);

    try {
        const deletedProduct = await productManagerInstance.deleteProduct(productId);
    if (deletedProduct) {
      socketServer.emit('deleteProduct', productId);
      res.status(200).json({ message: `Producto ID ${productId} eliminado.` });
    } else {
      res.status(404).json({ error: `No se encontró producto con el ID ${productId}.` });
    }
    } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto.' });
  }
});
  

export default router;
