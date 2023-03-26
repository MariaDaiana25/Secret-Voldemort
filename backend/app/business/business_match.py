"""
Created on Thu Oct 22 21:04:35 2020

@author: alfaBeta

"""
import sys
from pony.orm import db_session, select, count
from dao.entities_user import User, Match, Player, Card, Government, Board
from random import shuffle, sample
sys.path.append('../dao')


@db_session
def crear_match(match):
    id_user = obtener_id_user_name(match.user_name)
    if (id_user == 0):
        return -2
    contar_partida = validar_existencia_partida(match)
    if (contar_partida > 0):
        return -1
    identificador_partida = Match(name_match=match.name_match,
                                  state_match='waiting')
    Player(match=identificador_partida, user=id_user,
           nickname=match.nickname, position_player=match.position_player)
    return 0


@db_session
def validar_existencia_partida(match):
    return count(s for s in Match if s.name_match == match.name_match)


@db_session
def unirse_match(match):
    id_match = obtener_id_match(match.name_match)
    id_user = obtener_id_user_name(match.user_name)
    if (id_user == 0):
        return -4
    p = 0
    p = count(s for s in Player if int(s.match) == int(id_match))
    if (select(s.id_player for s in Player
               if int(s.match) == id_match
               and s.nickname == match.nickname).exists()):
        return -3
    else:
        max_player = 0
        max_player = select(int(s.max_player) for s in Match
                            if int(s.name_match) == match.name_match).first()
        min_player = 0
        min_player = select(int(s.max_player) for s in Match
                            if int(s.name_match) == match.name_match).first()
        id_user_name = select(s.id_user for s in User
                              if s.user_name == match.user_name).first()
        if (select(s.id_player for s in Player if int(s.match) == id_match
                   and int(s.user) == int(id_user_name) and s.isAlive == 1).exists()):
            return -5
        else:
            if (p > 0 and p < 5):
                nuevaPosicion = int(p+1)
                match.position_player = str(nuevaPosicion)
                Player(match=id_match, user=id_user, nickname=match.nickname,
                       position_player=match.position_player)
                return nuevaPosicion
                return nuevaPosicion
            elif(p == 0):
                return -1
            else:
                return -2


@db_session
def obtener_id_match(name_match: str):
    contar_match = count(s for s in Match if s.name_match == name_match)
    if (contar_match == 0):
        return 0
    else:
        return select(p.id_match for p in Match
                      if p.name_match == name_match).first()


@db_session
def definir_roles(name_match: str, position_player: int, type_rol: int):
    id_match = obtener_id_match(name_match)
    if (select(s.id_player for s in Player
               if int(s.match) == id_match
               and s.position_player == position_player and s.isAlive == 1).exists()):
        id_player = select(s.id_player for s in Player
                           if int(s.match) == id_match
                           and s.position_player == position_player and s.isAlive == 1).first()
        player = Player[id_player]
        if (type_rol == 1):
            player.set(govermment_role='MagicMinister')
        elif(type_rol == 2):
            player.set(govermment_role='Director')
        elif(type_rol == 3):
            player.set(govermment_role='sorcerer')
        elif(type_rol == 4):
            player.set(govermment_role='candidateDirector')
            cambiar_estado_juego(name_match, 2)
        elif(type_rol == 5):
            player.set(govermment_role='candidateMagicMinister')
        else:
            return -2
    else:
        id_player = -1
    return id_player


@db_session
def obtener_informacion_jugadores(name_match: str):
    id_match = obtener_id_match(name_match)
    lista_player = []
    if (id_match > 0):
        player = select(s for s in Player if int(s.match) == id_match
                        and s.isAlive == 1)
        for jugador in player:
            lista_player.append({"nickname": jugador.nickname,
                                 "position_player":
                                     int(jugador.position_player),
                                     "govermment_role":
                                         jugador.govermment_role,
                                     "secret_role": jugador.secretRole,
                                     "loyalty": jugador.loyalty})
    return lista_player


@db_session
def cantidad_jugadores_partida(name_match: str):
    id_match = obtener_id_match(name_match)
    return count(s for s in Player if int(s.match) == id_match
                 and s.isAlive == 1)


@db_session
def votacion_gobierno(name_match: str, position_player: str, vote: int):
    id_match = obtener_id_match(name_match)
    if (id_match > 0):
        if (select(s.id_player for s in Player
                   if int(s.match) == id_match
                   and s.position_player == position_player
                   and s.isAlive == 1).exists()):
            if (select(s.id_player for s in Player if int(s.match) == id_match
                       and s.govermment_role == 'candidateMagicMinister').exists()):
                if (select(s.id_player for s in Player if int(s.match) == id_match
                           and s.govermment_role == 'candidateDirector').exists()):
                    if (select(s.id_player for s in Player
                               if int(s.match) == id_match
                               and s.position_player == position_player
                               and (s.suffrage == 'Nox'
                                    or s.suffrage == 'Lumus')).exists()):
                        return -6
                    else:
                        id_player = select(s.id_player for s in Player
                                           if int(s.match) == id_match
                                           and
                                           s.position_player == position_player).first()
                        player = Player[id_player]
                        cambiar_estado_juego(name_match, 2)
                        if (vote == 0):
                            player.set(suffrage='Nox')
                            return 0
                        elif(vote == 1):
                            player.set(suffrage='Lumus')
                            return 0
                        elif(vote == 2):
                            player.set(suffrage='withoutVote')
                            return 0
                        else:
                            return -7
                else:
                    return -5
            else:
                return -4
        else:
            return -2
    else:
        return -3


@db_session
def cambiar_estado_partida_1(name_match: str, state_match: int):
    id_match = obtener_id_match(name_match)
    if (id_match > 0):
        match = Match[id_match]
        if (state_match == 1):
            match.set(state_match='inProgress')
            return 0
        elif(state_match == 2):
            match.set(state_match='finilazed')
            return 0
        elif(state_match == 3):
            match.set(state_match='waiting')
    else:
        return -1


@db_session
def obtener_id_user_name(user_name: str):
    contar_user = count(s for s in User if s.user_name == user_name)
    if (contar_user == 0):
        return 0
    else:
        return select(p.id_user for p in User
                      if p.user_name == user_name).first()


@db_session
def validar_ministro_director(name_match: str):
    id_match = obtener_id_match(name_match)
    lista_player = []
    if (id_match > 0):
        if (select(s.id_player for s in Player if int(s.match) == id_match
                   and s.govermment_role
                   == 'candidateMagicMinister').exists()):
            player = select(s for s in Player if int(s.match) == id_match
                            and s.govermment_role == 'candidateMagicMinister')
            for jugador in player:
                lista_player.append({"candidateMagicMinister":
                                     jugador.nickname,
                                     "position_player":
                                         int(jugador.position_player)})
            if (select(s.id_player for s in Player if int(s.match) == id_match
                       and s.govermment_role == 'candidateDirector').exists()):
                player = select(s for s in Player if int(s.match) == id_match
                                and s.govermment_role == 'candidateDirector')
                for jugador in player:
                    lista_player.append({"candidateDirector":
                                         jugador.nickname,
                                         "position_player":
                                             int(jugador.position_player)})
                return lista_player
            else:
                return -5
        else:
            return -4
    else:
        return -3


@db_session
def deck(name_match: str):
    id_match = obtener_id_match(name_match)
    discarded_card = 0
    proclamed_round = 0
    i = 0
    l = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
    shuffle(l)
    del l[6:]
    while i < 17:
        i = i + 1
        if(i in l):
            Card(match=id_match,
                 proclamation="Orden del Fenix",
                 discarded_card=discarded_card,
                 proclamed_round=proclamed_round,
                 position_deck=i)
        else:
            Card(match=id_match,
                 proclamation="Mortifagos",
                 discarded_card=discarded_card,
                 proclamed_round=proclamed_round,
                 position_deck=i)


@db_session
def inicializando_partida(name_match: str, nickname: str):
    id_match = obtener_id_match(name_match)
    max_player = select(int(s.max_player) for s in Match
                        if s.id_match == id_match).first()
    if (id_match > 0):
        if(select(s.position_player for s in Player
                  if int(s.match) == id_match
                  and s.nickname == nickname)).exists():
            position_player_ = select(s.position_player for s in Player
                                      if int(s.match) == id_match
                                      and s.nickname == nickname).first()
            if(position_player_ == 1):
                if (cantidad_jugadores_partida(name_match) == max_player):
                    if (select(s for s in Card if int(s.match) == id_match).exists()):
                        return -4
                    else:
                        id_player = definir_roles(name_match, 1, 5)
                        if (id_player > 0):
                            deck(name_match)
                            salida_secret_role = define_secret_role(name_match)
                            if (salida_secret_role == 0):
                                Government(match=id_match, gameTurn=1)
                                cambiar_estado_partida_1(name_match, 1)
                                cambiar_estado_juego(name_match, 1)
                                return 0
                            else:
                                return salida_secret_role
                        else:
                            return -1
                else:
                    return -2
            else:
                return -6
        else:
            return -1
    return -3


@db_session
def define_secret_role(name_match: str):
    id_match = obtener_id_match(name_match)
    if (id_match > 0):
        lista_player = []
        if (cantidad_jugadores_partida(name_match) == 5):
            player = select(s.id_player for s in Player
                            if int(s.match) == id_match)
            for jugador in player:
                lista_player.append(jugador)
            lista_player = sample(lista_player, k=5)
            for x in range(0, 3):
                player = Player[lista_player[x]]
                player.set(secretRole='OrderFenix')
                player.set(loyalty='OrderFenix')
            for x in range(3, 4):
                player = Player[lista_player[x]]
                player.set(secretRole='Mortifagate')
                player.set(loyalty='Mortifagate')
            for x in range(4, 5):
                player = Player[lista_player[x]]
                player.set(secretRole='Voldemort')
                player.set(loyalty='Mortifagate')
            return 0
        else:
            return -2
    else:
        return -1


@db_session
def conteo_votos(name_match: str):
    id_match = obtener_id_match(name_match)
    if (id_match > 0):
        return count(s for s in Player if int(s.match) == id_match
                     and (s.suffrage == 'Lumus' or s.suffrage == 'Nox')
                     and s.isAlive == 1)
    else:
        return -1


@db_session
def obtener_state_match(name_match: str):
    id_match = obtener_id_match(name_match)
    if (id_match > 0):
        return select(p.state_match for p in Match
                      if p.id_match == id_match).first()
    else:
        return -1


@db_session
def mostrar_mortifagos(name_match: str, position_player: int):
    id_match = obtener_id_match(name_match)
    if (id_match > 0):
        if (select(s for s in Player if int(s.match) == id_match
                   and s.loyalty == 'Mortifagate'
                   and s.position_player == position_player).exists()):
            lista_player = []
            player = select(s for s in Player if int(s.match) == id_match
                            and s.loyalty == 'Mortifagate')
            for jugador in player:
                lista_player.append({"nickname": jugador.nickname,
                                     "position_player":
                                         int(jugador.position_player)})
            return lista_player
        else:
            return -2
    else:
        return -1


@db_session
def resultado_votacion_2(name_match: str):
    id_match = obtener_id_match(name_match)
    if (id_match > 0):
        vote_lumus = count(s for s in Player if int(s.match) == id_match
                           and s.suffrage == 'Lumus' and s.isAlive == 1)
        vote_nox = count(s for s in Player if int(s.match) == id_match
                         and s.suffrage == 'Nox' and s.isAlive == 1)
        if (vote_lumus > vote_nox):
            contador_resultado = select(s.is_result_lumus for s in Match
                                        if int(s.id_match) == id_match).first()
            if(contador_resultado < 5):
                if(contador_resultado == 4):
                    cambiar_estado_juego(name_match, 6)
                else:
                    actualizar_ver_resultados(name_match, 1)
            return 'Lumus'
        elif (vote_lumus == vote_nox):
            contador_resultado = select(s.is_result_nox for s in Player
                                        if int(s.id_match) == id_match).first()
            if(contador_resultado < 5):
                if(contador_resultado == 4):
                    cambiar_estado_juego(name_match, 1)
                else:
                    actualizar_ver_resultados(name_match, 0)
            return 'Nox'
        else:
            contador_resultado = select(s.is_result_nox for s in Player
                                        if int(s.id_match) == id_match).first()
            if(contador_resultado < 5):
                if(contador_resultado == 4):
                    cambiar_estado_juego(name_match, 1)
                else:
                    actualizar_ver_resultados(name_match, 0)
            return 'Nox'
    else:
        return -1


@db_session
def detalle_votos(name_match: str):
    id_match = obtener_id_match(name_match)
    if (id_match > 0):
        lista_voto = []
        votacion = select(s for s in Player if int(s.match) == id_match
                          and s.isAlive == 1)
        for lista_votacion in votacion:
            lista_voto.append({"nickname": lista_votacion.nickname,
                               "suffrage": lista_votacion.suffrage})
        return lista_voto
    else:
        return -1


@db_session
def actualizar_gobierno(name_match: str):
    conteo = conteo_votos(name_match)
    id_match = obtener_id_match(name_match)
    nro_jugadores_partida = cantidad_jugadores_partida(name_match)
    if (conteo == int(nro_jugadores_partida)):
        resultado = resultado_votacion(name_match)
        id_match = obtener_id_match(name_match)
        id_government = select(s.id_government for s in Government
                               if int(s.match) == id_match).first()
        government = Government[id_government]
        if (resultado == 'Lumus'):
            candidato_ministro = select(s.nickname for s in Player
                                        if int(s.match) == id_match
                                        and s.govermment_role ==
                                        'candidateMagicMinister').first()
            position_player_mm = select(s.position_player for s in Player
                                        if int(s.match) == id_match
                                        and s.govermment_role ==
                                        'candidateMagicMinister').first()
            candidato_director = select(s.nickname for s in Player
                                        if int(s.match) == id_match
                                        and s.govermment_role ==
                                        'candidateDirector').first()
            position_player_director = select(s.position_player for s in Player
                                              if int(s.match) == id_match
                                              and s.govermment_role ==
                                              'candidateDirector').first()
            government.set(magicMinister=candidato_ministro)
            government.set(director=candidato_director)
            government.set(electionMarker=0)
            definir_roles(name_match, position_player_mm, 1)
            definir_roles(name_match, position_player_director, 2)
            cambiar_estado_juego(name_match, 3)
            return 0
        elif(resultado == 'Nox'):
            cambiar_estado_juego(name_match, 3)
            return -1
    else:
        return -2


@db_session
def obtener_informacion_partidas():
    lista_partidas = []
    partidas = select(s for s in Match if s.state_match == 'waiting')
    for match in partidas:
        numero_jugadores = cantidad_jugadores_partida(match.name_match)
        if(numero_jugadores < 5):
            lista_partidas.append({"name_match": match.name_match,
                                   "state_match": match.state_match,
                                   "number_player": numero_jugadores})
    return lista_partidas


@db_session
def obtener_informacion_gobierno(name_match: str, position_player: int):
    id_match = obtener_id_match(name_match)
    if (id_match > 0):
        if (select(s.nickname for s in Player if int(s.match) == id_match
                   and s.position_player == position_player).exists()):
            nickname = select(s.nickname for s in Player
                              if int(s.match) == id_match
                              and s.position_player == position_player).first()
            if (select(s.magicMinister for s in Government
                       if int(s.match) == id_match
                       and s.magicMinister == nickname).exists()):
                return 1
            else:
                return -2
            if (select(s.director for s in Government
                       if int(s.match) == id_match
                       and s.director == nickname).exists()):
                return 2
            else:
                return -3
    else:
        return -1


@db_session
def extraer_carta(name_match: str, position_player: int):
    validacion_gobierno = obtener_informacion_gobierno(name_match,
                                                       position_player)
    if(validacion_gobierno == 1):
        id_match = obtener_id_match(name_match)
        posicion_inicial = select((min(s.position_deck)) for s in Card
                                  if int(s.match) == id_match
                                  and s.discarded_card == 0
                                  and s.proclamed_round == 0).first()
        lista_cartas = []
        if (posicion_inicial == 16):
            lista_cartas = []
            i = int(posicion_inicial)
            while (i < (int(posicion_inicial)+2)):
                carta = select(s for s in Card if int(s.match) == id_match
                               and s.position_deck == i)
                for card in carta:
                    carta = Card[card.id_card]
                    carta.set(turn=obtener_turno(name_match))
                    lista_cartas.append({"proclamation": card.proclamation,
                                         "position_deck": card.position_deck})
                i = i + 1
            carta = select(s for s in Card if int(s.match) == id_match
                           and s.position_deck == 1)
            for card in carta:
                carta = Card[card.id_card]
                carta.set(turn=obtener_turno(name_match))
                lista_cartas.append({"proclamation": card.proclamation,
                                     "position_deck": card.position_deck})
            carta = select(s for s in Card if int(s.match) == id_match)
            for card in carta:
                carta = Card[card.id_card]
                carta.set(discarded_card=0)
                carta.set(proclamed_round=0)
        elif (posicion_inicial == 17):
            lista_cartas = []
            carta = select(s for s in Card if int(s.match) == id_match
                           and s.position_deck == 17)
            for card in carta:
                carta = Card[card.id_card]
                carta.set(turn=obtener_turno(name_match))
                lista_cartas.append({"proclamation": card.proclamation,
                                     "position_deck": card.position_deck})
            i = 1
            while (i < 3):
                carta = select(s for s in Card if int(s.match) == id_match
                               and s.position_deck == i)
                for card in carta:
                    carta = Card[card.id_card]
                    carta.set(turn=obtener_turno(name_match))
                    lista_cartas.append({"proclamation": card.proclamation,
                                         "position_deck": card.position_deck})
                i = i + 1
            carta = select(s for s in Card if int(s.match) == id_match)
            for card in carta:
                carta = Card[card.id_card]
                carta.set(discarded_card=0)
                carta.set(proclamed_round=0)
        else:
            i = int(posicion_inicial)
            while (i < (int(posicion_inicial)+3)):
                carta = select(s for s in Card if int(s.match) == id_match
                               and s.position_deck == i)
                for card in carta:
                    carta = Card[card.id_card]
                    carta.set(turn=obtener_turno(name_match))
                    lista_cartas.append({"proclamation": card.proclamation,
                                         "position_deck": card.position_deck})
                i = i + 1
        return lista_cartas
    else:
        return -1


@db_session
def descartar_cartas(name_match: str, position_deck: int, nickname: str):
    id_match = obtener_id_match(name_match)
    if (id_match > 0):
        if (select(s for s in Government if int(s.match) == id_match
                   and (s.magicMinister == nickname
                        or s.director == nickname)).exists()):
            if (select(s.id_card for s in Card if int(s.match) == id_match
                       and s.position_deck == position_deck).exists()):
                if (select(s.id_card for s in Card if int(s.match) == id_match
                           and s.position_deck == position_deck
                           and s.discarded_card == 0).exists()):
                    id_card = select(s.id_card for s in Card
                                     if int(s.match) == id_match
                                     and s.position_deck
                                     == position_deck).first()
                    carta = Card[id_card]
                    carta.set(discarded_card=1)
                    cambiar_estado_juego(name_match, 7)
                else:
                    return -4
                return 0
            else:
                return -1
        else:
            return -3
    else:
        return -2


@db_session
def proclamar(name_match: str, position_deck: int, nickname: str):
    id_match = obtener_id_match(name_match)
    if (id_match > 0):
        if (select(s for s in Government if int(s.match) == id_match
                   and s.director == nickname).exists()):
            if (select(s.id_card for s in Card if int(s.match) == id_match
                       and s.position_deck == position_deck).exists()):
                if (select(s.id_card for s in Card if int(s.match) == id_match
                           and s.position_deck == position_deck
                           and s.proclamed_round == 0).exists()):
                    id_card = select(s.id_card for s in Card
                                     if int(s.match) == id_match
                                     and s.position_deck
                                     == position_deck).first()
                    nro_turn = select(s.id_government for s in Government
                                      if int(s.match) == id_match).first()
                    carta = Card[id_card]
                    carta.set(proclamed_round=nro_turn)
                    if (select(s for s in Board
                               if int(s.match) == id_match).exists()):
                        id_board = select(s.id_board for s in Board
                                          if int(s.match) == id_match).first()
                        proclamation = select(s.proclamation for s in Card
                                              if int(s.match) == id_match
                                              and s.position_deck
                                              == position_deck).first()
                        nro_mortifago = obtener_numeros_proclamaciones(name_match, 1)
                        nro_fenix = obtener_numeros_proclamaciones(name_match, 2)
                        if (proclamation == 'Orden del Fenix' and nro_fenix < 6):
                            isLiveVoldemort = select(s.isAlive for s in Player
                                                     if int(s.match) == id_match
                                                     and s.secretRole == 'Voldemort').first()
                            if (isLiveVoldemort == 0 or int(nro_fenix) == 5):
                                id_board = select(s.id_board for s in Board
                                                  if int(s.match) == id_match).first()
                                board = Board[id_board]
                                board.set(winner='Orden del Fenix')
                                cambiar_estado_juego(name_match, 4)
                                cambiar_estado_partida_1(name_match, 2)
                            else:
                                cantidad_proclamacion = select(
                                    s.number_proclamation_order_fenix
                                    for s in Board
                                    if int(s.match) == id_match).first()
                                board = Board[id_board]
                                board.set(number_proclamation_order_fenix=cantidad_proclamacion + 1)
                                cambiar_estado_juego(name_match, 1)
                                cambiar_turno(name_match)
                        elif(proclamation == 'Mortifagos' and nro_mortifago < 2):
                            cantidad_proclamacion = select(s.number_proclamation_mortifagate for s in Board if int(s.match) == id_match).first()
                            board = Board[id_board]
                            board.set(number_proclamation_mortifagate=cantidad_proclamacion + 1)
                            cambiar_estado_juego(name_match, 1)
                            cambiar_turno(name_match)
                        elif(proclamation == 'Mortifagos' and nro_mortifago >= 2):
                            cantidad_proclamacion = select(s.number_proclamation_mortifagate for s in Board if int(s.match) == id_match).first()
                            board = Board[id_board]
                            board.set(number_proclamation_mortifagate=cantidad_proclamacion + 1)
                            if (nro_mortifago == 5 or is_voldemort_director(name_match) == 0):
                                id_board = select(s.id_board for s in Board
                                                  if int(s.match) == id_match).first()
                                board = Board[id_board]
                                board.set(winner='Mortifagos')
                                cambiar_estado_juego(name_match, 4)
                                cambiar_estado_partida_1(name_match, 2)
                            else:
                                if(nro_mortifago == 2):
                                    cambiar_estado_juego(name_match, 8)
                                elif(nro_mortifago == 3 or nro_mortifago == 4):
                                    cambiar_estado_juego(name_match, 9)
                    else:
                        proclamation = select(s.proclamation for s in Card if int(s.match) == id_match and s.position_deck == position_deck).first()
                        if (proclamation == 'Orden del Fenix'):
                            Board(number_proclamation_order_fenix=1,
                                  match=id_match)
                            cambiar_turno(name_match)
                            cambiar_estado_juego(name_match, 1)
                        else:
                            Board(number_proclamation_mortifagate=1,
                                  match=id_match)
                            cambiar_turno(name_match)
                            cambiar_estado_juego(name_match, 1)
                else:
                    return -4
                return 0
            else:
                return -1
        else:
            return -3
    else:
        return -2


@db_session
def ejecutar_hechizo(name_match: str, nickname: str, position_player: int,
                     tipo_hechizo: int):
    id_match = obtener_id_match(name_match)
    if (id_match > 0):
        if(tipo_hechizo == 1):  # Adivinacion
            if(select(s for s in Board if int(s.match) == id_match).exists()):
                cantidad_proclamacion = select(
                    s.number_proclamation_mortifagate for s in Board
                    if int(s.match) == id_match).first()
                if(cantidad_proclamacion == 3):
                    cambiar_turno(name_match)                   
                    return extraer_carta_hechizo(name_match, position_player)
                else:
                    return -3
            else:
                return -2
        elif(tipo_hechizo == 2):  # Avada Kedavra
            if(select(s for s in Board if int(s.match) == id_match).exists()):
                cantidad_proclamacion = select(s.number_proclamation_mortifagate for s in Board if int(s.match) == id_match).first()
                if(cantidad_proclamacion == 4 or cantidad_proclamacion == 5):
                    if(select(s for s in Player if int(s.match) == id_match
                              and s.secretRole == 'Voldemort'
                              and s.position_player == position_player).exists()):
                        cambiar_estado_partida_1(name_match, 2)
                        cambiar_estado_juego(name_match, 4)
                        id_board = select(s.id_board for s in Board
                                          if int(s.match) == id_match).first()
                        board = Board[id_board]
                        board.set(winner='Orden del Fenix')
                        return 0
                    else:
                        print("HOLA")
                        print(position_player)
                        id_player = select(s.id_player for s in Player
                                           if int(s.match) == id_match
                                           and s.position_player == position_player).first()
                        print(id_player)
                        player = Player[id_player]
                        player.set(isAlive=0)
                        print("HOLA 2")
                        cambiar_turno(name_match)
                        print("HOLA 3")
                        cambiar_estado_juego(name_match, 1)
                        print("HOLA 4")
                        return 1
                else:
                    return -3
            else:
                return -2
    else:
        return -1


@db_session
def reiniciar_votacion(name_match: str):
    id_match = obtener_id_match(name_match)
    if (id_match > 0):
        player = select(s for s in Player if int(s.match) == id_match)
        for jugador in player:
            player = Player[jugador.id_player]
            player.set(suffrage='withoutVote')
        return 0
    else:
        return -1


@db_session
def reiniciar_govermment_role(name_match: str):
    id_match = obtener_id_match(name_match)
    if (id_match > 0):
        player = select(s for s in Player if int(s.match) == id_match)
        for jugador in player:
            player = Player[jugador.id_player]
            player.set(govermment_role='no_role')
        return 0
    else:
        return -1


@db_session
def is_voldemort_director(name_match: str):
    id_match = obtener_id_match(name_match)
    if (id_match > 0):
        if(select(s for s in Player if int(s.match) == id_match
                  and s.secretRole == 'Voldemort' and
                  s.govermment_role == 'Director'
                  and s.isAlive == 1).exists()):
            return 0
        else:
            return -2
    else:
        return -1


@db_session
def validar_proclamaciones(name_match: str):
    id_match = obtener_id_match(name_match)
    if (id_match > 0):
        if(select(s for s in Board if int(s.match) == id_match).exists()):
            board = select(s for s in Board if int(s.match) == id_match)
            nro_fenix = 0
            nro_mortifago = 0
            isVoldemort = select(s.isAlive for s in Player
                                 if int(s.match) == id_match
                                 and s.secretRole == 'Voldemort').first()
            id_board = select(s.id_board for s in Board
                              if int(s.match) == id_match).first()
            for lista_board in board:
                nro_fenix = lista_board.number_proclamation_order_fenix
                nro_mortifago = lista_board.number_proclamation_mortifagate
            if (int(nro_fenix) == 5 or isVoldemort == 0):
                cambiar_estado_partida_1(name_match, 2)
                board = Board[id_board]
                board.set(winner='Orden del Fenix')
            elif(int(nro_mortifago) == 6 or is_voldemort_director == 0):
                cambiar_estado_partida_1(name_match, 2)
                board = Board[id_board]
                board.set(winner='Mortifagos')
            else:
                id_government = select(s.id_government for s in Government
                                       if int(s.match) == id_match).first()
                nro_turn = select(s.gameTurn for s in Government
                                  if int(s.match) == id_match).first()
                government = Government[id_government]
                government.set(gameTurn=nro_turn+1)
                reiniciar_votacion(name_match)
                id_mm = select(s.position_player for s in Player
                               if int(s.match) == id_match
                               and s.govermment_role == 'MagicMinister').first()
                reiniciar_govermment_role(name_match)
                definir_roles(name_match, int(id_mm) + 1, 5)
            return 0
        else:
            return -2
    return -1


@db_session
def obtener_turno(name_match: str):
    id_match = obtener_id_match(name_match)
    if (id_match > 0):
        if(select(s for s in Government if int(s.match) == id_match).exists()):
            nro_turno = select(s.gameTurn for s in Government
                               if int(s.match) == id_match).first()
            return nro_turno
        else:
            return -2
    else:
        return -1


@db_session
def cambiar_turno(name_match: str):
    id_match = obtener_id_match(name_match)
    if (id_match > 0):
        if(select(s for s in Board if int(s.match) == id_match).exists()):
            id_government = select(s.id_government for s in Government
                                   if int(s.match) == id_match).first()
            nro_turn = select(s.gameTurn for s in Government
                              if int(s.match) == id_match).first()
            government = Government[id_government]
            government.set(gameTurn=nro_turn+1)
            reiniciar_votacion(name_match)
            id_mm = select(s.position_player for s in Player
                           if int(s.match) == id_match
                           and s.govermment_role == 'MagicMinister' and s.isAlive == 1).first()
            reiniciar_govermment_role(name_match)
            if(id_mm == 5):
                if(select(s for s in Player if int(s.match) == id_match and s.position_player == 1 and s.isAlive == 1).exists()):
                    definir_roles(name_match, 1, 5)
                elif(select(s for s in Player if int(s.match) == id_match and s.position_player == 2 and s.isAlive == 1).exists()):
                    definir_roles(name_match, 2, 5)
                elif(select(s for s in Player if int(s.match) == id_match and s.position_player == 3 and s.isAlive == 1).exists()):
                    definir_roles(name_match, 3, 5)
                elif(select(s for s in Player if int(s.match) == id_match and s.position_player == 4 and s.isAlive == 1).exists()):
                    definir_roles(name_match, 4, 5)
            else:
                if(select(s for s in Player if int(s.match) == id_match and s.position_player == (int(id_mm) + 1) and s.isAlive == 1).exists()):
                    definir_roles(name_match, int(id_mm) + 1, 5)
                elif(select(s for s in Player if int(s.match) == id_match and s.position_player == (int(id_mm) + 2) and s.isAlive == 1).exists()):
                    definir_roles(name_match, int(id_mm) + 2, 5)
                elif(select(s for s in Player if int(s.match) == id_match and s.position_player == (int(id_mm) + 3) and s.isAlive == 1).exists()):
                    definir_roles(name_match, int(id_mm) + 3, 5)
                elif(select(s for s in Player if int(s.match) == id_match and s.position_player == (int(id_mm) + 4) and s.isAlive == 1).exists()):
                    definir_roles(name_match, int(id_mm) + 4, 5)
            reiniciar_is_result(name_match)
            return 0
        else:
            return -2
    return -1


@db_session
def obtener_marcador_elecciones(name_match: str):
    id_match = obtener_id_match(name_match)
    if (id_match > 0):
        if(select(s for s in Government if int(s.match) == id_match).exists()):
            electionMarker = select(s.electionMarker for s in Government
                                    if int(s.match) == id_match).first()
            return electionMarker
        else:
            return -2
    else:
        return -1


@db_session
def obtener_state_game(name_match: str):
    id_match = obtener_id_match(name_match)
    if (id_match > 0):
        return select(p.state_game for p in Match
                      if p.id_match == id_match).first()
    else:
        return -1


@db_session
def cambiar_estado_juego(name_match: str, state_game: int):
    id_match = obtener_id_match(name_match)
    if (id_match > 0):
        match = Match[id_match]
        if (state_game == 1):
            match.set(state_game='DEFINE_DIRECTOR')
            return 0
        elif(state_game == 2):
            match.set(state_game='VOTACION')
            return 0
        elif(state_game == 3):
            match.set(state_game='SHOW_VOTACION')
            return 0
        elif(state_game == 4):
            match.set(state_game='FINISH_GAME')
            return 0
        elif(state_game == 5):
            match.set(state_game='PROCLAMATION')
            return 0
        elif(state_game == 6):
            match.set(state_game='DISCARD_MM')
            return 0
        elif(state_game == 7):
            match.set(state_game='DISCARD_D')
            return 0
        elif(state_game == 8):
            match.set(state_game='GUESS')
            return 0
        elif(state_game == 9):
            match.set(state_game='AVADA')
            return 0
    else:
        return -1


@db_session
def actualizar_ver_resultados(name_match: str, type_resultado: int):
    id_match = obtener_id_match(name_match)    
    if (id_match > 0):
        match = Match[id_match]
        if(type_resultado == 0):
            contador_resultado = select(s.is_result_nox for s in Match
                                        if int(s.id_match) == id_match).first()
            match.set(is_result_nox=contador_resultado+1)
        else:
            contador_resultado = select(s.is_result_lumus for s in Match
                                        if int(s.id_match) == id_match).first()
            match.set(is_result_lumus=contador_resultado+1)
    else:
        return -1


@db_session
def resultado_votacion(name_match: str):
    id_match = obtener_id_match(name_match)
    if (id_match > 0):
        vote_lumus = count(s for s in Player if int(s.match) == id_match
                           and s.suffrage == 'Lumus' and s.isAlive == 1)
        vote_nox = count(s for s in Player if int(s.match) == id_match
                         and s.suffrage == 'Nox' and s.isAlive == 1)
        if (vote_lumus > vote_nox):
            return 'Lumus'
        elif (vote_lumus == vote_nox):
            return 'Nox'
        else:
            return 'Nox'
    else:
        return -1


@db_session
def reiniciar_is_result(name_match: str):
    id_match = obtener_id_match(name_match)
    if (id_match > 0):
        match = Match[id_match]
        match.set(is_result_lumus=0)
        match.set(is_result_nox=0)
        return 0
    else:
        return -1


@db_session
def count_result(name_match: str, vote: str):
    id_match = obtener_id_match(name_match)
    if (id_match > 0):
        if (vote == 'Lumus'):
            contador_resultado = select(s.is_result_lumus for s in Match
                                        if int(s.id_match) == id_match).first()
            if(contador_resultado < 5):
                if(contador_resultado == 4):
                    cambiar_estado_juego(name_match, 6)
                actualizar_ver_resultados(name_match, 1)
        else:  # Nox
            contador_resultado = select(s.is_result_nox for s in Match
                                        if int(s.id_match) == id_match).first()            
            if(contador_resultado < 5):
                if(contador_resultado == 4):
                    id_government = select(s.id_government for s in Government
                                           if int(s.match) == id_match).first()
                    government = Government[id_government]
                    government.set(electionMarker=government.electionMarker+1)
                    cambiar_estado_juego(name_match, 1)                    
                    cambiar_turno_nox(name_match)                    
                actualizar_ver_resultados(name_match, 0)
        return 0
    else:
        return -1


@db_session
def extraer_carta_director(name_match: str, position_player: int, turn: int):
    validacion_gobierno = obtener_informacion_gobierno_director(name_match,
                                                                position_player)
    if(validacion_gobierno == 1):
        id_match = obtener_id_match(name_match)
        carta = select(s for s in Card if int(s.match) == id_match
                       and s.turn == turn and s.discarded_card == 0
                       and s.proclamed_round == 0)
        lista_cartas = []
        for card in carta:
            carta = Card[card.id_card]
            carta.set(turn=obtener_turno(name_match))
            lista_cartas.append({"proclamation": card.proclamation,
                                 "position_deck": card.position_deck})
        return lista_cartas
    else:
        return -1


@db_session
def obtener_informacion_gobierno_director(name_match: str, position_player: int):
    id_match = obtener_id_match(name_match)
    if (id_match > 0):
        if (select(s.nickname for s in Player if int(s.match) == id_match
                   and s.position_player == position_player).exists()):
            nickname = select(s.nickname for s in Player
                              if int(s.match) == id_match
                              and s.position_player == position_player).first()
            if (select(s.director for s in Government
                       if int(s.match) == id_match
                       and s.director == nickname).exists()):
                return 1
            else:
                return -3
    else:
        return -1


@db_session
def descartar_cartas_D(name_match: str, position_deck: int, nickname: str):
    id_match = obtener_id_match(name_match)
    if (id_match > 0):
        if (select(s for s in Government if int(s.match) == id_match
                   and (s.magicMinister == nickname
                        or s.director == nickname)).exists()):
            if (select(s.id_card for s in Card if int(s.match) == id_match
                       and s.position_deck == position_deck).exists()):
                if (select(s.id_card for s in Card if int(s.match) == id_match
                           and s.position_deck == position_deck
                           and s.discarded_card == 0).exists()):
                    id_card = select(s.id_card for s in Card
                                     if int(s.match) == id_match
                                     and s.position_deck
                                     == position_deck).first()
                    carta = Card[id_card]
                    carta.set(discarded_card=1)
                else:
                    return -4
                return 0
            else:
                return -1
        else:
            return -3
    else:
        return -2


@db_session
def obtener_numeros_proclamaciones(name_match: str, type_proclamation: int):
    id_match = obtener_id_match(name_match)
    if (id_match > 0):
        nro_carta = 0
        if (type_proclamation == 1):
            nro_carta = select(s.number_proclamation_mortifagate
                               for s in Board
                               if int(s.match) == id_match).first()
        else:
            nro_carta = select(s.number_proclamation_order_fenix for s in Board
                               if int(s.match) == id_match).first()
        return nro_carta
    else:
        return -1


@db_session
def extraer_carta_hechizo(name_match: str, position_player: int):
    validacion_gobierno = obtener_informacion_gobierno(name_match,
                                                       position_player)
    if(validacion_gobierno == 1):
        id_match = obtener_id_match(name_match)
        posicion_inicial = select((min(s.position_deck)) for s in Card
                                  if int(s.match) == id_match
                                  and s.discarded_card == 0
                                  and s.proclamed_round == 0).first()
        lista_cartas = []
        if (posicion_inicial == 16):
            lista_cartas = []
            i = int(posicion_inicial)
            while (i < (int(posicion_inicial)+2)):
                carta = select(s for s in Card if int(s.match) == id_match
                               and s.position_deck == i)
                for card in carta:
                    lista_cartas.append({"proclamation": card.proclamation,
                                         "position_deck": card.position_deck})
                i = i + 1
            carta = select(s for s in Card if int(s.match) == id_match
                           and s.position_deck == 1)
            for card in carta:
                lista_cartas.append({"proclamation": card.proclamation,
                                     "position_deck": card.position_deck})
        elif (posicion_inicial == 17):
            lista_cartas = []
            carta = select(s for s in Card if int(s.match) == id_match
                           and s.position_deck == 17)
            for card in carta:
                lista_cartas.append({"proclamation": card.proclamation,
                                     "position_deck": card.position_deck})
            i = 1
            while (i < 3):
                carta = select(s for s in Card if int(s.match) == id_match
                               and s.position_deck == i)
                for card in carta:
                    lista_cartas.append({"proclamation": card.proclamation,
                                         "position_deck": card.position_deck})
                i = i + 1
            carta = select(s for s in Card if int(s.match) == id_match)
        else:
            i = int(posicion_inicial)
            while (i < (int(posicion_inicial)+3)):
                carta = select(s for s in Card if int(s.match) == id_match
                               and s.position_deck == i)
                for card in carta:
                    lista_cartas.append({"proclamation": card.proclamation,
                                         "position_deck": card.position_deck})
                i = i + 1
        return lista_cartas
    else:
        return -1


@db_session
def cambiar_turno_nox(name_match: str):
    id_match = obtener_id_match(name_match)
    if (id_match > 0):
        if(select(s for s in Board if int(s.match) == id_match).exists()):
            id_government = select(s.id_government for s in Government
                                   if int(s.match) == id_match).first()            
            nro_turn = select(s.gameTurn for s in Government
                              if int(s.match) == id_match).first()
            government = Government[id_government]
            government.set(gameTurn=nro_turn+1)
            reiniciar_votacion(name_match)
            id_mm = select(s.position_player for s in Player
                           if int(s.match) == id_match
                           and s.govermment_role == 'candidateMagicMinister').first()
            reiniciar_govermment_role(name_match)
            if(id_mm == 5):
                definir_roles(name_match, 1, 5)
            else:
                definir_roles(name_match, int(id_mm) + 1, 5)
            reiniciar_is_result(name_match)
            return 0
        else:
            id_government = select(s.id_government for s in Government
                                   if int(s.match) == id_match).first()    
            nro_turn = select(s.gameTurn for s in Government
                              if int(s.match) == id_match).first()
            government = Government[id_government]
            government.set(gameTurn=nro_turn+1)
            reiniciar_votacion(name_match)
            id_mm = select(s.position_player for s in Player
                           if int(s.match) == id_match
                           and s.govermment_role == 'candidateMagicMinister').first()
            reiniciar_govermment_role(name_match)
            if(id_mm == 5):
                definir_roles(name_match, 1, 5)
            else:
                definir_roles(name_match, int(id_mm) + 1, 5)
            reiniciar_is_result(name_match)
            return 0
    return -1


@db_session
def obtener_ganador_juego(name_match: str):
    id_match = obtener_id_match(name_match)
    if (id_match > 0):
        return select(p.winner for p in Board
                      if int(p.match) == id_match).first()
    else:
        return ''
