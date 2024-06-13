const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || '27017';
    this.database = process.env.DB_DATABASE || 'files_manager';
    this.client = new MongoClient(`mongodb://${this.host}:${this.port}`);
  }

  async isAlive() {
    try {
      await this.client.connect();
      await this.client.db(this.database).command({ ping: 1 });
      return true;
    } catch (error) {
      console.error('Error checking MongoDB connection:', error);
      return false;
    } finally {
      await this.client.close();
    }
  }

  async nbUsers() {
    try {
      await this.client.connect();
      const db = this.client.db(this.database);
      const users = await db.collection('users').countDocuments();
      return users;
    } catch (error) {
      console.error('Error getting number of users:', error);
      return 0;
    } finally {
      await this.client.close();
    }
  }

  async nbFiles() {
    try {
      await this.client.connect();
      const db = this.client.db(this.database);
      const files = await db.collection('files').countDocuments();
      return files;
    } catch (error) {
      console.error('Error getting number of files:', error);
      return 0;
    } finally {
      await this.client.close();
    }
  }
}

const dbClient = new DBClient();
module.exports = dbClient;