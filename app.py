from flask import Flask, send_from_directory

app = Flask(__name__, static_folder='.')

@app.route('/')
def serve():
    return send_from_directory('.', 'apex.html')

if __name__ == '__main__':
    app.run(port=8000, debug=True)
