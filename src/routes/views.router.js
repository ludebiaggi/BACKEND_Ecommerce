import { Router } from "express";
import { MongoProductManager } from '../managers/MongoProductManager.js';

const productManagerInstance = new MongoProductManager(); 

const router = Router();

 // Renderizará la vista API/VIEWS/ correspondiente al "Home" y pasará el listado de productos completo.
router.get('/', async (req, res) => {
    try {
        const products = await productManagerInstance.getProducts();
        res.render('home', { products });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener listado de productos' });
    }
});

//Renderizará la nueva ruta de PRODUCTS (API/VIEWS/PRODUCTS)
router.get('/products', async (req, res) => {
  try {
      const products = await productManagerInstance.getProducts();
      res.render('products', { products });
  } catch (error) {
      res.status(500).json({ error: 'Error al obtener listado de productos' });
  }
});


// Renderizará la vista API/VIEWS/REALTIMEPRODUCTS y mostrando el listado de productos en tiempo real, sumando o eliminando los ítems según las acciones ingresadas por forms.
router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManagerInstance.getProducts() ;
        res.render('realTimeProducts', { products }); 
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el listado de productos' });
    }
});


//Renderizará automáticamente el listado nuevamente, quitando el producto eliminado por ID.
  router.delete('/delete/:id', async (req, res) => {
    const productId = req.params.id;

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

// Nueva ruta para visualizar un carrito específico con sus productos utilizando populate
router.get('/carts/:cid', async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cart = await cartManagerInstance.getPopulatedCartById(cartId);
    res.render('carts', { products: cart.products });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});
  
//USUARIOS ---
const publicAcces = (req,res,next) =>{
  if(req.session.user) return res.redirect('/profile');
  next();
}

const privateAcces = (req,res,next)=>{
  if(!req.session.user) return res.redirect('/login');
  next();
}


router.get('/register', publicAcces, (req,res)=>{
  res.render('register')
})

router.get('/login', publicAcces, (req,res)=>{
  res.render('login')
})

router.get('/profile', privateAcces ,(req,res)=>{
  res.render('profile',{
      user: req.session.user
  })
})


export default router;
