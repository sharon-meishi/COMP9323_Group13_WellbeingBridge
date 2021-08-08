from flask_restx import Resource

from flask_app import api
from tool import sql_command

api_popular = api.namespace('popular', description='Operations about Homepage popular recommendation')

@api_popular.route('/events')
class GetPopularEvent(Resource):
    def get(self):
        query_string = '''SELECT EventId FROM Booking GROUP BY EventId ORDER BY COUNT(BookingId) DESC LIMIT 9'''
        if sql_command(query_string):
            event_id = [1, 2, 3]
            # event_id = sql_command(query_string)[0]
            # print(sql_command(query_string))
        else:
            event_id = [1, 2, 3]
        output = {"event_id": event_id}
        return output, 200
