const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const chokidar = require('chokidar');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const connectDB = require('./config/db'); // Import the DB connection function
const { SpeedData, LicensePlateData, HelmetData, VehicleImage, LicensePlateImage } = require('./models'); // Import MongoDB models

const app = express();
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine destination based on file type
    let destination = '';
    if (file.fieldname === 'vehicle') {
      destination = 'vehicle_data_with_helmet/all_vehicle_detected_img';
    } else if (file.fieldname === 'license') {
      destination = 'vehicle_data_with_helmet/all_license_plate_img';
    }
    cb(null, destination);
  },
  filename: function (req, file, cb) {
    const fileId = Date.now();
    if (file.fieldname === 'vehicle') {
      cb(null, `car_${fileId}.jpg`);
    } else if (file.fieldname === 'license') {
      cb(null, `license_plate_${fileId}.jpg`);
    }
  }
});

const upload = multer({ storage: storage });

// Data paths
const speedDataPath = path.join(__dirname, 'vehicle_data_with_helmet/speed_data.json');
const licenseDataPath = path.join(__dirname, 'vehicle_data_with_helmet/new_license_data.json');
const helmetDataPath = path.join(__dirname, 'vehicle_data_with_helmet/helmet_data.json');
const vehicleImagesPath = path.join(__dirname, 'vehicle_data_with_helmet/all_vehicle_detected_img');
const licensePlateImagesPath = path.join(__dirname, 'vehicle_data_with_helmet/all_license_plate_img');

// Mock license plate to email mapping
const licenseToEmail = {
  'KA01AB1234': 'test@gmail.com',
  'MH12XY9876': 'user2@example.com',
  // Add more as needed
};

// Challan email sender
async function sendChallanEmail({ licensePlate, violationType, time, place, imagePath }) {
  const email = licenseToEmail[licensePlate];
  if (!email) throw new Error('No email found for license plate');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'test@gmail.com', // replace with your email
      pass: 'xyzabcdegscop'     // replace with your app password
    }
  });

  const mailOptions = {
    from: 'test@gmail.com',
    to: email,
    subject: `Traffic Violation Challan - ${violationType}`,
    html: `
      <p>Dear vehicle owner,</p>
      <p>Your vehicle <b>${licensePlate}</b> was detected <b>${violationType}</b> at <b>${place}</b> on <b>${time}</b>.</p>
      <p>Please find the attached image as proof.</p>
      <p>To pay your fine, visit: <a href="https://mahatrafficechallan.gov.in/payechallan/PaymentService.htm?_qc=bffc5dacbaa5907a7937aa6721a902bc">Pay Challan</a></p>
      <p>Thank you.</p>
    `,
    attachments: [
      {
        filename: 'violation.jpg',
        path: imagePath
      }
    ]
  };

  await transporter.sendMail(mailOptions);
}

// Helper function to read JSON safely
const readJsonFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.trim() === '') {
        return {};
      }
      return JSON.parse(content);
    }
    return {};
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return {};
  }
};

// Helper function to write JSON safely
const writeJsonFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error);
    return false;
  }
};

// API routes
app.get('/api/data', async (req, res) => {
  try {
    // Get data from MongoDB - checking both Mongoose models and direct MongoDB collections
    let speedDataDocs, licensePlateDocs, helmetDataDocs;
    
    try {
      // Get data directly from MongoDB collections using the collection names we know exist
      const db = mongoose.connection.db;
      speedDataDocs = await db.collection('speed_data').find({}).sort({ timestamp: -1 }).toArray();
      licensePlateDocs = await db.collection('license_plate_data').find({}).sort({ timestamp: -1 }).toArray();
      helmetDataDocs = await db.collection('helmet_data').find({}).sort({ timestamp: -1 }).toArray();
      
      console.log(`Using direct MongoDB collections: speed_data (${speedDataDocs.length}), license_plate_data (${licensePlateDocs.length}), helmet_data (${helmetDataDocs.length})`);
      
      // If any collection is empty, try using Mongoose models as fallback
      if (speedDataDocs.length === 0) {
        speedDataDocs = await SpeedData.find({}).sort({ timestamp: -1 }).lean();
        console.log(`Used Mongoose model for speed data: ${speedDataDocs.length} records`);
      }
      
      if (licensePlateDocs.length === 0) {
        licensePlateDocs = await LicensePlateData.find({}).sort({ timestamp: -1 }).lean();
        console.log(`Used Mongoose model for license plate data: ${licensePlateDocs.length} records`);
      }
      
      if (helmetDataDocs.length === 0) {
        helmetDataDocs = await HelmetData.find({}).sort({ timestamp: -1 }).lean();
        console.log(`Used Mongoose model for helmet data: ${helmetDataDocs.length} records`);
      }
    } catch (err) {
      console.error('Error querying MongoDB:', err);
      speedDataDocs = [];
      licensePlateDocs = [];
      helmetDataDocs = [];
    }
    
    console.log(`Data loaded from MongoDB - Speed data: ${speedDataDocs.length} entries, License data: ${licensePlateDocs.length} entries, Helmet data: ${helmetDataDocs.length} entries`);
    
    // Transform MongoDB documents into the format expected by the frontend
    const speedData = {};
    speedDataDocs.forEach(doc => {
      speedData[doc.vehicleId] = doc.speed;
    });
    
    const licenseData = {};
    licensePlateDocs.forEach(doc => {
      licenseData[doc.plateId] = doc.plateNumber;
    });
    
    const helmetData = {};
    helmetDataDocs.forEach(doc => {
      helmetData[doc.vehicleId] = doc.isWearingHelmet;
    });
    
    // Get image data
    // For now, still reading from the filesystem, but we could store image metadata in MongoDB
    let vehicleImages = [];
    let licensePlateImages = [];
    
    try {
      vehicleImages = fs.readdirSync(vehicleImagesPath)
        .filter(file => file.startsWith('car_') && file.endsWith('.jpg'))
        .map(file => `/api/images/vehicles/${file}`)
        .sort((a, b) => {
          // Sort by timestamp part of the filename (most recent first)
          const tsA = parseInt(a.split('_').pop().split('.')[0]) || 0;
          const tsB = parseInt(b.split('_').pop().split('.')[0]) || 0;
          return tsB - tsA;
        });
      
      licensePlateImages = fs.readdirSync(licensePlateImagesPath)
        .filter(file => file.startsWith('license_plate_') && file.endsWith('.jpg'))
        .map(file => `/api/images/licenses/${file}`)
        .sort((a, b) => {
          // Sort by timestamp part of the filename (most recent first)
          const tsA = parseInt(a.split('_').pop().split('.')[0]) || 0;
          const tsB = parseInt(b.split('_').pop().split('.')[0]) || 0;
          return tsB - tsA;
        });
      
      console.log(`Images found - Vehicle images: ${vehicleImages.length}, License plate images: ${licensePlateImages.length}`);
    } catch (error) {
      console.error('Error reading image directories:', error);
    }

    // Send response
    res.json({
      speedData,
      licenseData,
      helmetData,
      vehicleImages,
      licensePlateImages
    });
  } catch (error) {
    console.error('Error fetching data from MongoDB:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// Data formatting and processing is now done on the client side
// No demo data generation - using only actual data from JSON files

// Serve images
app.use('/api/images/vehicles', express.static(vehicleImagesPath));
app.use('/api/images/licenses', express.static(licensePlateImagesPath));

// Upload endpoints
app.post('/api/upload/data', (req, res) => {
  const { type, data } = req.body;
  
  let model;
  
  if (type === 'speed') {
    model = SpeedData;
  } else if (type === 'license') {
    model = LicensePlateData;
  } else if (type === 'helmet') {
    model = HelmetData;
  } else {
    return res.status(400).json({ error: 'Invalid data type' });
  }
  
  // Merge new data with existing data
  model.insertMany(data)
    .then(() => res.json({ success: true }))
    .catch(error => {
      console.error('Error saving data to MongoDB:', error);
      res.status(500).json({ error: 'Failed to save data' });
    });
});

// Upload images
app.post('/api/upload/images', upload.fields([
  { name: 'vehicle', maxCount: 5 },
  { name: 'license', maxCount: 5 }
]), async (req, res) => {
  try {
    // Create records for uploaded vehicle images
    const vehicleImagePromises = req.files.vehicle ? req.files.vehicle.map(file => {
      const vehicleId = file.filename.split('_')[1].split('.')[0];
      return new VehicleImage({
        filename: file.filename,
        vehicleId: vehicleId,
        path: file.path,
        vehicleType: file.filename.startsWith('car_') ? 'car' : 
                    file.filename.startsWith('bike_') ? 'bike' :
                    file.filename.startsWith('bus_') ? 'bus' : 'truck'
      }).save();
    }) : [];

    // Create records for uploaded license plate images
    const licensePlateImagePromises = req.files.license ? req.files.license.map(file => {
      const plateId = file.filename;
      return new LicensePlateImage({
        filename: file.filename,
        plateId: plateId,
        path: file.path
      }).save();
    }) : [];

    // Save all image records to MongoDB
    await Promise.all([...vehicleImagePromises, ...licensePlateImagePromises]);

    const uploadedFiles = {
      vehicles: req.files.vehicle ? req.files.vehicle.map(file => `/api/images/vehicles/${file.filename}`) : [],
      licenses: req.files.license ? req.files.license.map(file => `/api/images/licenses/${file.filename}`) : []
    };
    
    res.json({ success: true, files: uploadedFiles });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
});

// API endpoint to trigger challan email
app.post('/api/challan', async (req, res) => {
  const { licensePlate, violationType, time, place, imagePath } = req.body;
  try {
    await sendChallanEmail({ licensePlate, violationType, time, place, imagePath });
    res.json({ success: true, message: 'Challan email sent.' });
  } catch (error) {
    console.error('Challan email error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Set up file watchers for data changes
const setupWatchers = () => {
  // Watch JSON files
  const jsonWatcher = chokidar.watch([speedDataPath, licenseDataPath, helmetDataPath], {
    persistent: true,
    ignoreInitial: true
  });
  
  jsonWatcher.on('change', (filePath) => {
    let type = 'unknown';
    if (filePath.includes('speed_data')) {
      type = 'speed';
    } else if (filePath.includes('new_license_data')) {
      type = 'license';
    } else if (filePath.includes('helmet_data')) {
      type = 'helmet';
    }
    
    console.log(`${type} data updated at ${new Date().toLocaleTimeString()}`);
  });
  
  // Watch image directories
  const imageWatcher = chokidar.watch([vehicleImagesPath, licensePlateImagesPath], {
    persistent: true,
    ignoreInitial: true
  });
  
  imageWatcher.on('add', (filePath) => {
    let type = 'unknown';
    let fileName = path.basename(filePath);
    
    if (filePath.includes('all_vehicle_detected_img')) {
      type = 'vehicle';
      console.log(`New ${type} image added: ${fileName}`);
    } else if (filePath.includes('all_license_plate_img')) {
      type = 'license';
      console.log(`New ${type} image added: ${fileName}`);
    }
  });
  
  console.log('File watchers set up to monitor data changes');
};

app.get('/keep-alive', (_, res) => res.send('Still alive'));

// Serve the React app for any other routes (for production)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  setupWatchers();
});
