const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');


dotenv.config(); // Load .env file

const app = express();

//APPLY CORS
app.use(cors({
  origin: 'http://localhost:5173', // allow frontend origin
  credentials: true               // allow cookies if needed
}));

// Middleware
app.use(express.json());

// Routes (Authorization, Posts, ...)
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes); 
app.use('/api/users', userRoutes);

// Body parser
app.use(express.json());

//Uploader
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB and start server
const PORT = 8000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('MongoDB connection error:', err.message);
});