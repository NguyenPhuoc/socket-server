const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const sequelize = require('./config/database');
const socketEvents = require('./events');

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins in development environment
    methods: ["GET", "POST"]
  }
});

// Sync database
sequelize.sync()
  .then(() => {
    console.log('Database synced');
  })
  .catch((error) => {
    console.error('Database sync error:', error);
  });

// Default route
app.get('/', (req, res) => {
  res.send('Socket.IO Server is running');
});

// Handle Socket.IO connections
io.on('connection', socketEvents);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 