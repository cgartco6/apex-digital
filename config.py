import os
from dotenv import load_dotenv
load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-key-change')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-dev-key')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    REDIS_URL = os.getenv('REDIS_URL')
    STRIPE_API_KEY = os.getenv('STRIPE_SECRET_KEY')
    PAYFAST_MERCHANT_ID = os.getenv('PAYFAST_MERCHANT_ID')
    PAYFAST_SECRET_KEY = os.getenv('PAYFAST_SECRET_KEY')
    PAYPAL_CLIENT_ID = os.getenv('PAYPAL_CLIENT_ID')
    PAYPAL_SECRET = os.getenv('PAYPAL_SECRET')
    TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
    TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    UPLOAD_FOLDER = 'uploads/proofs'
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf'}
    ADMIN_EMAIL = os.getenv('ADMIN_EMAIL', 'admin@apex.com')
