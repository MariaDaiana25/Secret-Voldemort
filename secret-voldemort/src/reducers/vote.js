import {
    VOTE_SUCCESS,
    VOTE_FAIL,
    VOTE_VALIDATION,
    VOTE_VALIDATION_FAIL
  } from "../actions/types";
  
  const initialState = {vote: false, vote_validate: false};
  
export default function (state = initialState, action) {
  const { type } = action;
  switch (type) {
    case VOTE_SUCCESS:
      return {
        ...state,
        vote: true,
      };
    case VOTE_FAIL:
      return {
        ...state,
        vote: false,
      };
    case VOTE_VALIDATION:
      return {
        ...state,
        vote_validate: true,
      };
    case VOTE_VALIDATION_FAIL:
      return {
        ...state,
        vote_validate: false,
      };
    default:
      return state;
  }
}