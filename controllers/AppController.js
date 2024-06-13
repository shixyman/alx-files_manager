const { MongoClient, ObjectId } = require('mongodb');

class DBClient {
  constructor() {
    this.client = new MongoClient(process.env.DB_HOST || 'mongodb://localhost:27017');
    this.db = null;
  }

  async connect() {
    if (this.db) return this.db;
    await this.client.connect();
    this.db = this.client.db('files_manager');
    return this.db;
  }

  async isAlive() {
    try {
      const db = await this.connect();
      await db.command({ ping: 1 });
      return true;
    } catch (error) {
      console.error('Error checking DB connection:', error);
      return false;
    }
  }

  async nbUsers() {
    const db = await this.connect();
    const usersCollection = db.collection('users');
    return await usersCollection.countDocuments();
  }

  async nbFiles() {
    const db = await this.connect();
    const filesCollection = db.collection('files');
    return await filesCollection.countDocuments();
  }

  async getUserByEmail(email) {
    const db = await this.connect();
    const usersCollection = db.collection('users');
    return await usersCollection.findOne({ email });
  }

  async createUser(email, hashedPassword) {
    const db = await this.connect();
    const usersCollection = db.collection('users');
    const result = await usersCollection.insertOne({ email, password: hashedPassword });
    return await usersCollection.findOne({ _id: result.insertedId });
  }
}

const dbClient = new DBClient();
module.exports = dbClient;