const mongoose = require('mongoose');

// MongoDB connection URL
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/traffic_management';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      // The following options are no longer needed in mongoose 6.x
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false
    });
    console.log('MongoDB connected successfully');
    return true;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
