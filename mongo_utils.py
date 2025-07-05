import pymongo
import json
import os
from datetime import datetime

# MongoDB connection settings
MONGO_URI = 'mongodb://localhost:27017/'
DB_NAME = 'traffic_management'

def get_mongo_client():
    """Get a MongoDB client instance"""
    try:
        client = pymongo.MongoClient(MONGO_URI)
        # Ping the server to check connection
        client.admin.command('ping')
        print("MongoDB connection established successfully")
        return client
    except Exception as e:
        print(f"MongoDB connection error: {e}")
        return None

def get_database():
    """Get the MongoDB database instance"""
    client = get_mongo_client()
    if client:
        return client[DB_NAME]
    return None

def save_speed_data(vehicle_id, speed):
    """Save speed data to MongoDB"""
    db = get_database()
    if db is None:
        return False
    
    try:
        # Check if record exists
        existing = db.speed_data.find_one({"vehicleId": vehicle_id})
        if existing:
            # Update existing record
            db.speed_data.update_one(
                {"vehicleId": vehicle_id},
                {"$set": {"speed": speed, "timestamp": datetime.now()}}
            )
        else:
            # Create new record
            db.speed_data.insert_one({
                "vehicleId": vehicle_id,
                "speed": speed,
                "timestamp": datetime.now()
            })
        print(f"Speed data saved for vehicle {vehicle_id}")
        return True
    except Exception as e:
        print(f"Error saving speed data: {e}")
        return False

def save_license_plate_data(plate_id, plate_number):
    """Save license plate data to MongoDB"""
    db = get_database()
    if db is None:
        return False
    
    try:
        # Check if record exists
        existing = db.license_plate_data.find_one({"plateId": plate_id})
        if existing:
            # Update existing record
            db.license_plate_data.update_one(
                {"plateId": plate_id},
                {"$set": {"plateNumber": plate_number, "timestamp": datetime.now()}}
            )
        else:
            # Create new record
            db.license_plate_data.insert_one({
                "plateId": plate_id,
                "plateNumber": plate_number,
                "timestamp": datetime.now()
            })
        print(f"License plate data saved for {plate_id}")
        return True
    except Exception as e:
        print(f"Error saving license plate data: {e}")
        return False

def save_helmet_data(vehicle_id, is_wearing_helmet):
    """Save helmet data to MongoDB"""
    db = get_database()
    if db is None:
        return False
    
    try:
        # Check if record exists
        existing = db.helmet_data.find_one({"vehicleId": vehicle_id})
        if existing:
            # Update existing record
            db.helmet_data.update_one(
                {"vehicleId": vehicle_id},
                {"$set": {"isWearingHelmet": is_wearing_helmet, "timestamp": datetime.now()}}
            )
        else:
            # Create new record
            db.helmet_data.insert_one({
                "vehicleId": vehicle_id,
                "isWearingHelmet": is_wearing_helmet,
                "timestamp": datetime.now()
            })
        print(f"Helmet data saved for vehicle {vehicle_id}")
        return True
    except Exception as e:
        print(f"Error saving helmet data: {e}")
        return False

def migrate_json_to_mongodb():
    """Migrate existing JSON data to MongoDB"""
    db = get_database()
    if db is None:
        return False
    
    # Paths to JSON files
    speed_data_path = os.path.join("local_data", "speed_data.json")
    license_data_path = os.path.join("local_data", "new_license_data.json")
    helmet_data_path = os.path.join("local_data", "helmet_data.json")
    
    # Migrate speed data
    if os.path.exists(speed_data_path):
        try:
            with open(speed_data_path, 'r') as file:
                speed_data = json.load(file)
                for vehicle_id, speed in speed_data.items():
                    save_speed_data(vehicle_id, speed)
            print("Speed data migrated successfully")
        except Exception as e:
            print(f"Error migrating speed data: {e}")
    
    # Migrate license plate data
    if os.path.exists(license_data_path):
        try:
            with open(license_data_path, 'r') as file:
                license_data = json.load(file)
                for plate_id, plate_number in license_data.items():
                    save_license_plate_data(plate_id, plate_number)
            print("License plate data migrated successfully")
        except Exception as e:
            print(f"Error migrating license plate data: {e}")
    
    # Migrate helmet data
    if os.path.exists(helmet_data_path):
        try:
            with open(helmet_data_path, 'r') as file:
                helmet_data = json.load(file)
                for vehicle_id, is_wearing_helmet in helmet_data.items():
                    save_helmet_data(vehicle_id, is_wearing_helmet)
            print("Helmet data migrated successfully")
        except Exception as e:
            print(f"Error migrating helmet data: {e}")
    
    return True

if __name__ == "__main__":
    # Run the migration when this script is executed directly
    migrate_json_to_mongodb()
