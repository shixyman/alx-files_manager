// tests/api.test.js
const request = require('supertest');
const app = require('../app');
const redisClient = require('../utils/redisClient');
const dbClient = require('../utils/dbClient');

describe('API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /status', async () => {
    jest.spyOn(redisClient, 'get').mockResolvedValue('1');
    jest.spyOn(dbClient, 'count').mockResolvedValue(10);

    const response = await request(app).get('/status');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ redis: '1', db: 10 });
    expect(redisClient.get).toHaveBeenCalledWith('clients_connected');
    expect(dbClient.count).toHaveBeenCalledWith('users');
  });

  test('GET /stats', async () => {
    jest.spyOn(redisClient, 'get').mockResolvedValue('1');
    jest.spyOn(dbClient, 'count').mockResolvedValue(10);
    jest.spyOn(dbClient, 'count').mockResolvedValueOnce(5);

    const response = await request(app).get('/stats');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ users: 10, files: 5 });
    expect(redisClient.get).toHaveBeenCalledWith('clients_connected');
    expect(dbClient.count).toHaveBeenCalledWith('users');
    expect(dbClient.count).toHaveBeenCalledWith('files');
  });

  // Add more tests for other endpoints...
});