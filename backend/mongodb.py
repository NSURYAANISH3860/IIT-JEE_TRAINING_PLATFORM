import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGODB_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME", "IIT-JEE")

class MongoDBManager:
    client: AsyncIOMotorClient = None
    db = None

    def connect(self):
        if not MONGODB_URI:
            print("WARNING: MONGODB_URI environment variable is missing. MongoDB connection skipped.")
            return
        
        # Clean potential angle brackets or placeholders if any slipped through
        clean_uri = MONGODB_URI
        if "<" in clean_uri or ">" in clean_uri:
            print("WARNING: MONGODB_URI still contains placeholders '<' or '>'. Connection might fail.")
            
        self.client = AsyncIOMotorClient(clean_uri)
        self.db = self.client[DATABASE_NAME]
        print(f"Connected to MongoDB database: '{DATABASE_NAME}'!")

    def disconnect(self):
        if self.client:
            self.client.close()
            print("Disconnected from MongoDB.")

db_manager = MongoDBManager()

def get_mongodb():
    """Dependency helper to inject the MongoDB database instance into routes."""
    return db_manager.db
