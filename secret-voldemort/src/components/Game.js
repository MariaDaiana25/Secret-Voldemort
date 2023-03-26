import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { get_data_players } from "../actions/data";
import { govermment_role } from "../actions/govermment_role";
import useInterval from "./UseInterval";
import Swal from 'sweetalert2';

import Board from "./Board";
import InitGame from "./InitGame";
import DefineDirector from "./DefineDirector";
import Vote from "./Vote"
import ShowVotes from "./ShowVotes";
import DiscadMM from "./DiscardMM";
import DiscadD from "./DiscardD";
import Guess from "./Guess";
import Avada from "./Avada";
import FinishGame from "./FinishGame";
import {
  DIRECTOR_REMOVE
} from "../actions/types";

import "./css/Game.css";

const Game = () => {

  const { isMatchIn } = useSelector((state) => state.match);
  const { isJoinMatchIn } = useSelector((state) => state.join_match);
  const { player: currentPlayerOne } = useSelector((state) => state.match);
  const { player: currentPlayer } = useSelector((state) => state.join_match);
  const { state_game } = useSelector((state) => state.data);
  const { game_turn } = useSelector((state) => state.data);
  const { number_proclamation_order_fenix } = useSelector((state) => state.data);
  const { number_proclamation_mortifagate } = useSelector((state) => state.data);
  const { winner } = useSelector((state) => state.data);
  const { players: currentPlayers } = useSelector((state) => state.data);
  const { election_marker } = useSelector((state) => state.data);
  const { init_game } = useSelector((state) => state.init_game);
  const [ runShowRoles, setrunShowRoles ] = useState(true);
  // nicknamePlayer corresponde al nickname del jugador que se le presenta el Juego
  const [nicknamePlayer, setnicknamePlayer] = useState("");
  // postionPlayer corresponde a la posicion del jugador que se le presenta el Juego
  const [postionPlayer, setpositionPlayer] = useState(0);

  const dispatch = useDispatch();
 
  useInterval(() => {
    dispatch(get_data_players(currentPlayerOne.name_match));
  }, (init_game) ? (isMatchIn ? 1000 : null) : null);

  useInterval(() => {
    dispatch(get_data_players(currentPlayer.name_match));
  }, (init_game) ? (isJoinMatchIn ? 1000 : null) : null);

  if(runShowRoles && Array.isArray(currentPlayers) && currentPlayers.length && init_game) {
    if(isMatchIn) {
      let nickname = currentPlayerOne.nickname;
      setnicknamePlayer(nickname);
      let position_player = currentPlayerOne.position_player;
      setpositionPlayer(position_player);
      let player = currentPlayers.filter((player) =>
          (player.nickname === nickname) && (player.position_player === position_player)
      );
      let player_peer = currentPlayers.filter((player) =>
          (player.loyalty === "Mortifagate") && (player.nickname !== nickname)
      );
      let secret_role = player[0].secret_role;
      let loyalty = player[0].loyalty;
      let peer = ""; 
      if(loyalty !== 'OrderFenix') {
        peer = player_peer[0].nickname;
      }
      Swal.fire({title:"Bienvenido: " + nickname +
          "\nTu lealtad es a: " + loyalty +
          "\nY tu rol: " + secret_role + 
          "\n" + peer + " es tu compañero",
          background:'#000000f5'});
        setrunShowRoles(false);
    };

    if(isJoinMatchIn) {
      let nickname = currentPlayer.nickname;
      setnicknamePlayer(nickname);
      let position_player = currentPlayer.position_player;
      setpositionPlayer(position_player);
      let player = currentPlayers.filter((player) =>
          (player.nickname === nickname) && (player.position_player === position_player)
      );
      let player_peer = currentPlayers.filter((player) =>
          (player.loyalty === "Mortifagate") && (player.nickname !== nickname)
      );
      let secret_role = player[0].secret_role;
      let loyalty = player[0].loyalty;
      let peer = ""; 
      if(loyalty !== 'OrderFenix') {
        peer = player_peer[0].nickname;
      }
      Swal.fire({title:"Bienvenido: " + nickname +
          "\nTu lealtad es a: " + loyalty +
          "\nY tu rol: " + secret_role + 
          "\n" + peer + " es tu compañero",
          background:'#000000f5'});
        setrunShowRoles(false);
      };
    };
  
  

  if(3 === election_marker) {
    dispatch(govermment_role(DIRECTOR_REMOVE, "", ""));
  };

    return (
      <div className="all-container">
        <div className="windows-players">   
          <div className="list-players">
              <h3 className="players">Players</h3>
              { (Array.isArray(currentPlayers) && currentPlayers.length) ? 
                    currentPlayers.map((player, index) => {
                        return (
                          <div>
                            <p className="list-Nicknames" key={index}>
                              <b className="Nicknames">{player.nickname} </b>: {player.govermment_role}
                            </p>
                          </div>
                        )
                    }
                ) : (null)
              }
          </div>
        </div>
        <div>
          {
            {
              INIT_GAME: <InitGame />,
              DEFINE_DIRECTOR: <DefineDirector namePlayer={nicknamePlayer} Players={currentPlayers} />,
              VOTACION: <Vote Players={currentPlayers} />,
              SHOW_VOTACION: <ShowVotes Players={currentPlayers} />,
              DISCARD_MM: <DiscadMM namePlayer={nicknamePlayer} positionPlayer={postionPlayer} Players={currentPlayers} /> ,
              DISCARD_D: <DiscadD namePlayer={nicknamePlayer} positionPlayer={postionPlayer} gameTurn={game_turn} Players={currentPlayers} /> ,
              GUESS: <Guess namePlayer={nicknamePlayer} positionPlayer={postionPlayer} Players={currentPlayers} />,
              AVADA: <Avada namePlayer={nicknamePlayer} Players={currentPlayers} />,
              FINISH_GAME: <FinishGame winnerGame={winner} />
            }[state_game]
          }
        </div>
        <Board procMortifago={number_proclamation_mortifagate} procOrdFenix={number_proclamation_order_fenix} />
        <h5 className="marcador">
          Marcador de elecciones: <b className="cantidad-marcador"> {election_marker} </b>
          Ronda: <b className="cantidad-marcador"> {game_turn} </b>
        </h5>
      </div>
    );
};

export default Game;
