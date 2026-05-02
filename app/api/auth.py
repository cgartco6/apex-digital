from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models import User

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    user = User(email=data['email'])
    user.set_password(data['password'])
    user.role = data.get('role', 'client')
    user.business_name = data.get('business_name', '')
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User created', 'user_id': user.id}), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    access_token = create_access_token(identity=str(user.id), additional_claims={'role': user.role})
    return jsonify({'access_token': access_token, 'role': user.role, 'user_id': user.id})

@bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify({
        'id': user.id,
        'email': user.email,
        'role': user.role,
        'business_name': user.business_name,
        'revenue_zar': user.revenue_zar
    })
