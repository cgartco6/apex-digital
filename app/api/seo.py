from flask import Blueprint, request, jsonify
from app.services.seo_optimizer import build_backlinks, generate_sitemap, optimize_meta_tags
from flask_jwt_extended import jwt_required

bp = Blueprint('seo', __name__, url_prefix='/api/seo')

@bp.route('/build-backlinks', methods=['POST'])
@jwt_required()
def start_backlinks():
    build_backlinks()
    return jsonify({'status': 'Backlink building started'})

@bp.route('/sitemap', methods=['GET'])
def get_sitemap():
    # Example URLs – in production, fetch from DB
    urls = ['https://apexdigital.africa', 'https://apexdigital.africa/shop']
    sitemap = generate_sitemap(urls)
    return sitemap, 200, {'Content-Type': 'application/xml'}

@bp.route('/optimize-meta', methods=['POST'])
@jwt_required()
def optimize_meta():
    data = request.json
    optimized = optimize_meta_tags(data['html'], data['title'], data['description'])
    return jsonify({'optimized_html': optimized})
