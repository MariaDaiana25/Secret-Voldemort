import {
    DIRECTOR_SET,
    DIRECTOR_REMOVE
 } from "./types";

export const govermment_role = (state, govermment_role, nickname) => (dispatch) => {
    switch(state) {
        case DIRECTOR_SET:
            return  dispatch({
                type: DIRECTOR_SET,
                payload: { 
                    govermment_role: govermment_role,
                    nickname_D: nickname
                 },
              });
        case DIRECTOR_REMOVE:
            return  dispatch({
                type: DIRECTOR_REMOVE
              });
        default:
            return null;
    };
};
  