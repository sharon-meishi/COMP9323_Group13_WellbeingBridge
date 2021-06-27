# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

from flask import request, g

from . import Resource
from .. import schemas


class Event(Resource):

    def post(self):
        print(g.json)
        print(g.headers)

        return None, 200, None