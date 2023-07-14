  const fs = require('fs');
  const filePath = 'products.json';
  
  // Se verifica si el archivo existe, si no existe se crea.
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf-8');
    console.log(`Se ha creado el archivo ${filePath}`);
  }
  
class ProductManager {
  constructor(filePath){
    this.path = filePath;
    this.products = [];
    this.lastProductId = 0;
    this.loadProducts();
  }

  //Cargará los productos en el caso de existir.
  async loadProducts() {
    try{
      const data = await fs.promises.readFile(this.path, 'utf-8');
      this.products = JSON.parse(data);
      this.updateLastProductId();
    } catch (error) {
      console.log('Error al cargar productos', error.message);
    }
  }

  //Guardará los productos en el archivo.
  async saveProducts() {
    try {
      const data = JSON.stringify(this.products, null, 2);
      await fs.promises.writeFile(this.path, data, 'utf-8');
      console.log('Se guardaron los productos', this.path);
    } catch (error) {
      console.log('Error al guardar los productos', error.message);
    }
  }
  
  
  //Incrementa el ID
  updateLastProductId(){
    if (this.products.length > 0) {
      const lastProduct = this.products[this.products.length - 1];
      this.lastProductId = lastProduct.id;
    }
  }
  
  //Valida que todos los campos del producto estén completos y sean válidos.
  addProduct(product) {
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock
    ) {
      console.log('Debes completar todos los campos.');
      return;
    }
    //Validación para que no se admita un código repetido.
    if (this.products.some((p) => p.code === product.code)) {
      console.log(`Ya existe un producto con el código ${product.code}.`);
      return;
    }

    this.lastProductId++;
    product.id = this.lastProductId;
    this.products.push(product);
    this.saveProducts();
    console.log(`Producto agregado: ${product.title}`);
    return product;
  }
  //Método para traer listado los productos.
  async getProducts(){
    this.loadProducts();
    return this.products;
  }
  //Método para traer los productos by ID
  async getProductById(id){
    this.loadProducts();
    const product = this.products.find ((p)=> p.id === id);
    if(product) {
      return product;
    } else {
      console.log('Producto no encontrado');
      return null;
    }
  }
  //Método para actualizar campo TITLE del producto.
  updateProduct(id, field, value) {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex !== -1) {
      this.products[productIndex][field] = value;
      this.saveProducts();
      console.log(`Se actualiza el título del producto a: ${this.products[productIndex].title}`);
    }
  }
  
  // Método para buscar un producto y eliminarlo según su index.
  deleteProduct(id) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index !== -1) {
      const deletedProduct = this.products.splice(index, 1)[0];
      this.saveProducts();
      console.log(`Producto eliminado: ${deletedProduct.title}`);
    } else {
      console.log('Producto no encontrado.');
    }
  }

}


//Testing 
async function testing () {
  const productManagerInstance = new ProductManager(filePath);

  console.log("getProducts inicial:", productManagerInstance.getProducts());
  
  //Se adicionan los productos.
  await productManagerInstance.addProduct({
    title: "Producto prueba 1",
    description: "Descripción del producto prueba  1",
    price: 1200.50,
   thumbnail: "Sin imagen",
    code: "Product1",
    stock: 11,
    id: null // El ID se generará automáticamente
  });

  await productManagerInstance.addProduct({
    title: "Producto prueba 2",
    description: "Descripción del producto prueba 2",
    price: 499.99,
    thumbnail: "Sin imagen",
    code: "Product2",
    stock: 15,
    id: null // El ID se generará automáticamente
  });

  await productManagerInstance.addProduct({
    title: "Producto prueba 3",
    description: "Descripción del producto prueba 3",
    price: 2567.67,
    thumbnail: "Sin imagen",
    code: "Product3",
    stock: 28,
    id: null // El ID se generará automáticamente
  });

  console.log("getProducts después de agregar un producto:", productManagerInstance.getProducts());


  // Se llama al ID de un producto que no existe para que arroje error.
  const nonExistentProduct = productManagerInstance.getProductById(10);
  
  
  // Obtener los productos iniciales (siempre que el archivo de productos no exista, traerá el array vacío)
  const initialProducts = productManagerInstance.getProducts();
  console.log("Productos iniciales:", initialProducts);

  // Agregar un nuevo producto
  const newProduct = {
    title: "Producto prueba 4",
    description: "Descripción del producto prueba 4",
    price: 10899.75,
    thumbnail: "Sin imagen",
    code: "Product4",
    stock: 10,
    id: null // El ID se generará automáticamente
  };
  await productManagerInstance.addProduct(newProduct);

  // Obtener los productos tras agregar uno  nuevo
  const productsAfterAdd = productManagerInstance.getProducts();
  console.log("Listado de productos tras agregar un producto nuevo:", productsAfterAdd);

  //Obtención producto por ID
  const productId = 2; // ID del producto que se quiere buscar
  const productById = productManagerInstance.getProductById(productId);
  console.log("Producto ID:", productById);

  //Actualizar title del producto, identificándolo por ID
  const productIdToUpdate = 4; // Aquí se ingresa el ID del producto a actualizar
  productManagerInstance.updateProduct(productIdToUpdate, "title", "Producto mejorado");
  

  // Obtener los productos tras actualizar uno
  const productsAfterUpdate = productManagerInstance.getProducts();
  console.log("Listado de productos tras de actualizar un producto:", productsAfterUpdate);

  // Eliminar un producto por su ID
  const productIdToDelete = 2; // Aquí se ingresa ID del producto a eliminar
  productManagerInstance.deleteProduct(productIdToDelete);

  // Obtener los productos después de eliminar uno
  const productsAfterDelete = productManagerInstance.getProducts();
  console.log("Listado de productos tras eliminar un producto:", productsAfterDelete);

}

testing()