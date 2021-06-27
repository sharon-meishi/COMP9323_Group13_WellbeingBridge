# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

from flask import request, g

from . import Resource
from .. import schemas


class EventEventidUnlike(Resource):

    def put(self, eventid):
        print(g.headers)

        return None, 200, None