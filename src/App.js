import express from 'express';
import { ProductManager} from './ProductManager.js';

const app = express ();

app.listen(8080, () => {
    console.log(`Servidor Express escuchando en el puerto 8080`);
});

app.use(express.urlencoded({extended:true}))

const productManagerInstance = new ProductManager('./Products.json')

//Mensaje de bienivenida al acceder a la raíz de la app
app.get('/', (req, res) => {
    res.send('¡Bienvenidos a mi aplicación!');
  });
  
//Endpoint que obtiene todos los productos o una cantidad limitada de productos según límite fijado (el null indica que NO hay límite alguno)
app.get('/products', async (req,res) =>{
    try{
        const products = await productManagerInstance.getProducts();

        //Verificación de límite al listar los productos
        const limit = req.query.limit ? parseInt(req.query.limit) : null; //Editar el parámetro null para fijar límites numéricos

        //Devolver el listado con tods los productos o el límite que se haya ingresado
        const response = limit ? products.slice(0, limit) : products;

        res.json(response);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener listado de productos' });
    }
});

//Endpoint para obtención de productos por su ID, para hacer la prueba manual, reemplazar el :pid por el ID del producto.
app.get('/products/:pid', async (req, res) => {
    try {
      const productId = parseInt(req.params.pid);
      const product = await productManagerInstance.getProductById(productId);
  
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
  
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el producto solicitado' });
    }
});

