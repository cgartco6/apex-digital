from flask import Blueprint, request, jsonify
from app.workers.client_acquisition import acquire_clients_task
from app.workers.ad_creator import create_ad_campaign
from app.services.apex_marketing import generate_apex_promo
from flask_jwt_extended import jwt_required

bp = Blueprint('orchestrator', __name__, url_prefix='/api/orchestrate')

@bp.route('/run-full-agency', methods=['POST'])
@jwt_required()
def run_full():
    # Step 1: Generate promo for Apex itself
    promo = generate_apex_promo()
    # Step 2: Start client acquisition (async)
    acquisition_task = acquire_clients_task.delay()
    # Step 3: Create a demo campaign for the client's niche (default to ecommerce)
    data = request.json
    campaign = create_ad_campaign(data.get('niche', 'ecommerce'))
    return jsonify({
        'apex_promo': promo,
        'acquisition_task_id': acquisition_task.id,
        'demo_campaign': campaign
    })
