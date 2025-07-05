#!/usr/bin/env python
"""
Data Migration Script: JSON to MongoDB

This script migrates all JSON data from the local_data and server/vehicle_data_with_helmet
directories to MongoDB.
"""

import os
import json
import pymongo
from datetime import datetime
import sys

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

def migrate_speed_data():
    """Migrate speed data from JSON to MongoDB"""
    db = get_database()
    if db is None:
        return False
    
    # Speed data paths (check both possible locations)
    speed_data_paths = [
        os.path.join("local_data", "speed_data.json"),
        os.path.join("server", "vehicle_data_with_helmet", "speed_data.json")
    ]
    
    for speed_data_path in speed_data_paths:
        if os.path.exists(speed_data_path):
            try:
                with open(speed_data_path, 'r') as file:
                    speed_data = json.load(file)
                    
                    print(f"Found {len(speed_data)} speed records in {speed_data_path}")
                    
                    # Drop existing collection to avoid duplicates
                    if 'speed_data' in db.list_collection_names():
                        db.speed_data.drop()
                        print("Dropped existing speed_data collection")
                    
                    # Insert speed data
                    batch = []
                    for vehicle_id, speed in speed_data.items():
                        batch.append({
                            "vehicleId": vehicle_id,
                            "speed": speed,
                            "timestamp": datetime.now()
                        })
                    
                    if batch:
                        db.speed_data.insert_many(batch)
                        print(f"Migrated {len(batch)} speed records to MongoDB")
                    
                return True
            except Exception as e:
                print(f"Error migrating speed data: {e}")
    
    print("No speed data files found")
    return False

def migrate_license_plate_data():
    """Migrate license plate data from JSON to MongoDB"""
    db = get_database()
    if db is None:
        return False
    
    # License data paths (check both possible locations)
    license_data_paths = [
        os.path.join("local_data", "new_license_data.json"),
        os.path.join("server", "vehicle_data_with_helmet", "new_license_data.json")
    ]
    
    for license_data_path in license_data_paths:
        if os.path.exists(license_data_path):
            try:
                with open(license_data_path, 'r') as file:
                    license_data = json.load(file)
                    
                    print(f"Found {len(license_data)} license plate records in {license_data_path}")
                    
                    # Drop existing collection to avoid duplicates
                    if 'license_plate_data' in db.list_collection_names():
                        db.license_plate_data.drop()
                        print("Dropped existing license_plate_data collection")
                    
                    # Insert license data
                    batch = []
                    for plate_id, plate_number in license_data.items():
                        batch.append({
                            "plateId": plate_id,
                            "plateNumber": plate_number,
                            "timestamp": datetime.now()
                        })
                    
                    if batch:
                        db.license_plate_data.insert_many(batch)
                        print(f"Migrated {len(batch)} license plate records to MongoDB")
                    
                return True
            except Exception as e:
                print(f"Error migrating license plate data: {e}")
    
    print("No license plate data files found")
    return False

def migrate_helmet_data():
    """Migrate helmet data from JSON to MongoDB"""
    db = get_database()
    if db is None:
        return False
    
    # Helmet data paths (check both possible locations)
    helmet_data_paths = [
        os.path.join("local_data", "helmet_data.json"),
        os.path.join("server", "vehicle_data_with_helmet", "helmet_data.json")
    ]
    
    for helmet_data_path in helmet_data_paths:
        if os.path.exists(helmet_data_path):
            try:
                with open(helmet_data_path, 'r') as file:
                    helmet_data = json.load(file)
                    
                    print(f"Found {len(helmet_data)} helmet records in {helmet_data_path}")
                    
                    # Drop existing collection to avoid duplicates
                    if 'helmet_data' in db.list_collection_names():
                        db.helmet_data.drop()
                        print("Dropped existing helmet_data collection")
                    
                    # Insert helmet data
                    batch = []
                    for vehicle_id, is_wearing_helmet in helmet_data.items():
                        batch.append({
                            "vehicleId": vehicle_id,
                            "isWearingHelmet": is_wearing_helmet,
                            "timestamp": datetime.now()
                        })
                    
                    if batch:
                        db.helmet_data.insert_many(batch)
                        print(f"Migrated {len(batch)} helmet records to MongoDB")
                    
                return True
            except Exception as e:
                print(f"Error migrating helmet data: {e}")
    
    print("No helmet data files found")
    return False

def migrate_vehicle_images():
    """Migrate vehicle image metadata to MongoDB"""
    db = get_database()
    if db is None:
        return False
    
    # Vehicle images paths (check both possible locations)
    vehicle_images_paths = [
        os.path.join("local_data", "all_vehicle_detected_img"),
        os.path.join("server", "vehicle_data_with_helmet", "all_vehicle_detected_img")
    ]
    
    for vehicle_images_path in vehicle_images_paths:
        if os.path.exists(vehicle_images_path) and os.path.isdir(vehicle_images_path):
            try:
                # Get image files
                files = os.listdir(vehicle_images_path)
                vehicle_images = [f for f in files if f.endswith(('.jpg', '.jpeg', '.png'))]
                
                print(f"Found {len(vehicle_images)} vehicle images in {vehicle_images_path}")
                
                # Drop existing collection to avoid duplicates
                if 'vehicle_images' in db.list_collection_names():
                    db.vehicle_images.drop()
                    print("Dropped existing vehicle_images collection")
                
                # Insert vehicle image metadata
                batch = []
                for filename in vehicle_images:
                    try:
                        # Determine vehicle type from filename
                        vehicle_type = 'car'
                        if filename.startswith('bike_'):
                            vehicle_type = 'bike'
                        elif filename.startswith('bus_'):
                            vehicle_type = 'bus'
                        elif filename.startswith('truck_'):
                            vehicle_type = 'truck'
                        
                        # Extract vehicle ID from filename
                        vehicle_id = filename.split('_')[1].split('.')[0] if '_' in filename else filename.split('.')[0]
                        
                        batch.append({
                            "filename": filename,
                            "vehicleType": vehicle_type,
                            "vehicleId": vehicle_id,
                            "path": os.path.join(vehicle_images_path, filename),
                            "timestamp": datetime.now()
                        })
                    except Exception as e:
                        print(f"Error processing image {filename}: {e}")
                
                if batch:
                    db.vehicle_images.insert_many(batch)
                    print(f"Migrated {len(batch)} vehicle image records to MongoDB")
                
                return True
            except Exception as e:
                print(f"Error migrating vehicle images: {e}")
    
    print("No vehicle images directory found")
    return False

def migrate_license_plate_images():
    """Migrate license plate image metadata to MongoDB"""
    db = get_database()
    if db is None:
        return False
    
    # License plate images paths (check both possible locations)
    license_images_paths = [
        os.path.join("local_data", "all_license_plate_img"),
        os.path.join("server", "vehicle_data_with_helmet", "all_license_plate_img")
    ]
    
    for license_images_path in license_images_paths:
        if os.path.exists(license_images_path) and os.path.isdir(license_images_path):
            try:
                # Get image files
                files = os.listdir(license_images_path)
                license_images = [f for f in files if f.endswith(('.jpg', '.jpeg', '.png'))]
                
                print(f"Found {len(license_images)} license plate images in {license_images_path}")
                
                # Drop existing collection to avoid duplicates
                if 'license_plate_images' in db.list_collection_names():
                    db.license_plate_images.drop()
                    print("Dropped existing license_plate_images collection")
                
                # Insert license plate image metadata
                batch = []
                for filename in license_images:
                    try:
                        # Extract plate ID from filename
                        plate_id = filename  # Use the whole filename as the ID
                        
                        batch.append({
                            "filename": filename,
                            "plateId": plate_id,
                            "path": os.path.join(license_images_path, filename),
                            "timestamp": datetime.now()
                        })
                    except Exception as e:
                        print(f"Error processing image {filename}: {e}")
                
                if batch:
                    db.license_plate_images.insert_many(batch)
                    print(f"Migrated {len(batch)} license plate image records to MongoDB")
                
                return True
            except Exception as e:
                print(f"Error migrating license plate images: {e}")
    
    print("No license plate images directory found")
    return False

def main():
    """Main migration function"""
    print("Starting data migration from JSON to MongoDB...")
    
    # Check MongoDB connection
    db = get_database()
    if db is None:
        print("Failed to connect to MongoDB. Migration aborted.")
        sys.exit(1)
    
    # Migrate data
    migrate_speed_data()
    migrate_license_plate_data()
    migrate_helmet_data()
    migrate_vehicle_images()
    migrate_license_plate_images()
    
    print("Data migration completed!")

if __name__ == "__main__":
    main()
