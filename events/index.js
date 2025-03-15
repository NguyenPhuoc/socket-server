const authEvents = require('./authEvents');

module.exports = (socket) => {
  console.log('Client connected:', socket.id);
  
  // Register auth event handlers
  authEvents(socket);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
}; 