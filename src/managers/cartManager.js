import fs from 'fs';

const filePath = 'carts.json';

// Se verifica si el archivo existe, si no existe se crea.
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, '[]', 'utf-8');
  console.log(`Se ha creado el archivo ${filePath}`);
}

//Se genera la clase partiendo del constructor.
class CartManager {
  constructor(filePath) {
    this.path = filePath;
    this.carts = [];
    this.lastCartId = 0;
    this.loadCarts();
  }

  // Carga los carritos en caso de existir, sino traerá un array vacío
  async loadCarts() {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8');
      this.carts = JSON.parse(data);
      this.updateLastCartId();
    } catch (error) {
      throw new Error('Error al cargar carritos: ' + error.message);
    }
  }

  // Guarda los carritos en el archivo.
  async saveCarts(data) {
    try {
      const newData = JSON.stringify(data, null, 2);
      await fs.promises.writeFile(this.path, newData, 'utf-8');
      console.log('Se guardaron los carritos', this.path);
    } catch (error) {
      throw new Error('Error al guardar los carritos: ' + error.message);
    }
  }

  // Actualiza el ID del carrito
  updateLastCartId() {
    if (this.carts.length > 0) {
      const lastCart = this.carts[this.carts.length - 1];
      this.lastCartId = lastCart.id;
    }
  }

  // Método para crear un nuevo carrito
  createCart() {
    const newCart = {
      id: this.lastCartId + 1,
      products: [],
    };

    this.lastCartId++;
    this.carts.push(newCart);

    this.saveCarts(this.carts)
      .then(() => {
        console.log(`Carrito creado, su ID es: ${newCart.id}`);
      })
      .catch((error) => {
        console.log('Error al guardar los carritos', error.message);
      });

    return newCart;
  }

  // Método para obtener un carrito por su ID
  getCartById(id) {
    const cart = this.carts.find((c) => c.id === id);
    if (cart) {
      return cart;
    } else {
      throw new Error('Carrito no encontrado');
    }
  }

  // Método para agregar un producto al carrito
  addProductToCart(cartId, productId, quantity = 1) {
    const cart = this.getCartById(cartId);
    const existingProduct = cart.products.find((p) => p.product === productId);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    this.saveCarts(this.carts)
      .then(() => {
        console.log(`Producto agregado al carrito ${cartId}`);
      })
      .catch((error) => {
        throw new Error('Error al guardar los carritos: ' + error.message);
      });

    return cart;
  }
}

export { CartManager };
