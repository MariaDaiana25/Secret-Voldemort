import {
    SET_MESSAGE,
    CREATE_MATCH_SUCCESS,
    CREATE_MATCH_FAIL,
} from "./types";

import AuthService from "../services/match.services";

export const match = (name_match, nickname, user_name) => (dispatch) => {
    return AuthService.match(name_match, nickname, user_name).then(
      (data) => {
        if (0 === data.codigo) {
          dispatch({
            type: CREATE_MATCH_SUCCESS,
            payload: { name_match: name_match, nickname: nickname },
          });
          return Promise.resolve();
        } else {
          dispatch({
          type: CREATE_MATCH_FAIL,
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
          type: CREATE_MATCH_FAIL,
        });
        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });
        return Promise.reject();
      }
    );
  };