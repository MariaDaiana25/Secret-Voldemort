import {
    PROCLAMATION_SUCCESS,
    PROCLAMATION_FAIL,
  } from "../actions/types";
  
  const initialState = null;
  
  export default function (state = initialState, action) {
    const { type } = action;
    switch (type) {
      case PROCLAMATION_SUCCESS:
        return {
          ...state,
        };
      case PROCLAMATION_FAIL:
        return {
          ...state,
        };
      default:
        return state;
    }
  }
