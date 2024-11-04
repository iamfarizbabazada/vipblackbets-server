const socketIO = require('socket.io');

const setupWebSocket = (server) => {
    const io = socketIO(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["Authorization", "Content-Type"],
            credentials: true
        },
        path: '/socket.io/',
        serveClient: false,
        pingTimeout: 10000,
        pingInterval: 5000,
        upgradeTimeout: 5000,
        allowUpgrades: true,
        transports: ['websocket', 'polling'],
        allowEIO3: true
    });

    
    // Bağlantı öncesi middleware
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }
        // Token doğrulama işlemlerinizi burada yapın
        next();
    });

    io.on('connection', (socket) => {
        console.log('[Socket] Yeni bağlantı:', socket.id);

        // Bağlantı testi için hemen bir mesaj gönder
        socket.emit('connection-test', { 
            status: 'success', 
            message: 'Server bağlantısı başarılı',
            socketId: socket.id 
        });

        socket.on('error', (error) => {
            console.error('[Socket] Hata:', error);
        });

        socket.on('disconnect', (reason) => {
            console.log('[Socket] Bağlantı kesildi:', {
                socketId: socket.id,
                reason: reason
            });
        });

        // Diğer event handler'larınız...
        app.get('/health', (req, res) => {
          res.json({ status: 'ok', timestamp: new Date().toISOString() });
      });
    });

    // Genel hata yakalama
    io.engine.on("connection_error", (err) => {
        console.log('[Socket Engine] Bağlantı hatası:', {
            code: err.code,
            message: err.message,
            context: err.context
        });
    });

    return io;
};

module.exports = setupWebSocket;