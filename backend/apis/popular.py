from flask_restx import Resource

from flask_app import api
from tool import sql_command

api_popular = api.namespace('popular', description='Operations about Homepage popular recommendation')

# popular api is for getting popular event shown on homepage

# get the top 9 events
@api_popular.route('/events')
class GetPopularEvent(Resource):
    def get(self):
        all_event = '''SELECT EventId FROM Event LIMIT 9'''
        query_string = '''SELECT EventId FROM Booking GROUP BY EventId ORDER BY COUNT(BookingId) DESC LIMIT 9'''
        if sql_command(query_string):
            event_id = sql_command(query_string)
        else:
            event_id = sql_command(all_event)
        output = {"event_id": event_id}
        return output, 200
