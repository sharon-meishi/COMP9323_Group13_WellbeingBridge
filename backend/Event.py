from flask import *
from flask_restx import Resource, Api, fields
import pymysql
import json
from jwt_token import decode_token, encode_token

app = Flask(__name__)
api = Api(app, title='COMP9323', description='hello')


def sql_command(command):
    db = pymysql.connect(
        host='localhost',
        port=3306,
        user='root',
        password='unsw1234',
        database='wellbeing',
        charset='utf8'
    )
    c = db.cursor()
    c.execute(command)
    result = c.fetchall()
    db.commit()
    db.close()
    return result


parser = api.parser()
parser.add_argument('token', type=str, required=True)
parser.add_argument('eventid', type=str, required=True)


@api.route("/event/{eventid}/summary", doc={"description": "get the summary of event"})
@api.doc(parser=parser)
@api.response(200, 'OK')
@api.response(400, 'Bad Request')
@api.response(404, 'Not Found')
class event(Resource):
    def get(self):
        eventid = parser.parse_args()['eventid']
        sql = f"SELECT EventId,Thumbnail,EventName,Date,Postcode,Suburb FROM Event WHERE EventId='{eventid}';"
        result = sql_command(sql)
        if result:
            print("ok")
            # location = {"postcode": result[0][4], "suburb": result[0][5]}
            result_output = {"eventId": result[0][0],
                             "thumbnail": result[0][1],
                             "name": result[0][2],
                             "date": result[0][3],
                             "location": {
                                 "postcode": result[0][4],
                                 "suburb": result[0][5]
                             }}
            return result_output, 200
        else:
            return {"message": "Not Found"}, 404


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=8000, debug=True)
