const mongoose = require('mongoose');

// Define mongoose schemas and models for the application
const speedDataSchema = new mongoose.Schema({
  vehicleId: { 
    type: String,
    required: true,
    unique: true
  },
  speed: {
    type: Number,
    required: true
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

const licensePlateSchema = new mongoose.Schema({
  plateId: {
    type: String,
    required: true,
    unique: true
  },
  plateNumber: {
    type: String,
    required: true
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

const helmetDataSchema = new mongoose.Schema({
  vehicleId: {
    type: String,
    required: true,
    unique: true
  },
  isWearingHelmet: {
    type: Boolean,
    required: true
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

const vehicleImageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    unique: true
  },
  vehicleType: {
    type: String,
    enum: ['car', 'bike', 'bus', 'truck'],
    default: 'car'
  },
  vehicleId: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

const licensePlateImageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    unique: true
  },
  plateId: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

const SpeedData = mongoose.model('SpeedData', speedDataSchema);
const LicensePlateData = mongoose.model('LicensePlateData', licensePlateSchema);
const HelmetData = mongoose.model('HelmetData', helmetDataSchema);
const VehicleImage = mongoose.model('VehicleImage', vehicleImageSchema);
const LicensePlateImage = mongoose.model('LicensePlateImage', licensePlateImageSchema);

module.exports = {
  SpeedData,
  LicensePlateData,
  HelmetData,
  VehicleImage,
  LicensePlateImage
};
