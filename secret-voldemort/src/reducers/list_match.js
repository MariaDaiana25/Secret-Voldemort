import {
    LIST_MATCH_SUCCESS,
    LIST_MATCH_FAIL
} from "../actions/types";

const list_match = JSON.parse(localStorage.getItem("list_match"));
const initialState = { matchs: list_match };


export default function (state = initialState, action) {
  const { type, payload  } = action;

  switch (type) {
    case LIST_MATCH_SUCCESS:
      return {
        ...state,
        matchs: payload.matchs
      };
    case LIST_MATCH_FAIL:
      return {
        ...state,
      }
    default:
      return state;
  }
}