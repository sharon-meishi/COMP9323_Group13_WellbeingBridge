from flask import request
from flask_restx import Resource
import json
from pymysql.converters import escape_string

from models.request_model import *
from flask_app import api
from tool import *


api_event = api.namespace('event', description='Operations about events')

# pre-define for parsers
token_parser = api.parser()
token_parser.add_argument('Authorization', type=str, location='headers')


@api_event.route("/<int:eventid>/summary", doc={"description": "get the summary of event"})
@api_event.doc(parser=token_parser)
class event(Resource):
    def get(self, eventid):
        token = token_parser.parse_args()['Authorization']
        event_sql = f"SELECT EventId,Thumbnail,EventName,StartDate,Postcode,Address,Lat,Lng, Introduction,Time,Category,OrganizationId,EndDate,Format FROM Event WHERE EventId='{eventid}';"
        result = sql_command(event_sql)

        if token is None:
            favourite = False
        else:
            email = decode_token(token)['email']
            type = decode_token(token)['type']
            if type == 'organization':
                favourite = False
            else:
                user_sql = f"SELECT FavouriteId FROM User WHERE Email='{email}';"
                if_favourite = sql_command(user_sql)[0][0]
                if if_favourite is None:
                    favourite = False
                else:
                    # favouriteid = list(if_favourite[0])[0]
                    if str(eventid) in if_favourite.split(","):
                        favourite = True
                    else:
                        favourite = False
        if result:
            book_sql = f"SELECT UserId FROM Booking WHERE EventId={eventid};"
            booked_userid = sql_command(book_sql)
            booked_event_user = []
            for i in booked_userid:
                booked_temp = {}
                id = i[0]
                sql = f"SELECT NickName,Email FROM User WHERE UserId={id};"
                x = sql_command(sql)[0]
                booked_temp['username'] = x[0]
                booked_temp['email'] = x[1]
                booked_event_user.append(booked_temp)
            # location = {"postcode": result[0][4], "suburb": result[0][5]}
            result_output = {"eventId": result[0][0],
                             "thumbnail": result[0][1],
                             "format":result[0][13],
                             "category": result[0][10],
                             "name": result[0][2],
                             "orgid": result[0][11],
                             "startdate": result[0][3],
                             "enddate": result[0][12],
                             "time": result[0][9],
                             "location": {
                                 "postcode": result[0][4],
                                 "Address": result[0][5],
                                 "Lat": result[0][6],
                                 "Lng": result[0][7]
                             },
                             "introduction": result[0][8],
                             "favourite": favourite,
                             "bookedUser": booked_event_user}
            return result_output, 200
        else:
            output = {
                "message": "Not Found"
            }
            return output, 404

    def delete(self, eventid):
        try:
            delete_sql = f'delete from Event where EventId={eventid};'
            sql_command(delete_sql)
            return {"message": 'Success!'}, 200
        except:
            return {"message": 'Wrong ID. Please try again.'}, 400


@api_event.route("/<int:eventid>/favourite", doc={"description": "like an event"})
@api_event.doc(parser=token_parser)
class favourite(Resource):
    def put(self, eventid):
        token = token_parser.parse_args()['Authorization']
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
            if any([id_ == eventid for id_ in ids]):
                output = {
                    "message": "Internal Error: event is already favourited."
                }
                return output, 200
            favourite_id = curr_favourite_id + ',' + str(eventid)
        else:
            favourite_id = str(eventid)

        sql_update_favourite = f"Update User SET FavouriteId='{favourite_id}' WHERE UserId='{user_id}';"
        sql_command(sql_update_favourite)

        favourite_id = [int(fid) for fid in favourite_id.split(',')]

        return {'favourite_id': favourite_id}, 200


@api_event.route("/<int:eventid>/unfavourite", doc={"description": "unlike an event"})
@api_event.doc(parser=token_parser)
class unfavourite(Resource):
    def put(self, eventid):
        token = token_parser.parse_args()['Authorization']
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
        event_id_str = str(eventid)
        if curr_favourite_id:
            ids = curr_favourite_id.split(',')
            for i, id_ in enumerate(ids):
                if id_ == event_id_str:
                    new_favorate_id = ids[:i] + ids[i + 1:]
                    break
            if new_favorate_id or (not new_favorate_id and len(ids) == 1):
                new_favorate_id_str = ','.join(new_favorate_id)
                sql_update_favourite = f"Update User SET FavouriteId='{new_favorate_id_str}' WHERE UserId='{user_id}';"
                sql_command(sql_update_favourite)
                new_favorate_id = [int(id_) for id_ in new_favorate_id]

                return {'favourite_id': new_favorate_id}, 200
            else:
                output = {
                    "message": "Internal Error: user never liked this event with id: " + event_id_str
                }
                return output, 500


@api_event.route("/<int:eventid>/book", doc={"description": "Book an event"})
@api_event.doc(parser=token_parser)
class book(Resource):
    def put(self, eventid):
        token = token_parser.parse_args()['Authorization']
        user_id = get_user_id_by_token(token)
        if user_id is None:
            output = {
                "message": "Internal Error: no user found."
            }
            return output, 500
        sql_booking = f"SELECT BookingId FROM Booking WHERE UserId = '{user_id}' AND EventId = '{eventid}';"
        booking_result = sql_command(sql_booking)
        if booking_result:
            output = {
                "message": "Booking is already being made."
            }
        else:
            sql = "INSERT INTO Booking VALUES (NULL, '{}', '{}');".format(eventid, user_id)
            sql_command(sql)
            output = {"message": "new event is booked."}
        return output, 200


@api_event.route("/<int:eventid>/unbook", doc={"description": "Unook an event"})
@api_event.doc(parser=token_parser)
class unbook(Resource):
    def put(self, eventid):
        token = token_parser.parse_args()['Authorization']
        user_id = get_user_id_by_token(token)
        if user_id is None:
            output = {
                "message": "Internal Error: no user found."
            }
            return output, 500
        sql_booking = f"SELECT BookingId FROM Booking WHERE UserId = '{user_id}' AND EventId = '{eventid}';"
        booking_result = sql_command(sql_booking)
        if not booking_result:
            output = {
                "message": "No booking for this event."
            }
            return output, 404
        else:
            sql = f"DELETE FROM Booking WHERE UserId = '{user_id}' AND EventId = '{eventid}';"
            sql_command(sql)
            output = {"message": "event is unbooked."}
        return output, 200


@api_event.route("/", doc={"description": "publish details of an event"})
@api_event.doc(parser=token_parser)
class PublishEvent(Resource):
    @api_event.expect(event_model)
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
            sql = '''INSERT INTO Event VALUES (0,"{}", {}, "{}", "{}","{}","{}","{}","{}","{}","{}","{}","{}","{}","{}","{}");'''. \
                format(escape_string(data['eventName']), org_result[0], org_result[1], data['thumbnail'], data['format'],
                       data['category'],
                       data['location']['postcode'], data['location']['address'],
                       data['location']['lat'], data['location']['lng'], data['startdate'], data['enddate'],
                       data['time'],
                       escape_string(data['introduction']), escape_string(data['details']))
            sql_command(sql)
            event_sql = f"SELECT EventId FROM Event WHERE EventName='{escape_string(data['eventName'])}' and OrganizationId={org_result[0]};"
            eventid = sql_command(event_sql)[0][0]
            output = {
                "message": "success",
                "eventid": eventid
            }
        return output, 200


@api_event.route("/<int:eventid>", doc={"description": "get details of an event"})
@api_event.doc(parser=token_parser)
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
            type = decode_token(token)['type']
            if type == 'organization':
                booked = False
                favourite = False
            else:
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
                if if_favourite is None:
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
            comment_temp['answer'] = data[6]
            comment_temp['replyid'] = data[7]
            # comment_temp = json.dumps(comment_temp)
            comments.append(comment_temp)
        comments.reverse()
        book_sql = f"SELECT UserId FROM Booking WHERE EventId={eventid};"
        booked_userid = sql_command(book_sql)
        booked_event_user = []
        for i in booked_userid:
            booked_temp = {}
            id = i[0]
            sql = f"SELECT NickName,Email FROM User WHERE UserId={id};"
            result = sql_command(sql)[0]
            booked_temp['username'] = result[0]
            booked_temp['email'] = result[1]
            booked_event_user.append(booked_temp)

        other_event_sql = f"SELECT * FROM Event WHERE Category='{event_info[6]}' and EventId!={eventid};"
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
            "category": event_info[6],
            "location": {
                "postcode": event_info[7],
                "address": event_info[8],
                "lat": event_info[9],
                "lng": event_info[10],
            },
            "startdate": event_info[11],
            "enddate": event_info[12],
            "time": event_info[13],
            "introduction": event_info[14],
            "details": event_info[15],
            "comments": comments,
            "recommendation": recommendation,
            "bookedUser": booked_event_user,
            "booked": booked,
            "favourite": favourite
        }
        return output

    @api_event.expect(event_model)
    def put(self, eventid):
        data = api.payload
        token = token_parser.parse_args()['Authorization']

        if token is None:
            output = {
                "message": "bad request!"
            }
            return output, 400
        else:
            user_type = decode_token(token)['type']
            if user_type != 'organization':
                output = {
                    "message": "wrong token!"
                }
                return output, 403
            introduction=escape_string(data['introduction'])
            details=escape_string(data['details'])
            update_sql = f"UPDATE Event SET EventName='{escape_string(data['eventName'])}', Thumbnail='{data['thumbnail']}',Format='{data['format']}',Category='{data['category']}',Postcode='{data['location']['postcode']}',Address='{data['location']['address']}',Lat='{data['location']['lat']}',lng='{data['location']['lng']}',StartDate='{data['startdate']}', EndDate='{data['enddate']}',Time='{data['time']}',Introduction='{introduction}',Details='{details}' WHERE Eventid={eventid};"
            sql_command(update_sql)
            output = {
                "message": "Success"
            }
        return output, 200


@api_event.route("/<int:eventid>/comment", doc={"description": "make a comment on a specific event"})
@api_event.doc(parser=token_parser)
class EventComment(Resource):
    @api_event.expect(comment_model)
    def post(self, eventid):
        data = api.payload
        token = token_parser.parse_args()['Authorization']
        if token is None:
            output = {
                "message": "You must login first!"
            }
            return output, 403
        email = decode_token(token)['email']
        type = decode_token(token)['type']
        if type == 'individual':
            sql = f"SELECT Userid,NickName FROM User WHERE Email='{email}';"
            result = sql_command(sql)[0]
            userid = result[0]
            username = result[1]

        else:
            sql = f"SELECT OrganizationId,OrganizationName FROM Organization WHERE Email='{email}';"
            result = sql_command(sql)[0]
            userid = result[0]
            username = result[1]
        find_event_sql = f"SELECT * FROM Event WHERE EventId={eventid};"
        event_result = sql_command(find_event_sql)
        if len(event_result):
            time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            sql = f"INSERT INTO Comment VALUES (0,{userid},'{username}',{eventid},'{escape_string(data['comment'])}','{time}',NULL,NULL);"
            sql_command(sql)

            # for email
            sql = f"SELECT OrganizationName,Email FROM Organization WHERE OrganizationId=(SELECT OrganizationId FROM Event WHERE Event.EventId={eventid});"
            org_info = sql_command(sql)[0]
            send_email(
                f"A new question has been asked on your event<br><br>{data['comment']}",
                f"http://{request.headers.get('Host').split(':')[0]}:3000/event/{eventid}",
                org_info[0],
                org_info[1]
            )

            output = {
                "message": "success"
            }
            return output, 200
        else:
            output = {
                "message": "Not found this event"
            }
            return output, 404


@api_event.route("/<int:eventid>/comment/<int:commentid>", doc={"description": "edit comments under one event"})
@api_event.doc(parser=token_parser)
class comment(Resource):
    @api_event.expect(comment_model)
    def put(self, eventid, commentid):
        token = token_parser.parse_args()['Authorization']
        data = api.payload
        edit_comment_sql = f"UPDATE COMMENT SET comment='{escape_string(data['comment'])}' WHERE id={commentid}"
        sql_command(edit_comment_sql)
        output = {
            "message": "Success"
        }
        return output, 200

    def delete(self, eventid, commentid):
        try:
            token = token_parser.parse_args()['Authorization']
            delete_sql = f'DELETE FROM COMMENT where id={commentid};'
            sql_command(delete_sql)
            return {"message": 'Success!'}, 200
        except:
            return {"message": 'Wrong ID. Please try again.'}, 400


@api_event.route("/<int:eventid>/comment/<int:commentid>/answer",
           doc={"description": "reply to a comment on a specific event"})
@api_event.doc(parser=token_parser)
class reply_comment(Resource):
    @api_event.expect(reply_model)
    def put(self, eventid, commentid):
        data = api.payload
        token = token_parser.parse_args()['Authorization']
        if token is None:
            output = {
                "message": "You must login first!"
            }
            return output, 403
        email = decode_token(token)['email']
        type = decode_token(token)['type']
        if type == 'individual':
            sql = f"SELECT Userid,NickName FROM User WHERE Email='{email}';"
            result = sql_command(sql)[0]
            userid = result[0]
        else:
            sql = f"SELECT OrganizationId,OrganizationName FROM Organization WHERE Email='{email}';"
            result = sql_command(sql)[0]
            userid = result[0]

        sql = f"UPDATE COMMENT SET answer='{escape_string(data['answer'])}',replyid={userid} WHERE id={commentid};"
        sql_command(sql)

        # for email
        sql = f"SELECT NickName,Email FROM User WHERE UserId=(SELECT userid FROM Comment WHERE id={commentid});"
        user_info = sql_command(sql)[0]
        send_email(
            f"Your question has been answered<br><br>{data['answer']}",
            f"http://{request.headers.get('Host').split(':')[0]}:3000/event/{eventid}",
            user_info[0],
            user_info[1]
        )

        output = {
            "message": "success"
        }
        return output, 200
