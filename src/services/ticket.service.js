import { MongoTicketManager } from '../DATA/DAOs/ticketMongo.dao.js';

class TicketService {
  constructor() {
    this.ticketManager = new MongoTicketManager();
  }

  async createTicket(ticketData) {
    try {
      const newTicket = await this.ticketManager.createTicket(ticketData);
      return newTicket;
    } catch (error) {
      throw new Error('Error al generar el ticket');
    }
  }
}

export const ticketService = new TicketService();
