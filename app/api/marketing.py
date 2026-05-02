from flask import Blueprint, request, jsonify
from app.workers.ad_creator import create_ad_campaign
from flask_jwt_extended import jwt_required

bp = Blueprint('marketing', __name__, url_prefix='/api/marketing')

@bp.route('/generate-campaign', methods=['POST'])
@jwt_required()
def generate_campaign():
    data = request.json
    niche = data.get('niche', 'ecommerce')
    campaign = create_ad_campaign(niche)
    return jsonify(campaign)
