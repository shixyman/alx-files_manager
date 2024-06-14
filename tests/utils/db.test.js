const dbClient = require('../dbClient');

describe('dbClient', () => {
  afterAll(async () => {
    await dbClient.disconnect();
  });

  test('should connect to the database', async () => {
    await dbClient.connect();
    expect(dbClient.isConnected).toBe(true);
  });

  test('should create a new user', async () => {
    const user = await dbClient.createUser({ email: 'test@example.com', password: 'password' });
    expect(user).toHaveProperty('_id');
    expect(user).toHaveProperty('email', 'test@example.com');
  });
});