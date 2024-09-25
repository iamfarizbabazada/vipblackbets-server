const { Server } = require('socket.io')
const { sessionMiddleware } = require('./middlewares/session')
const passport = require('passport')
const Message = require('./models/message')
const logger = require('./utils/logger')

function onlyForHandshake(middleware) {
  return (req, res, next) => {
    const isHandshake = req._query.sid === undefined;
    if (isHandshake) {
      middleware(req, res, next);
    } else {
      next();
    }
  };
}

function initSocketIO(httpServer) {
  const io = new Server(httpServer)

  io.engine.use(onlyForHandshake(sessionMiddleware))
  io.engine.use(onlyForHandshake(passport.session()))
  io.engine.use(
    onlyForHandshake((req, res, next) => {
      if (req.user) {
        next()
      } else {
        res.writeHead(401)
        res.end()
      }
    }),
  )

  // Chat 
  io.on('connection', async (socket) => {
    logger.info(`${socket.request.user} connected`)
    
   
    socket.on('join room', (receiver) => {
      socket.receiverId = receiver;
      console.log(socket.receiverId)
      const roomId = [socket.request.user.id, receiver].sort().join('-')
      socket.join(roomId)
      socket.roomId = roomId;

      logger.info(`Socket joined room: ${roomId}, user: ${socket.request.user.id}`)

      socket.emit('joined room', 'successfully Joined room')
  })

  socket.on('chat history', async () => {
    await Message.updateMany(
      { 
          receiver: socket.request.user.id, 
          sender: socket.receiverId, 
          read: false // Only update if they are currently unread
      },
      { $set: { read: true } } // Set read status to true
  );


    const messages = await Message.find({
        $or: [
            { sender: socket.request.user, receiver: socket.receiverId },
            { receiver: socket.request.user, sender: socket.receiverId }
        ]
    })
  
  
    socket.emit('messages', messages);
    logger.info(`Socket received messages by user: ${socket.request.user.id}`);
  });

  socket.on('chat message', async (message) => {
    console.log(socket.receiverId, message, socket.request.user)
    if (socket.roomId) {
        const newMessage = new Message({
            sender: socket.request.user,
            receiver: socket.receiverId,
            text: message
        })

        const savedMessage = await newMessage.save()

        io.to(socket.roomId).emit('chat new', savedMessage)
        logger.info(`Socket sent message: ${message}, user: ${socket.request.user.id} received by room: ${socket.roomId}`)
    }
})

socket.on('get messages', async () => {
  const messages = await Message.find({ receiver: socket.request.user }).populate('sender', 'receiver')
  socket.emit('messages', messages)
  logger.info(`Socket received messages by user: ${socket.request.user.id}`)
})

socket.on('leave room', () => {
  socket.leave(socket.roomId)
  logger.info(`Socket left room: ${socket.roomId}, user: ${socket.request.user.id}`)
  socket.roomId = null
})

    socket.on('disconnect', () => {
      socket.emit('leave room')
      logger.info(`${socket.request.user} disconnected`)
    })
  })
}

module.exports = initSocketIO