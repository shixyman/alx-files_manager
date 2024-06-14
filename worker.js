// Update POST /files endpoint
app.post('/files', async (req, res) => {
    // Process the uploaded file
    const file = req.file;
    const { userId } = req.body;
  
    // Store the file locally and in the database
    const fileId = await storeFile(file, userId);
  
    // Add a job to the fileQueue to generate thumbnails
    await fileQueue.add({ fileId, userId });
  
    res.status(201).json({ id: fileId, userId, name: file.filename, type: file.mimetype, isPublic: true, parentId: null });
  });
  
  // File worker
  const fileQueue = new Bull('fileQueue');
  
  fileQueue.process(async (job) => {
    const { fileId, userId } = job.data;
  
    // Check if fileId and userId are present
    if (!fileId) {
      throw new Error('Missing fileId');
    }
    if (!userId) {
      throw new Error('Missing userId');
    }
  
    // Check if the file exists in the database
    const file = await File.findOne({ _id: fileId, userId });
    if (!file) {
      throw new Error('File not found');
    }
  
    // Generate thumbnails
    const thumbnailSizes = [500, 250, 100];
    for (const size of thumbnailSizes) {
      const thumbnail = await generateThumbnail(file.path, size);
      await saveThumbnail(file.path, size, thumbnail);
    }
  });
  
  // Update GET /files/:id/data endpoint
  app.get('/files/:id/data', async (req, res) => {
    const { id } = req.params;
    const { size } = req.query;
  
    // Check if the requested size is valid
    if (![500, 250, 100].includes(parseInt(size))) {
      return res.status(400).json({ error: 'Invalid size' });
    }
  
    // Construct the file path based on the requested size
    const filePath = path.join(process.env.FILES_DIR, `${id}_${size}.png`);
  
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Not found' });
    }
  
    // Send the file
    res.sendFile(filePath);
  });
  
  // Helper functions
  async function storeFile(file, userId) {
    // Store the file locally and in the database
    const fileId = await saveFile(file, userId);
    return fileId;
  }
  
  async function generateThumbnail(filePath, size) {
    // Use the image-thumbnail module to generate the thumbnail
    const thumbnail = await imageThumbnail(filePath, { width: size });
    return thumbnail;
  }
  
  async function saveThumbnail(filePath, size, thumbnail) {
    // Save the thumbnail to the same location as the original file
    const thumbnailPath = path.join(path.dirname(filePath), `${path.basename(filePath, path.extname(filePath))}_${size}.png`);
    await fs.writeFile(thumbnailPath, thumbnail);
  }