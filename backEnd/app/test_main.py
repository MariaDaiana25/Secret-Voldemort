from fastapi.testclient import TestClient
from main import app
from fastapi_jwt_auth import AuthJWT
from fastapi import FastAPI, Depends, HTTPException
import random
import string

client = TestClient(app)


def test_registrar_usuario():
    response = client.post("/alfabeta/registrar_usuario",
                           json={"user_name": "fsadfasf", "password": "d",
                                 "email": ''.join
                                 ((random.choice("sample_letters")
                                   for i in range(10)))+"@gmail.com",
                                 "state_user": "sssss", "photo": "dddd"})
    assert response.status_code == 200
    assert response.json() == {"codigo": "0", "mensaje": "OK"}


def test_registrar_usuario_existe_usuario():
    response = client.post("/alfabeta/registrar_usuario",
                           json={"user_name": "fsadfasf", "password": "d",
                                 "email": "d", "state_user": "sssss",
                                 "photo": "dddd"})
    assert response.status_code == 200
    assert response.json() == {"codigo": "-1",
                               "mensaje": "Email ya se encuentra registrado"}


def test_login_usuario():
    response = client.post("/alfabeta/login",
                           json={"email": "d", "password": "d"})
    assert response.status_code == 200


def test_login_fallido_usuario():
    response = client.post("/alfabeta/login",
                           json={"email": "dddd", "password": "ddd"})
    assert response.status_code == 200
    assert response.json() == {"codigo": "-1", "token": " ",
                               "mensaje": "Correo o Contraseña Mal Ingresado"}


def test_crear_partida_fallida_no_autorizado():
    response = client.post("/alfabeta/crear_partida",
                           json={"name_match": "test999",
                                 "state_match": "Waiting ", "nickname": "pwp"})
    assert response.status_code == 401
