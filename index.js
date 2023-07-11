class ProductManager {
    //Generación de products como arreglo vacío
    constructor() {
      this.products = [];
      this.lastProductId = 0;
    }
    //Método addProducts agregará productos al array vacío.
    addProduct(product) {
      //Validación para que ningún campo quede sin completar.  
      if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
        console.log("Debes completar todos los campos.");
        return;
      }
      //Validación para que ningún producto repita el código.
      if (this.products.some(p => p.code === product.code)) {
        console.log(`Ya existe un producto con el código ${product.code}.`);
        return;
      }
      //Generación de nuevo ID para el producto.
      product.id = this.generateProductId();
      this.products.push(product);
      console.log(`Producto agregado: ${product.title}`);
      return product;
    }
    
    //Método para listar los productos ya agregados.
    getProducts() {
      return this.products;
    }
    //Método para buscar los productos mediante su ID.
    getProductById(id) {
      const product = this.products.find(p => p.id === id);
      if (product) {
        return product;
      } else {
        console.log("Error: Producto no encontrado.");
        return null;
      }
    }
    //Método para generar los ID únicos, irrepetibles e incrementales.
    generateProductId() {
      return this.products.length + 1; 
    }
  }
  
  const productManager = new ProductManager();
  
  console.log("getProducts inicial:", productManager.getProducts());
  
  productManager.addProduct({
    title: "Producto prueba 1",
    description: "Descripción del producto prueba  1",
    price: 1200.50,
    thumbnail: "Sin imagen",
    code: "Product1",
    stock: 11,
    id: null // El ID se generará automáticamente
  });
  
  productManager.addProduct({
    title: "Producto prueba 2",
    description: "Descripción del producto prueba 2",
    price: 499.99,
    thumbnail: "Sin imagen",
    code: "Product2",
    stock: 15,
    id: null // El ID se generará automáticamente
  });
  
  productManager.addProduct({
    title: "Producto prueba 3",
    description: "Descripción del producto prueba 3",
    price: 2567.67,
    thumbnail: "Sin imagen",
    code: "Product3",
    stock: 28,
    id: null // El ID se generará automáticamente
  });
  
  console.log("getProducts después de agregar un producto:", productManager.getProducts());
  
  //Al intentar agregar un producto con el mismo código, arroja el error.
  productManager.addProduct({
    title: "Producto prueba 2",
    description: "Descripción del producto prueba 2",
    price: 499.99,
    thumbnail: "Sin imagen",
    code: "Product2",
    stock: 15,
    id: null // El ID se generará automáticamente
  });
  
  const productById = productManager.getProductById(2);
  console.log("Producto por ID:", productById);
  
  //Se llama al ID de un producto que no es existente para que arroje error.
  const nonExistentProduct = productManager.getProductById(10);
  