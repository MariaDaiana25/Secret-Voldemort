import React, {useState} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { init_game, init_game_join ,number_players, get_status_match } from "../actions/init_game";
import useInterval from "./UseInterval";
import Swal from 'sweetalert2';

import "./css/InitGame.css";

const InitGame = () => {
    const { isMatchIn } = useSelector((state) => state.match);
    const { isJoinMatchIn } = useSelector((state) => state.join_match);
    const { player: currentPlayerOne } = useSelector((state) => state.match);
    const { player: currentPlayer } = useSelector((state) => state.join_match);
    const [gameReady, SetgameReady] = useState(false);
    const [gameReadyJoin, SetgameReadyJoin] = useState(false);
    const [showButton, SetshowButton] = useState(true);
    const MAX_PLAYERS = 5;
    const STATUS_MATCH = "inProgress";
    const dispatch = useDispatch();

    useInterval(() => {
        dispatch(number_players(currentPlayerOne.name_match))
        .then((max_players) => {
            if(MAX_PLAYERS === max_players) {
                SetgameReady(true);
            }
        })
        .catch((error) => {
            Swal.fire({title:error,icon:'error',background:'#000000f5'});
        });
    }, (gameReady) ? null : ((isMatchIn) ? 1000 : null));

    useInterval(() => {
        dispatch(get_status_match(currentPlayer.name_match))
        .then((status_match) => {
            if(STATUS_MATCH === status_match) {
                dispatch(init_game_join());
                SetgameReadyJoin(true);
            }
        })
        .catch((error) => {
            Swal.fire({title:error,icon:'error',background:'#000000f5'});
        });
    }, (gameReadyJoin) ? null : ((isJoinMatchIn) ? 1000 : null));

    const handleInit = () => {
        if(gameReady && isMatchIn) {
            dispatch(init_game(currentPlayerOne.name_match, currentPlayerOne.nickname))
            .then(() => {
                Swal.fire({title:'Que comienze el juego',background:'#000000f5'});
                SetshowButton(false);
            })
            .catch((data_error) => {
                Swal.fire({title:data_error, background:'#000000f5'});
            });
        }
    }

    return(
        
        (isMatchIn && gameReady && showButton) ?
            <button className="button-initgame" onClick={handleInit} type="button">
                Init Game
            </button>
        :
        null
        
    );
}

export default InitGame;
