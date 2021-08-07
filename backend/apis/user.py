from flask import request
from flask_restx import Resource
import json

from models.request_model import *
from flask_app import api
from tool import *

api_usr = api.namespace('user', description='Operations about user profile')

# pre-define for parser
token_parser = api.parser()
token_parser.add_argument('Authorization', type=str, location='headers')

@api_usr.route("/profile", doc={"description": "get current user profile"})
@api_usr.doc(parser=token_parser)
class GetUserProfilebyId(Resource):
    def get(self):
        token = token_parser.parse_args()['Authorization']
        user_id = get_user_id_by_token(token)
        user_sql = f"SELECT * FROM User WHERE UserId={user_id};"
        book_sql = f"SELECT EventId FROM Booking WHERE UserId={user_id};"
        user_info = sql_command(user_sql)[0]
        bood_info = sql_command(book_sql)
        booking_lst = [info[0] for info in bood_info]
        if user_info[4]:
            favourite_id = [int(fid) for fid in user_info[4].split(',')]
        else:
            favourite_id = []
        favourite_id.reverse()
        booking_lst.reverse()
        output = {"UserId": user_id,
                  "Nickname": user_info[1],
                  "Email": user_info[2],
                  "Password": user_info[3],
                  "FavouriteId": favourite_id,
                  "BookingId": booking_lst
                  }

        return output, 200

    @api_usr.expect(user_update_model)
    def put(self):
        data = json.loads(request.get_data())
        token = token_parser.parse_args()['Authorization']
        user_id = get_user_id_by_token(token)
        if token is None:
            output = {
                "message": "Invalid Input"
            }
            return output, 400
        if data['Password'] == '':
            sql = '''UPDATE User SET Nickname = '{}'
                    WHERE UserId = {}'''. \
                format(data['Nickname'],
                       user_id)
        else:
            sql = '''UPDATE User SET
                             Nickname = '{}', 
                             Password = '{}'
            WHERE UserId = {}'''. \
                format(data['Nickname'],
                       data['Password'],
                       user_id)
        sql_command(sql)

        output = {
            "message": "success"
        }

        return output, 200