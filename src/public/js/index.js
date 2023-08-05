const socketClient = io();


socketClient.on('connect', () => {
  console.log('Conectado al servidor de WebSocket');
});


socketClient.on('addProduct', (newProduct) => {
  const productList = document.getElementById('productList');
  const newItem = document.createElement('li');
  newItem.textContent = `${newProduct.title} - ${newProduct.price} - ${newProduct.description}`;
  productList.appendChild(newItem);
});


document.getElementById('addProductForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const newProduct = {};
  formData.forEach((value, key) => {
    newProduct[key] = value;
  });
  socketClient.emit('addProduct', newProduct);
  form.reset();
});

document.getElementById('deleteProductForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const productId = formData.get('productId');
  socketClient.emit('deleteProduct', productId); // Envía solo el ID del producto
  form.reset();
});



socketClient.on('productDeleted', (productId) => {
  const productList = document.getElementById('productList');
  const productItem = productList.querySelector(`li[data-product-id="${productId}"]`);
  if (productItem) {
    productList.removeChild(productItem);
  }
});
