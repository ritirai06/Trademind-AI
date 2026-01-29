import sqlite3
import os
from passlib.context import CryptContext

DB_PATH = "database/market.db"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_demo_user():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    demo_email = "demo@trademind.ai"
    demo_password = "password123"
    hashed_password = pwd_context.hash(demo_password)
    
    try:
        cursor.execute(
            "INSERT OR REPLACE INTO users (full_name, email, password) VALUES (?, ?, ?)",
            ("Demo User", demo_email, hashed_password)
        )
        conn.commit()
        print(f"Successfully created demo user!")
        print(f"Email: {demo_email}")
        print(f"Password: {demo_password}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    create_demo_user()
