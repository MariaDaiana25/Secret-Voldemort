"""
Created on Thu Oct 21 20:04:35 2020

@author: alfaBeta

"""
from fastapi import FastAPI
from typing import Optional
from pydantic import BaseModel
from pony.orm import db_session, select, count
import time
import datetime
from pony.orm import *
from pony.orm import Database, Required, Optional, Set


db = Database()


class User(db.Entity):
    id_user = PrimaryKey(int, auto=True)
    player = Set("Player")
    user_name = Required(str)
    password = Required(str)
    email = Required(str, unique=True)
    state_user = Optional(str)
    creation_date = Optional(datetime.datetime,
                             default=datetime.datetime.now())
    last_update = Optional(datetime.datetime)
    photo = Optional(str)


class Match(db.Entity):
    id_match = PrimaryKey(int, auto=True)
    name_match = Required(str, unique=True)
    player = Set("Player")
    card = Set("Card")
    government = Optional('Government')
    boards = Set('Board')
    max_player = Optional(int, sql_default='0', default=5)
    min_player = Optional(int, sql_default='0', default=0)
    state_match = Optional(str)
    state_game = Optional(str, default='WAITING')
    creation_date = Optional(datetime.datetime,
                             default=datetime.datetime.now())
    last_update = Optional(datetime.datetime)
    is_result_lumus = Optional(int, sql_default='0', default=0)
    is_result_nox = Optional(int, sql_default='0', default=0)


class Player(db.Entity):
    id_player = PrimaryKey(int, auto=True)
    nickname = Optional(str)
    match = Required(Match)
    user = Required(User)
    suffrage = Optional(str, default='withoutVote')
    secretRole = Optional(str)
    isAlive = Optional(bool, default=True, sql_default='1')
    loyalty = Optional(str)
    govermment_role = Optional(str, default='no_role')
    position_player = Optional(int)
    creation_date = Optional(datetime.datetime,
                             default=datetime.datetime.now())
    last_update = Optional(datetime.datetime)


class Card(db.Entity):
    id_card = PrimaryKey(int, auto=True)
    match = Optional(Match)
    proclamation = Required(str)
    discarded_card = Optional(bool, default=False, sql_default='0')
    proclamed_round = Optional(int, sql_default='0', default=0)
    position_deck = Required(int)
    turn = Optional(int, sql_default='0', default=0)


class Government(db.Entity):
    id_government = PrimaryKey(int, auto=True)
    match = Required(Match)
    magicMinister = Optional(str, unique=True)
    director = Optional(str, unique=True)
    gameTurn = Optional(int, sql_default='0', default=0)
    electionMarker = Optional(int, sql_default='0', default=0)


class Board(db.Entity):
    id_board = PrimaryKey(int, auto=True)
    number_proclamation_mortifagate = Optional(int, sql_default='0', default=0)
    number_proclamation_order_fenix = Optional(int, sql_default='0', default=0)
    winner = Optional(str)
    match = Required(Match)
    spells = Set('Spell')


class Spell(db.Entity):
    id_spell = PrimaryKey(int, auto=True)
    board = Required(Board)
    spell_name = Optional(str)
    spell_description = Optional(str)


db.bind('sqlite', 'alfabeta.sqlite', create_db=True)  # 1
db.generate_mapping(create_tables=True)  # 2
