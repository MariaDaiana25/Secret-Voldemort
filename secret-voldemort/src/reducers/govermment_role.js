import {
    DIRECTOR_SET,
    DIRECTOR_REMOVE
  } from "../actions/types";
  
const initialState = {govemment_role: "", nickname_D: ""};
  
export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case DIRECTOR_SET:
      return {
        ...state,
        govemment_role: payload.govemment_role,
        nickname_D: payload.nickname_D
      };
    case DIRECTOR_REMOVE:
      return {
        ...state,
        govemment_role: "",
        nickname_D: ""
      };
    default:
      return state;
  }
}