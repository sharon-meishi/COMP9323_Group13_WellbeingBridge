from flask import Flask, request, Response
from flask_restplus import Resource, Api
import requests
import json 
import pymysql

app = Flask(__name__)
api = Api(app)

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


@api.route('/popular/events')
class GetPopularEvent(Resource):

	def get(self):
		querry_string = '''SELECT EventId
							FROM Booking
							GROUP BY EventId
							ORDER BY COUNT(BookingId) DESC
							LIMIT 9'''
		return sql_command(querry_string), 200

if __name__ == '__main__':
	app.run(debug = True)