"""
This is a modified version of the R1.py script that uses MongoDB for data storage.
To use this script:
1. Make sure MongoDB is installed and running
2. Import this at the top of your R1.py file:
   from mongo_utils import save_speed_data, save_helmet_data
3. Replace your speed and helmet data saving functions with calls to these MongoDB functions
"""

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
    if client is not None:
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
        
        # Also update the legacy JSON file for backwards compatibility
        update_speed_json(vehicle_id, speed)
        
        print(f"Speed data saved for vehicle {vehicle_id}")
        return True
    except Exception as e:
        print(f"Error saving speed data: {e}")
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
        
        # Also update the legacy JSON file for backwards compatibility
        update_helmet_json(vehicle_id, is_wearing_helmet)
        
        print(f"Helmet data saved for vehicle {vehicle_id}")
        return True
    except Exception as e:
        print(f"Error saving helmet data: {e}")
        return False

def update_speed_json(vehicle_id, speed):
    """Update the legacy JSON file for backwards compatibility"""
    json_path = "local_data/speed_data.json"
    try:
        # Load existing data
        try:
            with open(json_path, "r") as file:
                data = json.load(file)
        except (FileNotFoundError, json.JSONDecodeError):
            data = {}
        
        # Update data
        data[str(vehicle_id)] = speed
        
        # Save updated data
        with open(json_path, "w") as file:
            json.dump(data, file, indent=4)
        
        return True
    except Exception as e:
        print(f"Error updating speed JSON: {e}")
        return False

def update_helmet_json(vehicle_id, is_wearing_helmet):
    """Update the legacy JSON file for backwards compatibility"""
    json_path = "local_data/helmet_data.json"
    try:
        # Load existing data
        try:
            with open(json_path, "r") as file:
                data = json.load(file)
        except (FileNotFoundError, json.JSONDecodeError):
            data = {}
        
        # Update data
        data[str(vehicle_id)] = is_wearing_helmet
        
        # Save updated data
        with open(json_path, "w") as file:
            json.dump(data, file, indent=4)
        
        return True
    except Exception as e:
        print(f"Error updating helmet JSON: {e}")
        return False

# Example usage in R1.py:
# Instead of:
# speed_dict[str(track_id)] = speed_value
# save_dict2(speed_dict)
#
# Use:
# save_speed_data(str(track_id), speed_value)
#
# And instead of:
# helmet_dict[str(track_id)] = helmet_detected
# save_dict(helmet_dict)
#
# Use:
# save_helmet_data(str(track_id), helmet_detected)
