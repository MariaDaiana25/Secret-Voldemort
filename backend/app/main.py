import sys
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from pydantic import BaseModel, Field
from fastapi_jwt_auth import AuthJWT
from business.business_user import crear_usuario, validar_existencia_usuario, \
    obtener_nombre_usuario
from business.business_match import crear_match, ejecutar_hechizo, \
    unirse_match, definir_roles, obtener_informacion_jugadores, \
    cantidad_jugadores_partida, votacion_gobierno, cambiar_estado_partida_1, \
    validar_ministro_director, inicializando_partida, define_secret_role, \
    obtener_state_match, mostrar_mortifagos, conteo_votos, \
    resultado_votacion, detalle_votos, actualizar_gobierno, extraer_carta, \
    obtener_informacion_partidas, descartar_cartas, proclamar, \
    validar_proclamaciones, obtener_turno, cambiar_turno, obtener_state_game, \
    obtener_marcador_elecciones, count_result, extraer_carta_director, \
    descartar_cartas_D, obtener_numeros_proclamaciones, obtener_ganador_juego,  \
    cambiar_estado_juego
sys.path.append('../business')


class UsuarioDTO(BaseModel):
    user_name: Optional[str] = None
    password: str
    email: str
    state_user: Optional[str]
    creation_date: Optional[str]
    last_update_date: Optional[str]
    photo: Optional[str]


class UserLogin(BaseModel):
    email: str = Field(..., min_length=1)
    password: str = Field(..., min_length=1)


class MatchDTO(BaseModel):
    state_match: Optional[str] = None
    name_match: str
    nickname: str
    position_player: Optional[str] = None
    suffrage: Optional[str] = None
    secret_role: Optional[str] = None
    isAlive: Optional[str] = None
    loyally: Optional[str] = None
    govermment_role: Optional[str] = None
    user_name: Optional[str] = None


app = FastAPI()

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["DELETE", "GET", "POST", "PUT"],
    allow_headers=["*"]
)


@app.post("/alfabeta/registrar_usuario")
async def create_usuario(usuario: UsuarioDTO):
    try:
        crear_usuario(usuario)
        return {"codigo": 0, "mensaje": "OK"}
    except Exception as error:
        return {"codigo": -1, "mensaje": "Email ya se encuentra registrado"}


@app.post('/alfabeta/login', status_code=200)
def login(user: UserLogin, Authorize: AuthJWT = Depends()):
    if validar_existencia_usuario(user.email, user.password) == 1:
        access_token = Authorize.create_access_token(identity=user.email)
        return {"codigo": 0, "token": access_token, "mensaje": "OK",
                "user_name": obtener_nombre_usuario(user.email)}
    else:
        return {"codigo": -1, "token": " ", "mensaje": "Correo o "
                "Contraseña Mal Ingresado"}


@app.get('/alfabeta/protected', status_code=200)
def protected(Authorize: AuthJWT = Depends()):

    Authorize.jwt_required()
    current_user = Authorize.get_jwt_identity()

    return {"codigo": 0, "detail": current_user}


@app.post("/alfabeta/crear_partida", status_code=200)
async def crearPartida(match: MatchDTO, Authorize: AuthJWT = Depends()):

    Authorize.jwt_required()
    match.position_player = "1"
    respuesta_crear_match = crear_match(match)
    if(respuesta_crear_match == 0):
        return {"codigo": 0, "mensaje": "Partida Creada"}
    elif(respuesta_crear_match == -2):
        return {"codigo": -2, "mensaje": "NOK user_name no existe"}
    elif(respuesta_crear_match == -1):
        return {"codigo": -1, "mensaje": "NOK Partida ya existe"}


@app.post("/alfabeta/unirse_partida", status_code=200)
async def unirsePartida(match: MatchDTO, Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    codigoRespuesta = unirse_match(match)
    if (codigoRespuesta > 0):
        return {"codigo": 0, "mensaje": "OK Jugador " + match.nickname +
                " Unido a Partida " + match.name_match,
                "position_player": codigoRespuesta}

    elif(codigoRespuesta == -1):
        return {"codigo": -1, "mensaje": "NOK Partida No existe",
                "position_player": 0}
    elif(codigoRespuesta == -3):
        return {"codigo": -3, "mensaje": "nickname ya existe en partida",
                "position_player": 0}
    elif(codigoRespuesta == -4):
        return {"codigo": -4, "mensaje": "user_name no existe",
                "position_player": 0}
    elif(codigoRespuesta == -5):
        return {"codigo": -5, "mensaje": "user_name ya se encuentra jugando en la partida",
                "position_player": 0}
    else:
        return {"codigo": -2, "mensaje": "NOK Partida ya completada",
                "position_player": -1}


@app.put('/alfabeta/define_role/{name_match}/{position_player}/{type_rol}',
         status_code=200)
def definir_role(name_match: str, position_player: int, type_rol: int,
                 Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    id_player = definir_roles(name_match, position_player, type_rol)
    if (id_player > 0):
        return {"codigo": 0, "mensaje": "OK", "id_player": id_player}
    elif(id_player == -2):
        return {"codigo": -2, "mensaje": "Rol seleccionado no existe"}
    else:
        return {"codigo": -1, "mensaje": "NOK", "id_player": -1}


@app.get("/alfabeta/obtener_datos/{name_match}", status_code=200)
async def informacion_partida(name_match: str, Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    player = obtener_informacion_jugadores(name_match)
    cantidad_jugadores = cantidad_jugadores_partida(name_match)
    estado_partida = obtener_state_match(name_match)
    nro_turno = obtener_turno(name_match)
    marcador_elecciones = obtener_marcador_elecciones(name_match)
    state_game = obtener_state_game(name_match)
    nro_mortifago = obtener_numeros_proclamaciones(name_match, 1)
    nro_fenix = obtener_numeros_proclamaciones(name_match, 2)
    winner = obtener_ganador_juego(name_match)
    return {"codigo": 0, "mensaje": "OK",
            "cantidad_jugadores": cantidad_jugadores,
            "state_match": estado_partida,
            "gameTurn": nro_turno,
            "electionMarker":  marcador_elecciones,
            "state_game":  state_game,
            "number_proclamation_mortifagate": nro_mortifago,
            "number_proclamation_order_fenix": nro_fenix,
            "winner": winner,
            "jugadores": player}


@app.put('/alfabeta/votacion/{name_match}/{position_player}/{vote}',
         status_code=200)
def definir_voto(name_match: str, position_player: int, vote: int,
                 Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    resultado = votacion_gobierno(name_match, position_player, vote)
    actualizar_gobierno(name_match)
    if (resultado == 0):
        return {"codigo": 0, "mensaje": "OK"}
    elif(resultado == -2):
        return {"codigo": -2, "mensaje": "No existe posicion player o murio"}
    elif(resultado == -3):
        return {"codigo": -3, "mensaje": "No existe Match"}
    elif(resultado == -4):
        return {"codigo": -4, "mensaje": "No existe candidato Ministro"}
    elif(resultado == -5):
        return {"codigo": -5, "mensaje": "No existe candidato Director"}
    elif(resultado == -6):
        return {"codigo": -6, "mensaje": "Jugador ya voto"}
    elif(resultado == -7):
        return {"codigo": -7, "mensaje": "Voto elegido no valido"}


@app.put('/alfabeta/cambiar_estado_partida/{name_match}/{state_match}',
         status_code=200)
def cambiar_estado_partida(name_match: str, state_match: int,
                           Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    estado = cambiar_estado_partida_1(name_match, state_match)
    if (estado == 0):
        return {"codigo": 0, "mensaje": "OK"}
    else:
        return {"codigo": -1, "mensaje": "NOK"}


@app.get("/alfabeta/validar_gobierno/{name_match}", status_code=200)
async def validar_gobierno(name_match: str, Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    validar_mm_director = validar_ministro_director(name_match)
    if(validar_mm_director == -3):
        return {"codigo": -3, "mensaje": "No existe Match"}
    elif(validar_mm_director == -4):
        return {"codigo": -4, "mensaje": "No existe candidato Ministro"}
    elif(validar_mm_director == -5):
        return {"codigo": -5, "mensaje": "No existe candidato Director"}
    else:
        return {"codigo": 0, "mensaje": "OK",
                "candidates": validar_mm_director}


@app.put('/alfabeta/init_game/{name_match}/{nickname}', status_code=200)
def iniciar_partida(name_match: str, nickname: str,
                    Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    validar_iniciar_partida = inicializando_partida(name_match, nickname)
    if (validar_iniciar_partida == 0):
        return {"codigo": 0, "mensaje": "OK"}
    elif(validar_iniciar_partida == -1):
        return {"codigo": -1, "mensaje": "No existe posicion player"}
    elif(validar_iniciar_partida == -2):
        return {"codigo": -2, "mensaje": "Falta completar player en Partida"}
    elif(validar_iniciar_partida == -3):
        return {"codigo": -3, "mensaje": "No existe Match"}
    elif(validar_iniciar_partida == -4):
        return {"codigo": -4, "mensaje": "Baraja ya esta insertada"}
    elif(validar_iniciar_partida == -5):
        return {"codigo": -5, "mensaje": "No existe Match"}
    elif(validar_iniciar_partida == -6):
        return {"codigo": -6, "mensaje": "Player no puede iniciar Partida, ya que no es creador de partida"}


@app.put('/alfabeta/define_secret_role/{name_match}', status_code=200)
def definir_roles_secreto(name_match: str, Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    validar_secrete_role = define_secret_role(name_match)
    if (validar_secrete_role == 0):
        return {"codigo": 0, "mensaje": "OK"}
    elif(validar_secrete_role == -1):
        return {"codigo": -1, "mensaje": "No existe Match"}
    elif(validar_secrete_role == -2):
        return {"codigo": -2, "mensaje": "Falta completar player en Partida"}


@app.get("/alfabeta/view_rol_mortifagate/{name_match}/{position_player}",
         status_code=200)
async def mostrar_roles_mortifagos(name_match: str, position_player: int,
                                   Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    validar_mortifago = mostrar_mortifagos(name_match, position_player)
    if(validar_mortifago == -1):
        return {"codigo": -1, "mensaje": "No existe Match"}
    elif(validar_mortifago == -2):
        return {"codigo": -2, "mensaje": "No es Mortifago"}
    else:
        return {"codigo": 0, "mensaje": "OK", "mortifagate": validar_mortifago}


@app.get("/alfabeta/number_players/{name_match}", status_code=200)
async def cantidad_jugadores(name_match: str, Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    cantidad_jugadores = cantidad_jugadores_partida(name_match)
    if(cantidad_jugadores == 0):
        return {"codigo": -1, "mensaje": "No existe match"}
    else:
        return {"codigo": 0, "mensaje": "OK",
                "cantidad_jugadores": cantidad_jugadores}


@app.get("/alfabeta/get_status_match/{name_match}", status_code=200)
async def obtener_estado_partida(name_match: str,
                                 Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    estado_partida = obtener_state_match(name_match)
    if(estado_partida == -1):
        return {"codigo": -1, "mensaje": "No existe match"}
    else:
        return {"codigo": 0, "mensaje": "OK",
                "state_match": estado_partida}


@app.get("/alfabeta/view_results/{name_match}", status_code=200)
async def mostrar_resultados(name_match: str, Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    conteo = conteo_votos(name_match)
    detalle = detalle_votos(name_match)
    cantidad_jugadores = cantidad_jugadores_partida(name_match)
    resultado = resultado_votacion(name_match)
    if(conteo == -1):
        return {"codigo": -1, "mensaje": "No existe match"}
    elif(conteo < cantidad_jugadores):
        return {"codigo": -2, "mensaje": "Falta completar votación"}
    else:
        return {"codigo": 0, "mensaje": "OK", "votos": conteo,
                "votacion_ganadora": resultado, "detalle_votos": detalle}


@app.get("/alfabeta/list_match", status_code=200)
async def listar_partidas(Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    listar_partidas = obtener_informacion_partidas()
    return {"codigo": 0, "mensaje": "OK", "match": listar_partidas}


@app.get("/alfabeta/extraer_cartas/{name_match}/{position_player}",
         status_code=200)
async def extract_cards(name_match: str, position_player: int,
                        Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    listar_partidas = extraer_carta(name_match, position_player)
    if (listar_partidas == -1):
        return {"codigo": -1, "mensaje": "Player no es MM para extraer"}
    else:
        return {"codigo": 0, "mensaje": "OK", "list_card": listar_partidas}


@app.put('/alfabeta/descartar_carta/{name_match}/{position_deck}/{nickname}',
         status_code=200)
def discard_card(name_match: str, position_deck: int, nickname: str,
                 Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    resultado_descartar = descartar_cartas(name_match, position_deck,
                                           nickname)
    if (resultado_descartar == 0):
        return {"codigo": 0, "mensaje": "OK"}
    elif(resultado_descartar == -1):
        return {"codigo": -1, "mensaje": "No existe position_deck en match"}
    elif(resultado_descartar == -2):
        return {"codigo": -2, "mensaje": "No existe match"}
    elif(resultado_descartar == -3):
        return {"codigo": -3, "mensaje":
                "Jugador no tiene permiso para descartar"}
    elif(resultado_descartar == -4):
        return {"codigo": -4, "mensaje":
                "Jugador ya realizo el descarte"}


@app.put('/alfabeta/proclamar_carta/{name_match}/{position_deck}/{nickname}',
         status_code=200)
def proclamation_card(name_match: str, position_deck: int, nickname: str,
                      Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    resultado_proclamar = proclamar(name_match, position_deck,
                                    nickname)
    if (resultado_proclamar == 0):
        return {"codigo": 0, "mensaje": "OK"}
    elif(resultado_proclamar == -1):
        return {"codigo": -1, "mensaje": "No existe position_deck en match"}
    elif(resultado_proclamar == -2):
        return {"codigo": -2, "mensaje": "No existe match"}
    elif(resultado_proclamar == -3):
        return {"codigo": -3, "mensaje":
                "Jugador no tiene permiso para proclamar"}
    elif(resultado_proclamar == -4):
        return {"codigo": -4, "mensaje":
                "Jugador ya realizo la proclamacion"}


@app.get("/alfabeta/spell_guess/{name_match}/{nickname}/{position_player}",
         status_code=200)
async def hechizo_adivinacion(name_match: str, nickname: str,
                              position_player: int,
                              Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    resultado_hechizo = ejecutar_hechizo(name_match, nickname,
                                         position_player, 1)
    if (resultado_hechizo == -3):
        return {"codigo": -3, "mensaje":
                "Proclamacion de Mortifigate menor a 3"}
    elif(resultado_hechizo == -1):
        return {"codigo": -1, "mensaje": "No existe match"}
    elif(resultado_hechizo == -2):
        return {"codigo": -2, "mensaje": "No existe proclamaciones"}
    else:
        return {"codigo": 0, "mensaje": "OK", "list_card": resultado_hechizo}


@app.put("/alfabeta/spell_avada/{name_match}/{nickname}/{position_player}",
         status_code=200)
async def hechizo_avada_kedavra(name_match: str, nickname: str,
                                position_player: int,
                                Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    resultado_hechizo = ejecutar_hechizo(name_match, nickname,
                                         position_player, 2)
    if (resultado_hechizo == -3):
        return {"codigo": -3, "mensaje":
                "Proclamacion de Mortifigate menor a 4"}
    elif(resultado_hechizo == -2):
        return {"codigo": -2, "mensaje": "No existe board"}
    elif(resultado_hechizo == -1):
        return {"codigo": -1, "mensaje": "No existe match"}
    elif(resultado_hechizo == 0):
        return {"codigo": 0, "mensaje": "OK fin del juego"}
    elif(resultado_hechizo == 1):
        return {"codigo": 1, "mensaje": "OK Jugador elegido murio en batalla"}


@app.put("/alfabeta/count_result/{name_match}/{vote}",
         status_code=200)
async def contar_resultado(name_match: str, vote: str,
                           Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    resultado = count_result(name_match, vote)
    if (resultado == 0):
        return {"codigo": 0, "mensaje": "OK"}
    elif(resultado == -1):
        return {"codigo": -1, "mensaje": "No existe match"}


@app.get("/alfabeta/extraer_cartas_director/{name_match}/{position_player}/{turn}",
         status_code=200)
async def extract_cards_director(name_match: str, position_player: int,
                                 turn: int, Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    listar_partidas = extraer_carta_director(name_match, position_player, turn)
    if (listar_partidas == -1):
        return {"codigo": -1, "mensaje": "Player no es MM para extraer"}
    else:
        return {"codigo": 0, "mensaje": "OK", "list_card": listar_partidas}


@app.put('/alfabeta/descartar_carta_D/{name_match}/{position_deck}/{nickname}',
         status_code=200)
def discard_card_director(name_match: str, position_deck: int, nickname: str,
                          Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    resultado_descartar = descartar_cartas_D(name_match, position_deck,
                                             nickname)
    if (resultado_descartar == 0):
        return {"codigo": 0, "mensaje": "OK"}
    elif(resultado_descartar == -1):
        return {"codigo": -1, "mensaje": "No existe position_deck en match"}
    elif(resultado_descartar == -2):
        return {"codigo": -2, "mensaje": "No existe match"}
    elif(resultado_descartar == -3):
        return {"codigo": -3, "mensaje":
                "Jugador no tiene permiso para descartar"}
    elif(resultado_descartar == -4):
        return {"codigo": -4, "mensaje":
                "Jugador ya realizo el descarte"}


@app.put("/alfabeta/cambiar_estado_game/{name_match}/{state_game}",
         status_code=200)
async def change_state_game(name_match: str, state_game: int,
                            Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    resultado = cambiar_estado_juego(name_match, state_game)
    if (resultado == 0):
        return {"codigo": 0, "mensaje": "OK"}
    elif(resultado == -1):
        return {"codigo": -1, "mensaje": "No existe match"}