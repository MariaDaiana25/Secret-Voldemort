import {
    SET_MESSAGE,
    DATA_GAME_SUCCESS,
    DATA_GAME_FAIL,
} from "./types";

import DataService from "../services/data.services";

export const get_data_players = (name_match) => (dispatch) => {
    return DataService.get_data_players(name_match).then(
      (data) => {
        if (0 === data.codigo) {
          dispatch({
            type: DATA_GAME_SUCCESS,
            payload: { 
                name_match: name_match,
                max_players: data.cantidad_jugadores,
                state_match: data.state_match,
                game_turn: data.gameTurn,
                election_marker: data.electionMarker,
                state_game: data.state_game,
                number_proclamation_mortifagate: data.number_proclamation_mortifagate,
                number_proclamation_order_fenix: data.number_proclamation_order_fenix,
                winner: data.winner,
                players: data.jugadores
             },
          });
          return Promise.resolve(data.state_game);
        } else {
          dispatch({
          type: DATA_GAME_FAIL,
        });
          return Promise.reject();
        }
      }, (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
  
        dispatch({
          type: DATA_GAME_FAIL,
        });
        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });
        return Promise.reject(error);
      }
    );
  };