const User = require('../Model/user.model');

class AuthController {
  static async login(req, res) {
    const { username, password, role } = req.body;

    try {
      // Find user in the database matching username, password, and role
      const user = await User.findOne({ username, password, role });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // If user is found, return user data (excluding password)
      res.json({ user: { username: user.username, role: user.role } });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = AuthController;
