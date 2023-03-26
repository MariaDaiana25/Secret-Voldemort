import {
    CANDIDATE_DIRECTOR_SUCCESS,
    CANDIDATE_DIRECTOR_FAIL,
} from "../actions/types";
   
  const initialState = { existCandidateDirector: false }

  export default function (state = initialState, action) {
    const { type } = action;
  
    switch (type) {
      case CANDIDATE_DIRECTOR_SUCCESS:
        return {
          ...state,
          existCandidateDirector: true
        };
      case CANDIDATE_DIRECTOR_FAIL:
        return {
          ...state,
          existCandidateDirector: false
        };
      default:
        return state;
    }
  }
      
      // case CANDIDATE_DIRECTOR_RESET:
      //   return {
      //     ...state,
      //     existCandidateDirector: false
      //   }   