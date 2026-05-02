from flask import Blueprint, request, send_file
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import io
import zipfile

bp = Blueprint('documents', __name__, url_prefix='/api/documents')

@bp.route('/pdf', methods=['POST'])
def create_pdf():
    data = request.json
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    c.drawString(100, 750, data['title'])
    y = 700
    for line in data['content'].split('\n')[:50]:
        c.drawString(100, y, line[:80])
        y -= 20
    c.save()
    buffer.seek(0)
    return send_file(buffer, mimetype='application/pdf', as_attachment=True, download_name='document.pdf')

@bp.route('/zip', methods=['POST'])
def create_zip():
    files = request.json['files']  # list of {"name": "file.txt", "content": "text"}
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, 'w', zipfile.ZIP_DEFLATED) as zf:
        for f in files:
            zf.writestr(f['name'], f['content'])
    buffer.seek(0)
    return send_file(buffer, mimetype='application/zip', as_attachment=True, download_name='archive.zip')
