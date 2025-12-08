const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
const envPath = path.join(__dirname, '..', '.env');
console.log('Loading .env from:', envPath);
const result = dotenv.config({ path: envPath });
console.log('Dotenv result:', result.error ? result.error.message : 'Success');
console.log('DB_PASSWORD loaded:', process.env.DB_PASSWORD ? 'YES' : 'NO');

const app = express();
const PORT = process.env.PORT || 6001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'FlexibleGantt API Server',
    version: '1.0.0',
    status: 'running',
    port: PORT
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Import task routes
const taskRoutes = require('./routes/tasks');
app.use('/api/tasks', taskRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.url} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   FlexibleGantt Server                     ║
║   Status: Running                          ║
║   Port: ${PORT}                              ║
║   Environment: ${process.env.NODE_ENV || 'development'}             ║
║   Time: ${new Date().toLocaleString()}     ║
╚════════════════════════════════════════════╝
  `);
});

module.exports = app;
