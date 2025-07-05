import pymongo
from pprint import pprint

# MongoDB connection settings
MONGO_URI = 'mongodb://localhost:27017/'
DB_NAME = 'traffic_management'

def main():
    """Check MongoDB data"""
    try:
        client = pymongo.MongoClient(MONGO_URI)
        db = client[DB_NAME]
        
        # Print collection names
        print("Collections in the database:")
        print(db.list_collection_names())
        
        # Print count of documents in each collection
        print("\nDocument counts:")
        for collection in db.list_collection_names():
            print(f"{collection}: {db[collection].count_documents({})}")
        
        # Print a sample document from each collection
        print("\nSample documents:")
        for collection in db.list_collection_names():
            print(f"\n{collection}:")
            sample = db[collection].find_one()
            if sample:
                # Remove _id for cleaner output
                if '_id' in sample:
                    del sample['_id']
                pprint(sample)
            else:
                print("No documents found")
    
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
