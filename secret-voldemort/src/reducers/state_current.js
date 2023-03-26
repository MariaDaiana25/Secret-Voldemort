import {
    INIT_GAME,
    DEFINE_DIRECTOR,
    VOTACION,
    SHOW_VOTACION,
    FINISH_GAME
  } from "../actions/types";
  
  const initialState = { state: INIT_GAME }
  
  export default function (state = initialState, action) {
    const { type } = action;
  
    switch (type) {
      case DEFINE_DIRECTOR:
        return {
          ...state,
          state: DEFINE_DIRECTOR
        };
        case VOTACION:
          return {
            ...state,
            state: VOTACION
          };
        case SHOW_VOTACION:
          return {
            ...state,
            state: SHOW_VOTACION
          };
        case FINISH_GAME:
          return {
            ...state,
            state: FINISH_GAME
          };
      default:
        return state;
    }
  }