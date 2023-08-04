import { Router } from "express";
import { ProductManager } from "../productManager.js";

const router = Router();
const productManagerInstance = new ProductManager('./products.json');

 // Renderizará la vista "home" y pasa el listado de productos
router.get('/', async (req, res) => {
    try {
        const products = await productManagerInstance.getProducts();
        res.render('home', { products });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener listado de productos' });
    }
});

// Renderiza la vista "realTimeProducts" y pasa el listado de productos, aumando o eliminando los ítems según lo que ocurra en paralelo.
router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManagerInstance.getProducts();
        res.render('realTimeProducts', { products }); 
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener listado de productos' });
    }
});

export default router;
