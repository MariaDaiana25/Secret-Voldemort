import {
    SET_MESSAGE,
    INIT_GAME_SUCCESS,
    INIT_GAME_FAIL,
    NUMBER_PLAYERS_SUCCESS,
    NUMBER_PLAYERS_FAIL,
    STATE_MATCH_SUCCESS,
    STATE_MATCH_FAIL,
} from "./types";

import InitService from "../services/init.services";

  export const init_game_join = () => (dispatch) => {
    dispatch({
      type: INIT_GAME_SUCCESS
    })
  };

  export const init_game = (name_match, nickname) => (dispatch) => {
    return InitService.init_game(name_match, nickname).then(
      (data) => {
        if (0 === data.codigo) {
          dispatch({
            type: INIT_GAME_SUCCESS,
          });
          return Promise.resolve();
        } else {
          dispatch({
          type: INIT_GAME_FAIL,
        });
          return Promise.reject(data.mensaje);
        }
      }, (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
  
        dispatch({
          type: INIT_GAME_FAIL,
        });
        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });
        return Promise.reject(error);
      }
    );
  };

  export const number_players = (name_match) => (dispatch) => {
    return InitService.number_players(name_match).then(
      (data) => {
        if (0 === data.codigo) {
          dispatch({
            type: NUMBER_PLAYERS_SUCCESS,
          });
          return Promise.resolve(data.cantidad_jugadores);
        } else {
          dispatch({
          type: NUMBER_PLAYERS_FAIL,
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
          type: NUMBER_PLAYERS_FAIL,
        });
        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });
        return Promise.reject(error);
      }
    );
  };

  export const get_status_match = (name_match) => (dispatch) => {
    return InitService.get_status_match(name_match).then(
      (data) => {
        if (0 === data.codigo) {
          dispatch({
            type: STATE_MATCH_SUCCESS,
          });
          return Promise.resolve(data.state_match);
        } else {
          dispatch({
          type: STATE_MATCH_FAIL,
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
          type: STATE_MATCH_FAIL,
        });
        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });
        return Promise.reject(error);
      }
    );
  };
