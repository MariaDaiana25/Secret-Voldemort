import {
    SET_MESSAGE,
    LIST_MATCH_SUCCESS,
    LIST_MATCH_FAIL
} from "./types";

import ListMatchService from "../services/match.services";

export const list_match = () => (dispatch) => {
  return ListMatchService.list_match().then(
    (data) => {
      if (0 === data.codigo) {
        dispatch({
          type: LIST_MATCH_SUCCESS,
          payload: {
              matchs: data.match
          }
        });
        return Promise.resolve(data.match);
      } else {
        dispatch({
          type: LIST_MATCH_FAIL,
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
        type: LIST_MATCH_FAIL,
      });
      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });
      return Promise.reject();
    }
  );
};
