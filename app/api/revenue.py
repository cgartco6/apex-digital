from flask import Blueprint, jsonify
from app import db
from app.models import PaymentTransaction
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint('revenue', __name__, url_prefix='/api/revenue')

@bp.route('/total', methods=['GET'])
@jwt_required()
def total_revenue():
    user_id = get_jwt_identity()
    total = db.session.query(db.func.sum(PaymentTransaction.amount_zar))\
        .filter_by(user_id=user_id, status='completed').scalar() or 0
    return jsonify({'zar_total': total})

@bp.route('/global', methods=['GET'])
@jwt_required(optional=True)
def global_revenue():
    total = db.session.query(db.func.sum(PaymentTransaction.amount_zar))\
        .filter_by(status='completed').scalar() or 0
    return jsonify({'zar_global': total})
