from flask import Blueprint, request, jsonify
from app.workers.client_acquisition import acquire_clients_task
from app import celery

bp = Blueprint('target', __name__, url_prefix='/api/target')

@bp.route('/start-acquisition', methods=['POST'])
def start_acquisition():
    task = acquire_clients_task.delay()
    return jsonify({'task_id': task.id, 'status': 'started'})

@bp.route('/status/<task_id>', methods=['GET'])
def task_status(task_id):
    task = celery.AsyncResult(task_id)
    if task.state == 'PENDING':
        response = {'state': task.state, 'current': 0, 'total': 1000, 'status': 'Pending...'}
    elif task.state == 'PROGRESS':
        response = {
            'state': task.state,
            'current': task.info.get('current', 0),
            'total': task.info.get('total', 1000),
            'status': task.info.get('status', '')
        }
    else:
        response = {'state': task.state, 'result': task.result}
    return jsonify(response)
