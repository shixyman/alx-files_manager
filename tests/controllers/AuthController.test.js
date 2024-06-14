const dbClient = require('../utils/dbClient');

describe('dbClient', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('create and find a document', async () => {
    jest.spyOn(dbClient, 'create').mockResolvedValue({ _id: '123', name: 'test' });
    jest.spyOn(dbClient, 'findOne').mockResolvedValue({ _id: '123', name: 'test' });

    const doc = await dbClient.create('users', { name: 'test' });
    expect(doc).toEqual({ _id: '123', name: 'test' });
    expect(dbClient.create).toHaveBeenCalledWith('users', { name: 'test' });

    const foundDoc = await dbClient.findOne('users', { _id: '123' });
    expect(foundDoc).toEqual({ _id: '123', name: 'test' });
    expect(dbClient.findOne).toHaveBeenCalledWith('users', { _id: '123' });
  });

  test('handle errors', async () => {
    jest.spyOn(dbClient, 'create').mockRejectedValue(new Error('DB error'));
    jest.spyOn(dbClient, 'findOne').mockRejectedValue(new Error('DB error'));

    await expect(dbClient.create('users', { name: 'test' })).rejects.toThrow('DB error');
    await expect(dbClient.findOne('users', { _id: '123' })).rejects.toThrow('DB error');
  });
});