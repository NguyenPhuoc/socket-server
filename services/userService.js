const User = require('../models/User');

class UserService {
  async findByUsername(username) {
    return await User.findOne({ where: { username } });
  }

  async create(userData) {
    return await User.create(userData);
  }

  async updateWallet(userId, wallet) {
    const [updatedCount] = await User.update(
      { wallet },
      { where: { id: userId } }
    );
    
    if (updatedCount > 0) {
      return await User.findByPk(userId);
    }
    return null;
  }
}

module.exports = new UserService(); 