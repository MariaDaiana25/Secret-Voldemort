import {
    SET_MESSAGE,
    PROCLAMATION_SUCCESS,
    PROCLAMATION_FAIL,
} from "./types";

import ProclamationService from "../services/auth.services";

export const proclamation = (name_match, position_deck, nickname) => (dispatch) => {
  return ProclamationService.proclamation(name_match, position_deck, nickname).then(
    (data) => {
      if (0 === data.codigo) {
        dispatch({
          type: PROCLAMATION_SUCCESS
        });
        return Promise.resolve(); 
      } else {
        dispatch({
        type: PROCLAMATION_FAIL
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
        type: PROCLAMATION_FAIL
      });
      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });
      return Promise.reject(error);
    }
  );
};
  