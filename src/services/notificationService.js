const createNotification = async (userId, ticketId, type, message) => {
    try {
      const notification = new Notification({
        userId,
        ticketId,
        type,
        message
      });
      await notification.save();
      
      // Websocket ile anlık bildirim gönderme
      const socket = getSocketByUserId(userId);
      if (socket) {
        socket.emit('notification', notification);
      }
    } catch (error) {
      console.error('Notification error:', error);
    }
  };