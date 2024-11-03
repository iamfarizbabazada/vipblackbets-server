const createTicket = async (req, res) => {
    try {
      const { subject, message } = req.body;
      const userId = req.user._id;
  
      const ticket = new Ticket({
        userId,
        subject,
        messages: [{
          sender: userId,
          content: message
        }]
      });
  
      await ticket.save();
      res.status(201).json({
        success: true,
        data: ticket
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };
  
  const getTickets = async (req, res) => {
    try {
      const tickets = await Ticket.find()
        .populate('userId', 'username email')
        .populate('messages.sender', 'username')
        .sort('-createdAt');
      
      res.status(200).json({
        success: true,
        data: tickets
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };
  
  const updateTicketStatus = async (req, res) => {
    try {
      const { ticketId } = req.params;
      const { status } = req.body;
  
      const ticket = await Ticket.findOneAndUpdate(
        { ticketId },
        { status },
        { new: true }
      );
  
      res.status(200).json({
        success: true,
        data: ticket
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };
  