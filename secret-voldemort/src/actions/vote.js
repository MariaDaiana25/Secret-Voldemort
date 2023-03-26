import {
    SET_MESSAGE,
    VOTE_SUCCESS,
    VOTE_FAIL,
    VOTE_VALIDATION,
    VOTE_VALIDATION_FAIL
} from "./types";

import VoteService from "../services/votes.services";

export const suffrage = (name_match, position_player, vote) => (dispatch) => {
    return VoteService.suffrage(name_match, position_player, vote).then(
      (data) => {
        if (0 === data.codigo) {
          dispatch({
            type: VOTE_SUCCESS,
          });
          return Promise.resolve();
        } else {
          dispatch({
            type: VOTE_FAIL,
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
          type: VOTE_FAIL,
        });
        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });
        return Promise.reject(error);
      }
    );
  };

export const validar_gobierno = (name_match) => (dispatch) => {
  return VoteService.validar_gobierno(name_match).then(
    (data) => {
      if (0 === data.codigo) {
        dispatch({
          type: VOTE_VALIDATION,
        });
        return Promise.resolve();
      } else {
        dispatch({
          type: VOTE_VALIDATION_FAIL,
      });
        return Promise.reject(data.mensaje);
      }
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: VOTE_VALIDATION_FAIL,
      });
      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });
      return Promise.reject(error);
    }
  );
};