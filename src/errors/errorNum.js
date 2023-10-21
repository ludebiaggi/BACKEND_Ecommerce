export const ErrorMessages = {
    PRODUCT_NOT_FOUND: "No encontramos el producto que intentas buscar", //PROBADO OK
    //MISSING_REQUIRED_FIELDS: "Falta completar campos obligatorios", //FALTA APLICAR EN EL ADDPRODUCT
    ADD_PRODUCT_ERROR: "Error al crear el producto", //PROBADO OK
    GET_PRODUCTS_ERROR: "Error al obtener el listado de productos", //PROBADO OK
    QUANTITY_NOT_VALID: "Cantidad no válida", //PROBADO OK
    CART_NOT_FOUND: "Carrito no encontrado", //PROBADO OK SI BUSCO UN ID NO VÁLIDO DESDELA RUTA API/CART/CID, PERO DENTRO DE LA RUTA PARA AGREGAR UN PRODUCTO AL CARRITO /API/CARTS/CID/PRODUCT/PID, ME APARECE UN LOG ENORME DE MONGO > CONSULTAR A MANU A QUE SE DEBE
    REMOVE_FROM_CART_ERROR: "Error al eliminar el producto del carrito", //PROBADO OK
    CLEAR_CART_ERROR: "Error al vaciar el carrito", //PROBADO OK
};
  
