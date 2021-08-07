from flask import Flask
from flask_cors import CORS
from flask_restx import Api

app = Flask(__name__)
app.config['ERROR_404_HELP'] = False
# db.init()
CORS(app)
api = Api(
    app,
    version='1.0',
    title='WellbeingBridge',
    description='Apis for WellbeingBridge backend server from COMP9323-Group 12'
)
