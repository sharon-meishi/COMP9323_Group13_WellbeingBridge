# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

from flask import request, g

from . import Resource
from .. import schemas


class EventEventid(Resource):

    def get(self, eventid):
        print(g.headers)

        return {}, 200, None

    def put(self, eventid):
        print(g.json)
        print(g.headers)

        return None, 200, None

    def delete(self, eventid):
        print(g.headers)

        return None, 200, None