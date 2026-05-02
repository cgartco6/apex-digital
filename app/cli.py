import click
from app import db, create_app
from app.models import User, Product
from flask.cli import with_appcontext

@click.command('seed-db')
@with_appcontext
def seed_db():
    """Seed database with admin user and sample products."""
    # Admin user
    if not User.query.filter_by(email='admin@apex.com').first():
        admin = User(email='admin@apex.com', role='admin')
        admin.set_password('admin123')
        db.session.add(admin)
        print("Admin user created: admin@apex.com / admin123")
    # Products
    products = [
        ('Starter Package', 'AI client acquisition (1000 clients in 3 days)', 999.00),
        ('Pro Package', 'Unlimited AI content + priority support', 1999.00),
        ('Enterprise', 'Custom AI agents + dedicated account manager', 4999.00)
    ]
    for name, desc, price in products:
        if not Product.query.filter_by(name=name).first():
            db.session.add(Product(name=name, description=desc, price_zar=price))
            print(f"Added product: {name}")
    db.session.commit()
    print("Database seeded successfully.")
