import Ticket from '../DATA/mongoDB/models/ticket.model.js';

async function generateUniqueCode() {
  let uniqueCode;
  let isUnique = false;

  while (!isUnique) {
    // Genera un código único 
    uniqueCode = generateRandomCode(); 
    // Verificamos si el code es único en la bbdd
    const existingTicket = await Ticket.findOne({ code: uniqueCode });
    if (!existingTicket) {
      isUnique = true; 
    }
  }
  return uniqueCode;
}

function generateRandomCode() {
  return 'CODE-' + Math.random().toString(36);
}

export { generateUniqueCode };
