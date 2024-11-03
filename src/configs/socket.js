const socketIO = require('socket.io');
const Ticket = require('../models/ticket');

const setupWebSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "*", // Güvenlik için production'da değiştirilmeli
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('join-ticket', (ticketId) => {
      socket.join(ticketId);
      console.log(`Client joined ticket: ${ticketId}`);
    });

    socket.on('send-message', async (data) => {
      const { ticketId, message, sender } = data;
      try {
        const ticket = await Ticket.findOne({ ticketId });
        if (ticket) {
          ticket.messages.push({ 
            sender, 
            message,
            timestamp: new Date()
          });
          await ticket.save();
          io.to(ticketId).emit('new-message', {
            sender,
            message,
            timestamp: new Date()
          });
        }
      } catch (error) {
        console.error('Message error:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};

module.exports = setupWebSocket;