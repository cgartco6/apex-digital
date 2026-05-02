from flask import Blueprint, request, jsonify, session
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Order, Product

bp = Blueprint('cart_checkout', __name__, url_prefix='/api/cart')

@bp.route('/products', methods=['GET'])
def get_products():
    products = Product.query.filter_by(is_active=True).all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'price': p.price_zar
    } for p in products])

@bp.route('/add', methods=['POST'])
@jwt_required(optional=True)
def add_to_cart():
    data = request.json
    product_id = str(data['product_id'])
    quantity = data.get('quantity', 1)
    cart = session.get('cart', {})
    cart[product_id] = cart.get(product_id, 0) + quantity
    session['cart'] = cart
    return jsonify({'cart': cart})

@bp.route('/get', methods=['GET'])
@jwt_required(optional=True)
def get_cart():
    cart = session.get('cart', {})
    items = []
    total = 0
    for pid, qty in cart.items():
        product = Product.query.get(int(pid))
        if product:
            subtotal = product.price_zar * qty
            total += subtotal
            items.append({
                'id': product.id,
                'name': product.name,
                'price': product.price_zar,
                'quantity': qty,
                'subtotal': subtotal
            })
    return jsonify({'items': items, 'total': total})

@bp.route('/checkout', methods=['POST'])
@jwt_required()
def checkout():
    user_id = get_jwt_identity()
    cart = session.get('cart', {})
    if not cart:
        return jsonify({'error': 'Cart empty'}), 400
    items = []
    total = 0
    for pid, qty in cart.items():
        product = Product.query.get(int(pid))
        if product:
            subtotal = product.price_zar * qty
            total += subtotal
            items.append({
                'product_id': product.id,
                'name': product.name,
                'price': product.price_zar,
                'quantity': qty
            })
    order = Order(user_id=user_id, items=items, total=total, status='pending')
    db.session.add(order)
    db.session.commit()
    session['cart'] = {}
    return jsonify({'order_id': order.id, 'total': total})

@bp.route('/order/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    user_id = get_jwt_identity()
    order = Order.query.filter_by(id=order_id, user_id=user_id).first()
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    return jsonify({
        'id': order.id,
        'total': order.total,
        'status': order.status,
        'items': order.items,
        'created_at': order.created_at.isoformat()
    })
