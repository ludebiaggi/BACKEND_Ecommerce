import { ProductManager} from './productManager.js';
//Cuando quiero correr el testing, importar el Filepath

// Se genera el archivo testing para que se evite ejecutar todo éste código al momento de importar el ProductManager desde mi archivo APP.js

async function testing() {
    const productManagerInstance = new ProductManager(filePath);
  
    console.log("getProducts inicial:", await productManagerInstance.getProducts());
  
    // Se adicionan los productos.
    await productManagerInstance.addProduct({
      title: "Producto prueba 1",
      description: "Descripción del producto prueba  1",
      price: 1200.50,
      thumbnail: "Sin imagen",
      code: "Product1",
      stock: 11,
      category: "Categoria 1",
      id: null // El ID se generará automáticamente
    });
  
    await productManagerInstance.addProduct({
      title: "Producto prueba 2",
      description: "Descripción del producto prueba 2",
      price: 499.99,
      thumbnail: "Sin imagen",
      code: "Product2",
      stock: 15,
      category: "Categoria 1",
      id: null // El ID se generará automáticamente
    });
  
    await productManagerInstance.addProduct({
      title: "Producto prueba 3",
      description: "Descripción del producto prueba 3",
      price: 2567.67,
      thumbnail: "Sin imagen",
      code: "Product3",
      stock: 28,
      category: "Categoria 1",
      id: null // El ID se generará automáticamente
    });
  
    await productManagerInstance.addProduct({
      title: "Producto prueba 4",
      description: "Descripción del producto prueba 4",
      price: 112567.67,
      thumbnail: "Sin imagen",
      code: "Product4",
      stock: 280,
      category: "Categoria 1",
      id: null // El ID se generará automáticamente
    });
  
    await productManagerInstance.addProduct({
      title: "Producto prueba 5",
      description: "Descripción del producto prueba 5",
      price: 2977.67,
      thumbnail: "Sin imagen",
      code: "Product5",
      stock: 78,
      category: "Categoria 1",
      id: null // El ID se generará automáticamente
    });
  
    await productManagerInstance.addProduct({
      title: "Producto prueba 6",
      description: "Descripción del producto prueba 6",
      price: 16588,
      thumbnail: "Sin imagen",
      code: "Product6",
      stock: 6,
      category: "Categoria 2",
      id: null // El ID se generará automáticamente
    });
  
    await productManagerInstance.addProduct({
      title: "Producto prueba 7",
      description: "Descripción del producto prueba 7",
      price: 70000.70,
      thumbnail: "Sin imagen",
      code: "Product7",
      stock: 77,
      category: "Categoria 2",
      id: null // El ID se generará automáticamente
    });
  
    await productManagerInstance.addProduct({
      title: "Producto prueba 8",
      description: "Descripción del producto prueba 8",
      price: 14566,
      thumbnail: "Sin imagen",
      code: "Product8",
      stock: 11,
      category: "Categoria 2",
      id: null // El ID se generará automáticamente
    });
  
    await productManagerInstance.addProduct({
      title: "Producto prueba 9",
      description: "Descripción del producto prueba 9",
      price: 999.99,
      thumbnail: "Sin imagen",
      code: "Product9",
      stock: 99,
      category: "Categoria 2",
      id: null // El ID se generará automáticamente
    });
  
    await productManagerInstance.addProduct({
      title: "Producto prueba 10",
      description: "Descripción del producto prueba 10",
      price: 1000,
      thumbnail: "Sin imagen",
      code: "Product10",
      stock: 10000,
      category: "Categoria 2",
      id: null // El ID se generará automáticamente
    });
  
    await productManagerInstance.addProduct({
      title: "Producto prueba 11",
      description: "Descripción del producto prueba 11",
      price: 8500.78,
      thumbnail: "Sin imagen",
      code: "Product11",
      stock: 100,
      category: "Categoria 2",
      id: null // El ID se generará automáticamente
    });
  
    console.log("getProducts después de agregar los productos:", await productManagerInstance.getProducts());
  
    // Se llama al ID de un producto que no existe para que arroje error.
    const nonExistentProduct = await productManagerInstance.getProductById(15);
    console.log("Producto no encontrado");
  
    // Obtener los productos iniciales (siempre que el archivo de productos no exista, traerá el array vacío)
    const initialProducts = await productManagerInstance.getProducts();
    console.log("Listado de productos iniciales:", initialProducts);
  
    // Agregar un nuevo producto
    const newProduct = {
      title: "Producto prueba 12",
      description: "Descripción del producto prueba 12",
      price: 10899.75,
      thumbnail: "Sin imagen",
      code: "Product12",
      category: "Categoria 2",
      stock: 10,
    };
    await productManagerInstance.addProduct(newProduct);
  
    // Obtener los productos tras agregar uno nuevo
    const productsAfterAdd = await productManagerInstance.getProducts();
    console.log("Listado de productos tras agregar un producto nuevo:", productsAfterAdd);
  
    // Obtención producto por ID
    const productId = 2; // Acá se ingresa el ID del producto que se quiere buscar
    const productById = await productManagerInstance.getProductById(productId);
    console.log(`Usted buscó el producto cuyo ID es: ${productId}`);
    console.log("Producto encontrado:", productById);
  
    // Actualizar TITLE del producto, identificándolo por ID
    const productIdToUpdate = 4; // Acá se ingresa el ID del producto a actualizar
    await productManagerInstance.updateProduct(productIdToUpdate, "Producto ACTUALIZADO");
  
    // Obtener los productos tras actualizar uno
    const productsAfterUpdate = await productManagerInstance.getProducts();
    console.log("Listado de productos tras de actualizar un producto:", productsAfterUpdate);
  
    // Eliminar un producto por su ID
    const productIdToDelete = 2; // Aquí se ingresa ID del producto a eliminar
    await productManagerInstance.deleteProduct(productIdToDelete);
  
    // Obtener los productos después de eliminar uno
    const productsAfterDelete = await productManagerInstance.getProducts();
    console.log("Listado de productos tras eliminar un producto:", productsAfterDelete);
  }
  
  testing();
  