const userService = require('../services/userService');

class SocketController {
  async handleLogin(socket, data) {
    try {
      if (!data?.username) {
        return this.emitError(socket, 'login', 'Username is required');
      }

      const user = await userService.findByUsername(data.username);
      if (user) {
        socket.user = this.formatUser(user);
        this.emitSuccess(socket, 'login', 'Login successful', socket.user);
      } else {
        this.emitError(socket, 'login', 'User not found');
      }
    } catch (error) {
      console.error('Login error:', error);
      this.emitError(socket, 'login', 'Server error occurred');
    }
  }

  async handleSignup(socket, data) {
    try {
      if (!data?.username) {
        return this.emitError(socket, 'signup', 'Username is required');
      }

      const existingUser = await userService.findByUsername(data.username);
      if (existingUser) {
        return this.emitError(socket, 'signup', 'Username already exists');
      }

      const newUser = await userService.create(data);
      socket.user = this.formatUser(newUser);
      this.emitSuccess(socket, 'signup', 'Registration successful', socket.user);
    } catch (error) {
      console.error('Signup error:', error);
      this.emitError(socket, 'signup', 'Server error occurred');
    }
  }

  async handleUpdateWallet(socket, data) {
    try {
      if (!socket.user) {
        return this.emitError(socket, 'update_wallet', 'Authentication required');
      }

      if (!data?.wallet) {
        return this.emitError(socket, 'update_wallet', 'Wallet address is required');
      }

      const updatedUser = await userService.updateWallet(socket.user.id, data.wallet);
      if (updatedUser) {
        socket.user = this.formatUser(updatedUser);
        this.emitSuccess(socket, 'update_wallet', 'Wallet updated successfully', socket.user);
      } else {
        this.emitError(socket, 'update_wallet', 'Failed to update wallet');
      }
    } catch (error) {
      console.error('Update wallet error:', error);
      this.emitError(socket, 'update_wallet', 'Server error occurred');
    }
  }

  formatUser(user) {
    return {
      id: user.id,
      username: user.username,
      wallet: user.wallet,
      created_at: user.created_at,
      updated_at: user.updated_at
    };
  }

  emitSuccess(socket, event, message, data = null) {
    socket.emit(event, {
      status: 'success',
      message,
      ...(data && { user: data })
    });
  }

  emitError(socket, event, message) {
    socket.emit(event, {
      status: 'error',
      message
    });
  }
}

module.exports = new SocketController(); 