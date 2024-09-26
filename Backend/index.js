const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const uploadRoute = require('./Routes/uploadPdf.routes');
const categoryRoutes = require('./Routes/category.routes');
const userRoutes = require('./Routes/user.routes');
const authRoutes = require('./Routes/auth.routers');
const path = require('path');
require('dotenv').config();


const app = express(); // You missed this line in your provided code

app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// Use express.json() instead of body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection (consider using an environment variable for the connection string)
mongoose.connect(process.env.MONGODB_URI || 'your_connection_string', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected!'))
.catch(err => console.error('MongoDB connection error:', err));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  console.log('Request body:', req.body); // Add this line to log request bodies
  next();
});

// Routes
app.use('/api', uploadRoute);
app.use('/api', categoryRoutes);
app.use('/api', userRoutes);
app.use('/api', authRoutes);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});