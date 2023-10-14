import Ticket from '../mongoDB/models/ticket.model.js';

class MongoTicketManager {
  async createTicket(ticketData) {
    const newTicket = new Ticket(ticketData);
    await newTicket.save();
    return newTicket;
  }
}

export { MongoTicketManager };
