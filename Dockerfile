FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN mkdir -p /app/uploads/proofs
RUN mkdir -p /app/static/uploads
RUN chmod -R 755 /app/uploads
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "run:app"]
