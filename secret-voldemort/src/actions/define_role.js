import {
    SET_MESSAGE,
    CANDIDATE_DIRECTOR_SUCCESS,
    CANDIDATE_DIRECTOR_FAIL,
} from "./types";

import DefineRol from "../services/define_role.services";

export const define_role = (name_match, position_player, type_rol) => (dispatch) => {
    return DefineRol.define_role(name_match, position_player, type_rol).then(
      (data) => {
          if (0 === data.codigo) {  
          dispatch({
            type: CANDIDATE_DIRECTOR_SUCCESS,
          });
          return Promise.resolve()
        }else{
          dispatch({
            type: CANDIDATE_DIRECTOR_FAIL,
        });
        return Promise.reject(data.mensaje);
      }
    },  
        (error) => {
          const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
            error.message ||
            error.toString();
          
            dispatch({
              type: CANDIDATE_DIRECTOR_FAIL,
            });  
            
            dispatch({
              type: SET_MESSAGE,
              payload: message,
            });

            return Promise.reject(error);
        }
    );
  };