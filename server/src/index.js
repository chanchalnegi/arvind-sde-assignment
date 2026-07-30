const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { initDB } = require('./db');
const authRoutes = require('./routes/auth');
const inspectionRoutes = require('./routes/inspections');
const sapWebhookRoutes = require('./routes/sapWebhook');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/sap-webhook', sapWebhookRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Arvind Quality Inspection Tracker API',
    timestamp: new Date().toISOString()
  });
});

const clientBuildPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientBuildPath));

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(clientBuildPath, 'index.html'), (err) => {
      if (err) {
        res.status(200).send('Arvind Fabric Quality Tracker API is running.');
      }
    });
  }
});

initDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Arvind Quality Inspection Tracker API Running on Port: ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
});
