from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from config import Config
from celery import Celery

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
bcrypt = Bcrypt()
celery = Celery(__name__, broker=Config.REDIS_URL)

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    celery.conf.update(app.config)

    from app.api import auth, payments, compliance, documents, content, marketing, target, rule, orchestrator, revenue, seo, client_dashboard, admin_dashboard, cart_checkout
    app.register_blueprint(auth.bp)
    app.register_blueprint(payments.bp)
    app.register_blueprint(compliance.bp)
    app.register_blueprint(documents.bp)
    app.register_blueprint(content.bp)
    app.register_blueprint(marketing.bp)
    app.register_blueprint(target.bp)
    app.register_blueprint(rule.bp)
    app.register_blueprint(orchestrator.bp)
    app.register_blueprint(revenue.bp)
    app.register_blueprint(seo.bp)
    app.register_blueprint(client_dashboard.bp)
    app.register_blueprint(admin_dashboard.bp)
    app.register_blueprint(cart_checkout.bp)

    from app import models
    from app.cli import seed_db
    app.cli.add_command(seed_db)

    @app.route('/')
    def index():
        return '''<a href="/login">Login</a> | <a href="/register">Register</a> | <a href="/shop">Shop</a>'''

    @app.route('/login')
    def login_page():
        return '''
        <form id="loginForm">
            <input name="email" placeholder="Email"><br>
            <input name="password" type="password"><br>
            <button type="submit">Login</button>
        </form>
        <script>
        document.getElementById('loginForm').onsubmit = async (e) => {
            e.preventDefault();
            const res = await fetch('/api/auth/login', {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({email:e.target.email.value, password:e.target.password.value})
            });
            const data = await res.json();
            localStorage.setItem('access_token', data.access_token);
            if(data.role === 'admin') location.href='/admin'; else location.href='/dashboard';
        };
        </script>
        '''

    @app.route('/register')
    def register_page():
        return '''
        <form id="regForm">
            <input name="email" placeholder="Email"><br>
            <input name="password" type="password"><br>
            <button type="submit">Register</button>
        </form>
        <script>
        document.getElementById('regForm').onsubmit = async (e) => {
            e.preventDefault();
            await fetch('/api/auth/register', {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({email:e.target.email.value, password:e.target.password.value})
            });
            alert('Registered. Please login.');
            location.href='/login';
        };
        </script>
        '''

    @app.route('/dashboard')
    def client_dash():
        return app.send_static_file('client_dashboard.html')

    @app.route('/admin')
    def admin_dash():
        return app.send_static_file('admin_dashboard.html')

    @app.route('/shop')
    def shop():
        return app.send_static_file('shop.html')

    @app.route('/cart')
    def cart():
        return app.send_static_file('cart.html')

    @app.route('/checkout')
    def checkout():
        return app.send_static_file('checkout.html')

    return app
