const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const pool = require('./config/database');
const User = require('./models/User');
const sequelize = require('./config/database');

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
io.on('connection', async (socket) => {
  console.log('Client connected:', socket.id);

  // Handle login
  socket.on('login', async (data) => {
    try {
      console.log('Login attempt:', data);

      if (!data || !data.username) {
        socket.emit('login', {
          status: 'error',
          message: 'Username is required'
        });
        return;
      }

      // Find user using model
      const user = await User.findOne({
        where: { username: data.username }
      });

      if (user) {
        socket.user = {
          id: user.id,
          username: user.username,
          wallet: user.wallet,
          created_at: user.created_at,
          updated_at: user.updated_at
        };

        socket.emit('login', {
          status: 'success',
          message: 'Login successful',
          user: socket.user
        });
      } else {
        socket.emit('login', {
          status: 'error',
          message: 'User not found'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      socket.emit('login', {
        status: 'error',
        message: 'Server error occurred'
      });
    }
  });

  // Handle signup
  socket.on('signup', async (data) => {
    try {
      console.log('Signup attempt:', data);

      if (!data || !data.username) {
        socket.emit('signup', {
          status: 'error',
          message: 'Username is required'
        });
        return;
      }

      // Check for existing username using model
      const existingUser = await User.findOne({
        where: { username: data.username }
      });

      if (existingUser) {
        socket.emit('signup', {
          status: 'error',
          message: 'Username already exists'
        });
        return;
      }

      // Create new user using model
      const newUser = await User.create({
        username: data.username,
        wallet: data.wallet
      });
      
      socket.user = {
        id: newUser.id,
        username: newUser.username,
        wallet: newUser.wallet
      };

      socket.emit('signup', {
        status: 'success',
        message: 'Registration successful',
        user: {
          id: newUser.id,
          username: newUser.username,
          wallet: newUser.wallet
        }
      });
    } catch (error) {
      console.error('Signup error:', error);
      socket.emit('signup', {
        status: 'error',
        message: 'Server error occurred'
      });
    }
  });

  // Handle update wallet
  socket.on('update_wallet', async (data) => {
    try {
      console.log('Update wallet attempt:', data);

      if (!socket.user) {
        socket.emit('update_wallet', {
          status: 'error',
          message: 'Authentication required'
        });
        return;
      }

      if (!data || !data.wallet) {
        socket.emit('update_wallet', {
          status: 'error',
          message: 'Wallet address is required'
        });
        return;
      }

      // Update user using model
      const updatedCount = await User.update(
        { wallet: data.wallet },
        { where: { id: socket.user.id } }
      );

      if (updatedCount > 0) {
        // Fetch updated user data
        const updatedUser = await User.findByPk(socket.user.id);
        
        socket.user = {
          id: updatedUser.id,
          username: updatedUser.username,
          wallet: updatedUser.wallet,
          created_at: updatedUser.created_at,
          updated_at: updatedUser.updated_at
        };

        socket.emit('update_wallet', {
          status: 'success',
          message: 'Wallet updated successfully',
          user: socket.user
        });
      } else {
        socket.emit('update_wallet', {
          status: 'error',
          message: 'Failed to update wallet'
        });
      }
    } catch (error) {
      console.error('Update wallet error:', error);
      socket.emit('update_wallet', {
        status: 'error',
        message: 'Server error occurred'
      });
    }
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 