//Creamos la instancia de socket.io como cliente y se conecta al sweb socket server
const socketClient = io();

//Se configura el evento para mostrar el mensaje cuando la conexión se establece.
socketClient.on('connect', () => {
  console.log('Conectado al servidor de WebSocket');
});

//Evento que recibe los datos del servidor para luego crear un nuevo producto con la info ingresada y mostrarlo en la lista.
socketClient.on('addProduct', (newProduct) => {
  const productList = document.getElementById('productList');
  const newItem = document.createElement('li');
  newItem.textContent = `${newProduct.title} - ${newProduct.price} - ${newProduct.description}`;
  productList.appendChild(newItem);
});

//Evento para escuchar cuando el usario envía el formulario y así crear luego el nuevo producto.
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

//Evento para escuchar cuando el usario envía un formulario con el ID del producto a eliminar.
document.getElementById('deleteProductForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const productId = formData.get('productId');
  socketClient.emit('deleteProduct', productId); 
  form.reset();
});

//Evento que permite al cliente identificar y recibir el ID del producto que ha sido eliminado x form, para quitarlo de la lista.
socketClient.on('productDeleted', (productId) => {
  const productList = document.getElementById('productList');
  const productItem = productList.querySelector(`li[data-product-id="${productId}"]`);
  if (productItem) {
    productList.removeChild(productItem);
  }
});
