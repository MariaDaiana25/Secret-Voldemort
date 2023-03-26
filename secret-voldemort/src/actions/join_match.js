import {
    SET_MESSAGE,
    JOIN_MATCH_SUCCESS,
    JOIN_MATCH_FAIL
} from "./types";

import AuthService from "../services/match.services";

export const join_match = (name_match, nickname, user_name) => (dispatch) => {
  return AuthService.join_match(name_match, nickname, user_name).then(
    (data) => {
      if (0 === data.codigo) {
        dispatch({
          type: JOIN_MATCH_SUCCESS,
          payload: {
              name_match: name_match,
              nickname: nickname,
              position_player: data.position_player 
          }
        });
        return Promise.resolve();
      } else {
        dispatch({
          type: JOIN_MATCH_FAIL,
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
        type: JOIN_MATCH_FAIL,
      });
      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });
      return Promise.reject();
    }
  );
};
