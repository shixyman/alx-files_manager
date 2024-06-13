const User = require('../models/User');
const File = require('../models/File');

class FilesController {
  static async getShow(req, res) {
    try {
      // Retrieve the user based on the token
      const user = await User.findOne({ token: req.headers['x-token'] });
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Retrieve the file document based on the ID
      const file = await File.findOne({ _id: req.params.id, userId: user.id });
      if (!file) {
        return res.status(404).json({ error: 'Not found' });
      }

      return res.json(file);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getIndex(req, res) {
    try {
      // Retrieve the user based on the token
      const user = await User.findOne({ token: req.headers['x-token'] });
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Retrieve the file documents based on the parentId and pagination
      const page = req.query.page ? parseInt(req.query.page) : 0;
      const parentId = req.query.parentId ? req.query.parentId : '0';
      const files = await File.aggregate([
        { $match: { userId: user.id, parentId } },
        { $skip: page * 20 },
        { $limit: 20 },
      ]);

      return res.json(files);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = FilesController;