const socketClient = io();

//Eventos para Ver detalle y add cart
document.addEventListener('DOMContentLoaded', () => {
  
    document.addEventListener('click', (event) => {
      if (event.target.classList.contains('view-details-button')) {
        const productId = event.target.getAttribute('data-product-id');
        viewDetails(productId);
      }
    });
  
    
    document.addEventListener('click', (event) => {
      if (event.target.classList.contains('add-to-cart-button')) {
        const productId = event.target.getAttribute('data-product-id');
        addToCart(productId);
      }
    });
  });
  