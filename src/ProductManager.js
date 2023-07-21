import fs from 'fs';
const filePath = 'products.json';

// Se verifica si el archivo existe, si no existe se crea.
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, '[]', 'utf-8');
  console.log(`Se ha creado el archivo ${filePath}`);
}

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.lastProductId = 0;
    this.loadProducts();
  }

  // Carga los productos en caso de existir.
  async loadProducts() {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8');
      this.products = JSON.parse(data);
      this.updateLastProductId();
    } catch (error) {
      console.log('Error al cargar productos', error.message);
      return null;
    }
  }

  // Guarda los productos en el archivo.
  async saveProducts(data) {
    try {
      const newData = JSON.stringify(data, null, 2);
      await fs.promises.writeFile(this.path, newData, 'utf-8');
      console.log('Se guardaron los productos', this.path);
    } catch (error) {
      console.log('Error al guardar los productos', error.message);
      return null;
    }
  }

  // Actualiza el ID
  updateLastProductId() {
    if (this.products.length > 0) {
      const lastProduct = this.products[this.products.length - 1];
      this.lastProductId = lastProduct.id;
    }
  }

  // Valida que todos los campos del producto estén completos y sean válidos.
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

    // Validación para que no se admita un código repetido.
    if (this.products.some((p) => p.code === product.code)) {
      console.log(`Ya existe un producto con el código ${product.code}.`);
      return;
    }

    this.lastProductId++;
    product.id = this.lastProductId;
    this.products.push(product);

    this.saveProducts(this.products)
      .then(() => {
        console.log(`Producto agregado: ${product.title}`);
      })
      .catch((error) => {
        console.log('Error al guardar los productos', error.message);
      });

    return product;
  }

  // Método para traer el listado de productos.
  async getProducts() {
    await this.loadProducts();
    return this.products;
  }

  // Método para obtener un producto por su ID
  async getProductById(id) {
    await this.loadProducts();
    const product = this.products.find((p) => p.id === id);
    if (product) {
      return product;
    } else {
      console.log('Producto no encontrado');
      return null;
    }
  }

  // Método para actualizar el campo TITLE del producto.
  async updateProduct(id, updatedTitle) {
    const productToUpdate = this.products.find((p) => p.id === id);
    if (!productToUpdate) {
      console.log(`Producto con id ${id} no encontrado`);
      return;
    }

    productToUpdate.title = updatedTitle;

    await this.saveProducts(this.products)
      .then(() => {
        console.log(`Se actualiza el producto: ${JSON.stringify(productToUpdate)}`);
      })
      .catch((error) => {
        console.log('Error al guardar los productos', error.message);
      });
  }

  // Método para buscar un producto y eliminarlo según su index.
  async deleteProduct(id) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index !== -1) {
      const deletedProduct = this.products.splice(index, 1)[0];
      await this.saveProducts(this.products)
        .then(() => {
          console.log(`Producto eliminado: ${deletedProduct.title}`);
        })
        .catch((error) => {
          console.log('Error al guardar los productos', error.message);
        });
    } else {
      console.log('Producto no encontrado.');
      return null;
    }
  }
}




export {ProductManager}


