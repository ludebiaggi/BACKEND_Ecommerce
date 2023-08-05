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

// Escuchar el evento de eliminación desde el servidor
socketClient.on('deleteProduct', (productId) => {
  const productList = document.getElementById('productList');
  const items = productList.getElementsByTagName('li');
  for (let i = 0; i < items.length; i++) {
    const liProductId = parseInt(items[i].dataset.productId);
    if (liProductId === productId) {
      items[i].remove();
      break;
    }
  }
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

