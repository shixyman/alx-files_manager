const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

class AppController {
  static async getStatus(req, res) {
    try {
      const isRedisAlive = await redisClient.isAlive();
      const isDBAlive = await dbClient.isAlive();
      res.status(200).json({ redis: isRedisAlive, db: isDBAlive });
    } catch (error) {
      console.error('Error getting status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getStats(req, res) {
    try {
      const numUsers = await dbClient.nbUsers();
      const numFiles = await dbClient.nbFiles();
      res.status(200).json({ users: numUsers, files: numFiles });
    } catch (error) {
      console.error('Error getting stats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = AppController;