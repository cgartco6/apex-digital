from flask import Blueprint, request, jsonify
from app.services.ai_content import generate_blog, generate_social_post, generate_email, generate_image
from app.services.apex_marketing import generate_apex_promo
from flask_jwt_extended import jwt_required

bp = Blueprint('content', __name__, url_prefix='/api/content')

@bp.route('/client/blog', methods=['POST'])
@jwt_required()
def client_blog():
    data = request.json
    return jsonify({'blog': generate_blog(data['topic'], data.get('max_words', 500))})

@bp.route('/client/social', methods=['POST'])
@jwt_required()
def client_social():
    data = request.json
    return jsonify({'post': generate_social_post(data['prompt'], data.get('max_chars', 280))})

@bp.route('/client/email', methods=['POST'])
@jwt_required()
def client_email():
    data = request.json
    return jsonify({'email': generate_email(data['subject'], data.get('recipient_name'))})

@bp.route('/client/image', methods=['POST'])
@jwt_required()
def client_image():
    data = request.json
    return jsonify({'image_url': generate_image(data['prompt'])})

@bp.route('/apex/promo', methods=['GET'])
def apex_promo():
    return jsonify({'ads': generate_apex_promo()})
