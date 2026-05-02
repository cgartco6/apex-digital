from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User, PaymentTransaction, Order

bp = Blueprint('admin_dashboard', __name__, url_prefix='/api/admin')

@bp.route('/stats', methods=['GET'])
@jwt_required()
def stats():
    identity = get_jwt_identity()
    user = User.query.get(identity)
    if user.role not in ['admin', 'owner']:
        return jsonify({'error': 'Forbidden'}), 403
    total_users = User.query.count()
    total_revenue = db.session.query(db.func.sum(PaymentTransaction.amount_zar)).filter_by(status='completed').scalar() or 0
    pending_orders = Order.query.filter_by(status='pending').count()
    return jsonify({
        'total_users': total_users,
        'total_revenue': total_revenue,
        'pending_orders': pending_orders
    })

@bp.route('/users', methods=['GET'])
@jwt_required()
def list_users():
    identity = get_jwt_identity()
    user = User.query.get(identity)
    if user.role not in ['admin', 'owner']:
        return jsonify({'error': 'Forbidden'}), 403
    users = User.query.all()
    return jsonify([{
        'id': u.id,
        'email': u.email,
        'role': u.role,
        'business_name': u.business_name
    } for u in users])
