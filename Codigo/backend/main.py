from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/', methods = ['GET'])
def get_arrticles():
    return jsonify({"Hello":"World"})

if __name__ == "__main__":
    app.run(debug=True)