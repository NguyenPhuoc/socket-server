# Socket.IO Server with MySQL

A Socket.IO server implementation with MySQL database for user management and real-time messaging.

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm (Node Package Manager)

## First Time Setup

1. Clone the repository
```bash
git clone https://github.com/NguyenPhuoc/socket-server.git
cd socket-server
```

2. Install dependencies
```bash
npm install
```

3. Database setup
- Create a new MySQL database:
```sql
CREATE DATABASE socket-server;
```

- Create the user table:
```sql
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    wallet VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

4. Configure database connection
- Update database configuration in `config/database.js`:
```javascript
const sequelize = new Sequelize('socket-server', 'root', '', {
  host: '127.0.0.1',
  dialect: 'mysql'
});
```

5. Start the server
```bash
npm start
```

The server will run on `http://localhost:3000` by default.

## Subsequent Runs

1. Start MySQL server (if not running)

2. Start the application
```bash
npm start
```

## Available Socket Events

### 1. Login
```javascript
// Send
socket.emit('login', {
    username: 'your_username'
});

// Receive
socket.on('login', (response) => {
    // Handle response
});
```

### 2. Signup
```javascript
// Send
socket.emit('signup', {
    username: 'new_username',
    wallet: 'wallet_address'
});

// Receive
socket.on('signup', (response) => {
    // Handle response
});
```

### 3. Update Wallet
```javascript
// Send
socket.emit('update_wallet', {
    wallet: 'new_wallet_address'
});

// Receive
socket.on('update_wallet', (response) => {
    // Handle response
});
```

## Response Format

All responses follow this format:
```javascript
{
    status: 'success' | 'error',
    message: 'Response message',
    user?: {
        id: number,
        username: string,
        wallet: string,
        created_at: string,
        updated_at: string
    }
}
```

## Error Handling

The server will return error responses with:
- status: 'error'
- message: Description of the error

Common errors:
- Authentication required
- Username is required
- Username already exists
- User not found
- Wallet address is required
- Server error occurred

## Development

To run the server in development mode with auto-reload:
```bash
npm install nodemon -g
nodemon server.js
```

## Project Structure 