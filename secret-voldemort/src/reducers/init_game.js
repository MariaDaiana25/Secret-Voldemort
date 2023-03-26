import {
    INIT_GAME_SUCCESS,
    INIT_GAME_FAIL,
    NUMBER_PLAYERS_SUCCESS,
    NUMBER_PLAYERS_FAIL,
    STATE_MATCH_SUCCESS,
    STATE_MATCH_FAIL
  } from "../actions/types";
  
  const initialState = { init_game: false };
  
  export default function (state = initialState, action) {
    const { type } = action;
  
    switch (type) {
      case INIT_GAME_SUCCESS:
        return {
          ...state,
          init_game: true
        };
      case INIT_GAME_FAIL:
        return {
          ...state,
          init_game: false
        };
      case NUMBER_PLAYERS_SUCCESS:
        return {
          ...state,
        };
      case NUMBER_PLAYERS_FAIL:
        return {
          ...state,
        };
      case STATE_MATCH_SUCCESS:
        return {
          ...state,
        };
      case STATE_MATCH_FAIL:
        return {
          ...state,
        };
      default:
        return state;
    }
  }