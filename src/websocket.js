const fs = require('fs')
const path = require('path')

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
    }).sort({createdAt: 'desc'})
  
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

        try {
          const savedMessage = await newMessage.save()
          io.to(socket.roomId).emit('chat new', savedMessage)
          logger.info(`Socket sent message: ${message}, user: ${socket.request.user.id} received by room: ${socket.roomId}`)
        } catch(err) {
          logger.error(err)
        }

    }
})

socket.on('upload file', async (fileData) => {
  if (socket.roomId) {
      const base64Data = fileData.split(';base64,').pop();

      // Dosya adını belirleyin ve dosya yolu oluşturun
      const fileName = `image_${Date.now()}.png`;
      const filePath = path.join(__dirname, '../public/uploads', fileName);
      
      // Klasörü oluşturun, eğer yoksa
      fs.existsSync(path.join(__dirname, '../public/uploads')) || fs.mkdirSync(path.join(__dirname, '../public/uploads'), { recursive: true });

      // Dosyayı diske kaydedin
      fs.writeFile(filePath, base64Data, { encoding: 'base64' }, async (err) => {
          if (err) {
              console.error('Dosya kaydedilirken bir hata oluştu:', err);
              return;
          }

          // Dosya başarıyla kaydedildikten sonra
          console.log(fileName + ' public/uploads klasörüne yüklendi');

          // Kullanıcı mesajını oluşturun ve kaydedin
          const newMessage = new Message({
              sender: socket.request.user,
              receiver: socket.receiverId,
              text: 'Fayl göndərildi.',
              file: fileName
          });

          try {
          const savedMessage = await newMessage.save();
          // Mesajı ilgili odaya gönderin
          io.to(socket.roomId).emit('chat new', savedMessage);
          logger.info(`Socket sent message: ${fileName}, user: ${socket.request.user} received by room: ${socket.roomId}`);
          } catch(err) {
            console.error(err)
          }

          // Dosyayı silmek isterseniz, aşağıdaki satırı ekleyebilirsiniz:
          // fs.unlinkSync(filePath);
      });
  }
});


socket.on('get messages', async () => {
  const messages = await Message.find({ receiver: socket.request.user })
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