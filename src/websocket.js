const setupWebSocket = (io) => {
  io.on('connection', (socket) => {
    const userId = socket.handshake.auth.userId;
    
    // Kullanıcı socket eşleştirmesi
    if (userId) {
      socket.userId = userId;
      userSockets.set(userId, socket);
    }

    // Yeni mesaj bildirimi
    socket.on('new_message', async (data) => {
      const { ticketId, message } = data;
      const ticket = await Ticket.findById(ticketId);
      
      if (ticket) {
        // Karşı tarafa bildirim gönder
        const recipientId = ticket.userId.toString() === userId 
          ? ticket.adminId 
          : ticket.userId;
          
        const recipientSocket = userSockets.get(recipientId);
        if (recipientSocket) {
          recipientSocket.emit('message_notification', {
            ticketId,
            message: 'Yeni mesajınız var',
          });
        }
      }
    });

    // Bağlantı kapandığında
    socket.on('disconnect', () => {
      if (socket.userId) {
        userSockets.delete(socket.userId);
      }
    });
  });
};