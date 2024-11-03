const setupWebSocket = (io) => {
  io.on('connection', (socket) => {
    socket.on('join-ticket', (ticketId) => {
      socket.join(ticketId);
    });

    socket.on('send-message', async (data) => {
      const { ticketId, message, sender } = data;
      try {
        const ticket = await Ticket.findOne({ ticketId });
        ticket.messages.push({ sender, message });
        await ticket.save();
        io.to(ticketId).emit('new-message', { sender, message });
      } catch (error) {
        console.error(error);
      }
    });
  });
};