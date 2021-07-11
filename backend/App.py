from jwt_token import encode_token, decode_token
from flask import Flask, request, jsonify
from flask_restx import Resource, Api, fields
import pymysql
import json
from flask_cors import CORS
from datetime import datetime, timedelta
import jwt

app = Flask(__name__)
api = Api(app, title='COMP9323', description='hello')
CORS(app)


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


user_model = api.model("user", {
    "nickname": fields.String,
    "email": fields.String,
    "password": fields.String
})


# individual user's sign up
@api.route('/signup/user', doc={"description": "new individual user registration"})
class IndividualRegister(Resource):
    @api.expect(user_model)
    def post(self):
        data = json.loads(request.get_data())
        nickname = data['nickname']
        email = data['email']
        password = data['password']
        if nickname == "" or email == "" or password == "":
            output = {
                "message": "Missing nickname or email or password"
            }
            return output, 400
        else:
            sql = f"SELECT * FROM User WHERE Email='{email}';"
            if sql_command(sql):
                output = {
                    "message": "email already used as individual"
                }
                return output, 403
            else:
                userid = 0
                sql = "INSERT INTO User VALUES ({},'{}', '{}', '{}', NULL);".format(userid, nickname, email, password)
                sql_command(sql)
                select_sql = f"SELECT UserId FROM User WHERE Email='{email}';"
                id = sql_command(select_sql)[0][0]
                token = encode_token(email, "individual")
                output = {
                    "message": "Success register",
                    "nickname": nickname,
                    "userid": id,
                    "token": token
                }
                return output, 200


organization_model = api.model("organization", {
    "organizationName": fields.String,
    "email": fields.String,
    "password": fields.String,
    "organizationType": fields.String,
    "contact": fields.String,
    "introduction": fields.String
})


# organization user's sign up
@api.route('/signup/organization', doc={"description": "new organization user registration"})
class OrganizationRegister(Resource):
    @api.expect(organization_model)
    def post(self):
        data = json.loads(request.get_data())
        organization_name = data['organizationName']
        email = data['email']
        password = data['password']
        organization_type = data['organizationType']
        introduction = data['introduction']
        contact = data['contact']
        if email == "" or password == "" or organization_name == "" or organization_type == "" or contact == "":
            output = {
                "message": "Missing information"
            }
            return output, 400
        else:
            sql = f"SELECT * FROM Organization WHERE Email='{email}';"
            if sql_command(sql):
                output = {
                    "message": "email already used as organization"
                }
                return output, 403
            else:
                organization_id = 0
                sql = "INSERT INTO Organization VALUES ({},'{}', '{}', '{}', '{}','{}','{}',NULL,NULL,NULL,NULL,NULL,NULL);". \
                    format(organization_id, email, password, organization_name, organization_type, contact,
                           introduction)
                sql_command(sql)
                select_sql = f"SELECT OrganizationId FROM Organization WHERE Email='{email}';"
                id = sql_command(select_sql)[0][0]
                token = encode_token(email, "organization")
                output = {
                    "message": "Success register",
                    "email": email,
                    "organizationid": id,
                    "token": token
                }
                return output, 200


login_model = api.model("login", {
    "email": fields.String,
    "password": fields.String
})


@api.route('/login')
class Login(Resource):
    @api.response(200, 'OK')
    @api.response(400, 'Bad Request')
    @api.response(404, 'Not Found')
    @api.response(201, 'Created')
    @api.expect(login_model)
    def post(self):
        data = json.loads(request.get_data())
        email = data['email']
        password = data['password']
        if email == "" or password == "":
            output = {
                "message": "Missing email or password"
            }
            return output, 400
        code = login(email, password)
        return code


def login(username, password):
    sql_login_u = f"SELECT UserId, Password FROM User WHERE Email = '{username}';"
    sql_login_o = f"SELECT OrganizationId, Password FROM Organization WHERE Email = '{username}';"
    result_u = sql_command(sql_login_u)
    result_o = sql_command(sql_login_o)
    tag = 'string'
    password_final = 0
    if len(result_u) > 0:
        group_id = result_u[0][0]
        password_final = result_u[0][1]
        tag = 'individual'
    elif len(result_o) > 0:
        group_id = result_o[0][0]
        password_final = result_o[0][1]
        tag = 'organization'

    if password == password_final:
        token = encode_token(username, tag)
        output = {
            "userId": group_id,
            "usergroup": tag,
            "token": token
        }
        return output, 200
    else:
        output = {
            "message": "Wrong email or password"
        }
        return output, 400


@api.route('/popular/events')
class GetPopularEvent(Resource):
    def get(self):
        querry_string = '''SELECT EventId FROM Booking GROUP BY EventId ORDER BY COUNT(BookingId) DESC LIMIT 9'''
        return sql_command(querry_string), 200


token_parser = api.parser()
token_parser.add_argument('Authorization', type=str, location='headers')

token_parser = api.parser()
token_parser.add_argument('Authorization', type=str, location='headers')

@api.route("/event/<int:eventid>/summary", doc={"description": "get the summary of event"})
@api.doc(parser=token_parser)
class event(Resource):
    def get(self, eventid):
        token = token_parser.parse_args()['Authorization']
        event_sql = f"SELECT EventId,Thumbnail,EventName,Date,Postcode,Suburb, Introduction FROM Event WHERE EventId='{eventid}';"
        result = sql_command(event_sql)

        if token is None:
            favourite = False
        else:
            email = decode_token(token)['email']
            user_sql = f"SELECT FavouriteId FROM User WHERE Email='{email}';"
            if_favourite = sql_command(user_sql)[0][0]
            if if_favourite is None or if_favourite=='':
                favourite = False
            else:
                # favouriteid = list(if_favourite[0])[0]
                if str(eventid) in if_favourite.split(","):
                    favourite = True
                else:
                    favourite = False
        if result:
            # location = {"postcode": result[0][4], "suburb": result[0][5]}
            result_output = {"eventId": result[0][0],
                             "thumbnail": result[0][1],
                             "name": result[0][2],
                             "date": result[0][3],
                             "location": {
                                 "postcode": result[0][4],
                                 "suburb": result[0][5]
                             },
                             "introduction": result[0][6],
                             "favourite": favourite}
            return result_output, 200
        else:
            output = {
                "message": "Not Found"
            }
            return output, 404


def get_user_id_by_token(token):
    user_email = decode_token(token)['email']
    sql_user_id = f"SELECT UserId FROM User WHERE Email = '{user_email}';"
    user_id_result = sql_command(sql_user_id)
    if user_id_result:
        return user_id_result[0][0]
    else:
        return None


@api.route("/event/{eventid}/favourite", doc={"description": "like an event"})
@api.doc(parser=parser)
class favourite(Resource):
    def put(self):
        event_id = parser.parse_args()['eventid']
        token = parser.parse_args()['token']
        user_id = get_user_id_by_token(token)
        if user_id is None:
            output = {
                "message": "Internal Error: no user found."
            }
            return output, 500
        sql_favourite_id = f"SELECT FavouriteId FROM User WHERE UserId='{user_id}';"
        favourite_id_result = sql_command(sql_favourite_id)
        curr_favourite_id = favourite_id_result[0][0]

        if curr_favourite_id:
            ids = curr_favourite_id.split(',')
            if any([id_ == event_id for id_ in ids]):
                output = {
                    "message": "Internal Error: event is already favourited."
                }
                return output, 500
            favourite_id = curr_favourite_id + ',' + event_id
        else:
            favourite_id = event_id

        sql_update_favourite = f"Update User SET FavouriteId='{favourite_id}' WHERE UserId='{user_id}';"
        sql_command(sql_update_favourite)

        return {'favourite_id': favourite_id}, 200


@api.route("/event/{eventid}/unfavourite", doc={"description": "unlike an event"})
@api.doc(parser=parser)
class unfavourite(Resource):
    def put(self):
        event_id = parser.parse_args()['eventid']
        token = parser.parse_args()['token']
        user_id = get_user_id_by_token(token)
        if user_id is None:
            output = {
                "message": "Internal Error: no user found."
            }
            return output, 500
        sql_favourite_id = f"SELECT FavouriteId FROM User WHERE UserId='{user_id}';"
        favourite_id_result = sql_command(sql_favourite_id)
        curr_favourite_id = favourite_id_result[0][0]

        if not curr_favourite_id:
            output = {
                "message": "Internal Error: user never liked any event."
            }
            return output, 500

        new_favorate_id = []
        if curr_favourite_id:
            ids = curr_favourite_id.split(',')
            for i, id_ in enumerate(ids):
                if id_ == event_id:
                    new_favorate_id = ids[:i] + ids[i + 1:]
                    break
            if new_favorate_id or (not new_favorate_id and len(ids) == 1):
                new_favorate_id = ','.join(new_favorate_id)
                sql_update_favourite = f"Update User SET FavouriteId='{new_favorate_id}' WHERE UserId='{user_id}';"
                sql_command(sql_update_favourite)
                return {'favourite_id': new_favorate_id}, 200
            else:
                output = {
                    "message": "Internal Error: user never liked this event with id: " + event_id
                }
                return output, 500


@api.route("/event/{eventid}/book", doc={"description": "Book an event"})
@api.doc(parser=parser)
class book(Resource):
    def put(self):
        event_id = parser.parse_args()['eventid']
        token = parser.parse_args()['token']
        user_id = get_user_id_by_token(token)
        if user_id is None:
            output = {
                "message": "Internal Error: no user found."
            }
            return output, 500
        sql_booking = f"SELECT BookingId FROM Booking WHERE UserId = '{user_id}' AND EventId = '{event_id}';"
        booking_result = sql_command(sql_booking)
        if booking_result:
            output = {
                "message": "Booking is already being made."
            }
        else:
            sql = "INSERT INTO Booking VALUES (NULL, '{}', '{}');".format(event_id, user_id)
            sql_command(sql)
            output = {"message": "new event is booked."}
        return output, 200


@api.route("/event/{eventid}/unbook", doc={"description": "Unook an event"})
@api.doc(parser=parser)
class unbook(Resource):
    def put(self):
        event_id = parser.parse_args()['eventid']
        token = parser.parse_args()['token']
        user_id = get_user_id_by_token(token)
        if user_id is None:
            output = {
                "message": "Internal Error: no user found."
            }
            return output, 500
        sql_booking = f"SELECT BookingId FROM Booking WHERE UserId = '{user_id}' AND EventId = '{event_id}';"
        booking_result = sql_command(sql_booking)
        if not booking_result:
            output = {
                "message": "No booking for this event."
            }
        else:
            sql = f"DELETE FROM Booking WHERE UserId = '{user_id}' AND EventId = '{event_id}';"
            sql_command(sql)
            output = {"message": "event is unbooked."}
        return output, 200


location_model = api.model("location", {
    "postcode": fields.String,
    "suburb": fields.String,
    "street": fields.String,
    "venue": fields.String
})
event_model = api.model("event", {
    "eventName": fields.String,
    "thumbnail": fields.String,
    "format": fields.String,
    "location": fields.Nested(location_model),
    "date": fields.String,
    "time": fields.String,
    "introduction": fields.String,
    "details": fields.String
})


@api.route("/event", doc={"description": "publish details of an event"})
@api.doc(parser=token_parser)
class PublishEvent(Resource):
    @api.expect(event_model)
    def post(self):
        data = json.loads(request.get_data())
        token = token_parser.parse_args()['Authorization']
        if token is None:
            output = {
                "message": "Invalid input"
            }
            return output, 400
        user_info = decode_token(token)
        user_type = user_info['type']
        if user_type != 'organization':
            output = {
                "message": "Cannot access.Wrong token!"
            }
            return output, 403
        else:
            org_email = user_info['email']
            org_sql = f"SELECT OrganizationId,OrganizationName FROM Organization WHERE Email = '{org_email}';"
            org_result = sql_command(org_sql)[0]
            sql = "INSERT INTO Event VALUES (0,'{}', {}, '{}', '{}','{}','{}','{}','{}','{}','{}','{}','{}','{}');". \
                format(data['eventName'], org_result[0], org_result[1], data['thumbnail'], data['format'],
                       data['location']['postcode'], data['location']['suburb'],
                       data['location']['street'], data['location']['venue'], data['date'], data['time'],
                       data['introduction'], data['details'])
            sql_command(sql)
            output = {
                "message": "success"
            }
        return output, 200


@api.route("/event/<int:eventid>", doc={"description": "get details of an event"})
@api.doc(parser=token_parser)
class GetEventbyId(Resource):
    def get(self, eventid):
        token = token_parser.parse_args()['Authorization']
        event_sql = f"SELECT * FROM Event WHERE EventId={eventid};"
        event_info = sql_command(event_sql)[0]
        if token is None:
            booked = False
            favourite = False
        else:
            email = decode_token(token)['email']
            user_sql = f"SELECT Userid FROM User WHERE Email='{email}';"
            userid = sql_command(user_sql)[0][0]
            booking_sql = f"SELECT * FROM Booking WHERE UserId={userid} and EventId={eventid};"
            booking_result = sql_command(booking_sql)
            if len(booking_result) == 0:
                booked = False
            else:
                booked = True
            user_sql = f"SELECT FavouriteId FROM User WHERE Email='{email}';"
            if_favourite = sql_command(user_sql)[0][0]
            if if_favourite is None or if_favourite=='':
                favourite = False
            else:
                # favouriteid = list(if_favourite[0])[0]
                if str(eventid) in if_favourite.split(","):
                    favourite = True
                else:
                    favourite = False
        comment_sql = f"SELECT * FROM Comment WHERE eventid={eventid};"
        comments = []

        comments_result = sql_command(comment_sql)
        for data in comments_result:
            comment_temp = {}
            comment_temp['commentId'] = data[0]
            comment_temp['userId'] = data[1]
            comment_temp['username'] = data[2]
            comment_temp['published'] = str(data[5])
            comment_temp['comment'] = data[4]
            # comment_temp = json.dumps(comment_temp)
            comments.append(comment_temp)
        book_sql = f"SELECT UserId FROM Booking WHERE EventId={eventid};"
        booked_userid = sql_command(book_sql)
        booked_event_user = []
        for i in booked_userid:
            booked_event_user.append(i[0])

        other_event_sql = f"SELECT * FROM Event WHERE OrganizationId={event_info[2]} and EventId!={eventid};"
        other_event = sql_command(other_event_sql)
        recommendation = []
        if len(other_event) != 0:
            for j in range(len(other_event)):
                recommendation.append(other_event[j][0])
        output = {
            "eventId": eventid,
            "eventName": event_info[1],
            "OrganizationId": event_info[2],
            "OrganizationName": event_info[3],
            "thumbnail": event_info[4],
            "format": event_info[5],
            "location": {
                "postcode": event_info[6],
                "suburb": event_info[7],
                "street": event_info[8],
                "venue": event_info[9],
            },
            "date": event_info[10],
            "time": event_info[11],
            "introduction": event_info[12],
            "details": event_info[13],
            "comments": comments,
            "recommendation": recommendation,
            "bookedUser": booked_event_user,
            "booked": booked,
            "favourite": favourite
        }
        return output

    @api.expect(event_model)
    def put(self, eventid):
        data = api.payload
        token = token_parser.parse_args()['Authorization']

        if token is None:
            output = {
                "message": "bad request!"
            }
            return output, 405
        else:
            user_type = decode_token(token)['type']
            if user_type != 'organization':
                output = {
                    "message": "wrong token!"
                }
                return output, 403
            update_sql = f"UPDATE Event SET EventName='{data['eventName']}', Thumbnail='{data['thumbnail']}',Format='{data['format']}',Postcode='{data['location']['postcode']}',Suburb='{data['location']['suburb']}',Street='{data['location']['street']}',venue='{data['location']['venue']}',Date='{data['date']}',Time='{data['time']}',Introduction='{data['introduction']}',Details='{data['details']}' WHERE Eventid={eventid};"
            sql_command(update_sql)
            output = {
                "message": "Success"
            }
        return output, 200


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=8000, debug=True)
