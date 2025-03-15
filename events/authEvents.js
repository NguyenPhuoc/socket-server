const socketController = require('../controllers/socketController');

module.exports = (socket) => {
  socket.on('login', (data) => socketController.handleLogin(socket, data));
  socket.on('signup', (data) => socketController.handleSignup(socket, data));
  socket.on('update_wallet', (data) => socketController.handleUpdateWallet(socket, data));
}; 