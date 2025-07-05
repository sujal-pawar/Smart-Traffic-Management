# Smart Traffic Management System with MongoDB

This repository contains a Smart Traffic Management System that detects vehicles, license plates, and helmet usage, and processes this data in real-time. The system uses computer vision for detection and MongoDB for data storage.

## Status Update

The migration to MongoDB is complete and working successfully. All data is now stored in MongoDB collections and is properly retrieved by the frontend with 5-second polling intervals.

## System Architecture

The system consists of the following components:

1. **Python Detection Scripts**: Process video streams to detect vehicles, license plates, and helmet usage.
2. **MongoDB Database**: Stores all processed data and metadata.
3. **Node.js Backend**: Serves data from MongoDB to the frontend and handles API requests.
4. **React Frontend**: Displays real-time data, statistics, and images.

## Setup and Installation

### Prerequisites

- Node.js and npm
- Python 3.8+ with pip
- MongoDB 5.0+

### Installation

1. Clone the repository:
```
git clone https://github.com/your-username/Smart-Traffic-Management.git
cd Smart-Traffic-Management
```

2. Install MongoDB dependencies for the server:
```
cd server
npm install
cd ..
```

3. Install frontend dependencies:
```
cd client
npm install
cd ..
```

4. Install Python dependencies:
```
pip install pymongo google-cloud-vision watchdog numpy opencv-python filelock dnspython ultralytics
```

5. Create a directory for MongoDB data:
```
mkdir -p mongodb_data
```

### Running the Application

You can use the provided scripts to start the entire system:

#### On Windows:
```
start_system.bat
```

#### On Linux/Mac:
```
chmod +x start_system.sh
./start_system.sh
```

Or you can start components manually:

1. Start MongoDB:
```
mongod --dbpath=./mongodb_data
```

2. Run the data migration script:
```
python migrate_data.py
```

3. Start the backend server:
```
cd server
npm start
```

4. Start the frontend:
```
cd client
npm start
```

## MongoDB Migration

The system has been migrated from JSON file storage to MongoDB. The data is stored in the following collections:

- `speed_data`: Vehicle speed information
- `license_plate_data`: License plate detection information
- `helmet_data`: Helmet usage information
- `vehicle_images`: Metadata for vehicle images
- `license_plate_images`: Metadata for license plate images

## System Features

- Real-time vehicle detection and tracking
- License plate recognition
- Helmet compliance monitoring
- Speed detection
- Analytics dashboard with charts and statistics
- Image gallery for detected vehicles and license plates
- Data polling every 5 seconds for real-time updates

## Troubleshooting

- **MongoDB Connection Issues**: Ensure MongoDB is running and accessible at the default port (27017)
- **Image Processing Errors**: Check that the Python environment has all required dependencies
- **Data Not Showing in Frontend**: Verify that the backend server is running and check console for errors

## Troubleshooting

### MongoDB Collection Names

If you experience issues with data not showing up, it may be due to the collection names. The migration script creates collections with names like `speed_data`, while Mongoose might expect names like `speeddatas`. The server has been updated to check both formats.

### Running the System

1. First, ensure MongoDB is running
2. Run the data migration script if this is your first time:
   ```
   D:/Projects/Smart-Traffic-Management-sujal/.venv/Scripts/python.exe migrate_data.py
   ```
3. Start the backend server:
   ```
   cd server
   npm start
   ```
4. Start the frontend:
   ```
   cd client
   npm start
   ```

### Checking MongoDB Data

You can use the provided `check_mongodb.py` script to verify that data has been properly migrated:
```
D:/Projects/Smart-Traffic-Management-sujal/.venv/Scripts/python.exe check_mongodb.py
```

This will show collections, document counts, and sample data from each collection.

### Python Scripts

The Python detection scripts have been updated to write data directly to MongoDB. The key changes are:

1. Using `mongo_utils.py` for database operations
2. Replacing the JSON file writing with MongoDB saving operations
3. Maintaining backward compatibility by continuing to update the JSON files

### Polling Frequency

The frontend polling frequency has been updated from 10 seconds to 5 seconds as requested, providing more real-time updates.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
