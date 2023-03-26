"""
Created on Thu Oct 22 21:04:35 2020

@author: alfaBeta

"""
import sys
from pony.orm import db_session, select, count
from dao.entities_user import User
from hashlib import md5
sys.path.append('../dao')


@db_session
def crear_usuario(usuario):
    User(user_name=usuario.user_name,
         password=encriptar_password(usuario.password),
         email=usuario.email, state_user=usuario.state_user,
         photo=usuario.photo)


@db_session
def validar_existencia_usuario(email: str, password: str):
    return count(s for s in User if s.email == email and
                 s.password == encriptar_password(password))


@db_session
def encriptar_password(password: str):
    return md5(password.encode("utf-8")).hexdigest()


@db_session
def obtener_nombre_usuario(email: str):
    return select(p.user_name for p in User if p.email == email).first()
