// controllers/FilesController.js
const { User, File } = require('../models');

class FilesController {
  static async postUpload(req, res) {
    try {
      // Retrieve the user based on the token
      const user = await User.findOne({ token: req.headers['x-token'] });
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Check required fields
      const { name, type, parentId = 0, isPublic = false, data } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Missing name' });
      }
      if (!type || !['folder', 'file', 'image'].includes(type)) {
        return res.status(400).json({ error: 'Missing type' });
      }
      if (type !== 'folder' && !data) {
        return res.status(400).json({ error: 'Missing data' });
      }

      // Check parent folder
      if (parentId) {
        const parentFile = await File.findById(parentId);
        if (!parentFile) {
          return res.status(400).json({ error: 'Parent not found' });
        }
        if (parentFile.type !== 'folder') {
          return res.status(400).json({ error: 'Parent is not a folder' });
        }
      }

      // Create the file
      let filePath;
      if (type === 'folder') {
        const file = await File.create({
          userId: user.id,
          name,
          type,
          isPublic,
          parentId,
        });
        return res.status(201).json(file);
      } else {
        // Save the file locally
        const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
        filePath = `${folderPath}/${require('uuid').v4()}`;
        await require('fs').promises.writeFile(filePath, Buffer.from(data, 'base64'));

        const file = await File.create({
          userId: user.id,
          name,
          type,
          isPublic,
          parentId,
          localPath: filePath,
        });
        return res.status(201).json(file);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = FilesController;