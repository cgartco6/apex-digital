from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User, PaymentTransaction, Order

bp = Blueprint('client_dashboard', __name__, url_prefix='/api/dashboard')

@bp.route('/data', methods=['GET'])
@jwt_required()
def get_client_data():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    transactions = PaymentTransaction.query.filter_by(user_id=user_id).all()
    orders = Order.query.filter_by(user_id=user_id).all()
    return jsonify({
        'user': {
            'email': user.email,
            'business_name': user.business_name,
            'revenue_zar': user.revenue_zar
        },
        'transactions': [{
            'amount': t.amount_zar,
            'gateway': t.gateway,
            'status': t.status,
            'date': t.created_at.isoformat()
        } for t in transactions],
        'orders': [{
            'id': o.id,
            'total': o.total,
            'status': o.status
        } for o in orders]
    })
