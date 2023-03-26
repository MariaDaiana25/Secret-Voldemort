import {
    JOIN_MATCH_SUCCESS,
    JOIN_MATCH_FAIL
} from "../actions/types";

const join_match = JSON.parse(localStorage.getItem("join_match"));
  
const initialState =
  join_match ? { isJoinMatchIn: true, player: join_match }
  : { isJoinMatchIn: false, player: {} };


export default function (state = initialState, action) {
  const { type, payload  } = action;

  switch (type) {
    case JOIN_MATCH_SUCCESS:
      return {
        ...state,
        isJoinMatchIn: true,
        player:
          {
            name_match: payload.name_match, 
            nickname: payload.nickname,
            position_player: payload.position_player
          }    
      };
    case JOIN_MATCH_FAIL:
      return {
        ...state,
        isJoinMatchIn: false,
        player: null
      }
    default:
      return state;
  }
}