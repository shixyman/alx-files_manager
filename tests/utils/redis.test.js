const redisClient = require('../redisClient');

describe('redisClient', () => {
  afterAll(() => {
    redisClient.quit();
  });

  test('should connect to Redis', async () => {
    await redisClient.connect();
    expect(redisClient.isOpen).toBe(true);
  });

  test('should set and get a key-value pair', async () => {
    await redisClient.set('key', 'value');
    const value = await redisClient.get('key');
    expect(value).toBe('value');
  });
});
