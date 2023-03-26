import {
    CREATE_MATCH_SUCCESS,
    CREATE_MATCH_FAIL
  } from "../actions/types";
    
  const match = JSON.parse(localStorage.getItem("match"));
  
  const initialState =
    match ? { isMatchIn: true, player: match }
    : { isMatchIn: false, player: null };
  
  export default function (state = initialState, action) {
    const { type, payload  } = action;
  
    switch (type) {
      case CREATE_MATCH_SUCCESS:
        return {
          ...state,
          isMatchIn: true,
          player:
            {
              name_match: payload.name_match,
              nickname: payload.nickname,
              position_player: 1
            }
        };
      case CREATE_MATCH_FAIL:
        return {
          ...state,
          isMatchIn: false,
          player: null
        };
      default:
        return state;
    }
  }