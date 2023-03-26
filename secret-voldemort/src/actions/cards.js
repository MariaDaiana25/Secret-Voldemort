import {
  SET_MESSAGE,
  DISCARD_CARDS_SUCCESS,
  DISCARD_CARDS_FAIL,
  EXTRACT_CARDS_SUCCESS,
  EXTRACT_CARDS_FAIL,
} from "./types";

import CardsService from "../services/cards.service";

export const take_cards = (name_match, position_player) => (dispatch) => {
    return CardsService.take_cards(name_match, position_player).then(
      (data) => {
        if (0 === data.codigo) {
          dispatch({
            type: EXTRACT_CARDS_SUCCESS,
            payload: {
              cards: data.list_card
            }
          });
          return Promise.resolve(); 
        } else {
          dispatch({
          type: EXTRACT_CARDS_FAIL,
        });
          return Promise.reject(data.mensaje);
        }
      }, (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
  
        dispatch({
          type: EXTRACT_CARDS_FAIL,
        });
        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });
        return Promise.reject(error);
      }
    );
  };
  
  export const discard_cards = (name_match, position_deck, nickname) => (dispatch) => {
      return CardsService.discard_cards(name_match, position_deck, nickname).then(
        (data) => {
          if (0 === data.codigo) {
            dispatch({
              type: DISCARD_CARDS_SUCCESS,
            });
            return Promise.resolve(); 
          } else {
            dispatch({
            type: DISCARD_CARDS_FAIL,
          });
            return Promise.reject(data.mensaje);
          }
        }, (error) => {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
    
          dispatch({
            type: DISCARD_CARDS_FAIL,
          });
          dispatch({
            type: SET_MESSAGE,
            payload: message,
          });
          return Promise.reject(error);
        }
      );
    };
