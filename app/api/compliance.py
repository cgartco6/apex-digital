from flask import Blueprint, request, jsonify
from app import db
from app.models import ComplianceLog, User
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint('compliance', __name__, url_prefix='/api/compliance')

@bp.route('/consent', methods=['POST'])
@jwt_required()
def record_consent():
    user_id = get_jwt_identity()
    log = ComplianceLog(action='popia_consent_given', user_id=user_id)
    db.session.add(log)
    db.session.commit()
    return jsonify({'status': 'consent recorded'})

@bp.route('/request-deletion', methods=['POST'])
@jwt_required()
def request_deletion():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user:
        # Anonymize
        user.email = f"deleted_{user_id}@example.com"
        user.is_active = False
        db.session.commit()
        log = ComplianceLog(action='gdpr_right_to_be_forgotten', user_id=user_id)
        db.session.add(log)
        db.session.commit()
    return jsonify({'status': 'deletion queued'})

@bp.route('/popia-report', methods=['GET'])
@jwt_required()
def popia_report():
    user_id = get_jwt_identity()
    logs = ComplianceLog.query.filter_by(user_id=user_id).all()
    return jsonify([{'action': l.action, 'timestamp': l.timestamp.isoformat()} for l in logs])
