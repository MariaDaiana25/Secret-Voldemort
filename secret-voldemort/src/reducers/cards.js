import {
    EXTRACT_CARDS_SUCCESS,
    EXTRACT_CARDS_FAIL,
    DISCARD_CARDS_SUCCESS,
    DISCARD_CARDS_FAIL,
  } from "../actions/types";
    
  const list_cards = JSON.parse(localStorage.getItem("list_cards"));
  
  const cardsState = list_cards ? {cards: list_cards} : null;
  
  export default function (state = cardsState, action) {
    const { type, payload  } = action;
  
    switch (type) {
      case EXTRACT_CARDS_SUCCESS:
        return {
          ...state,
          cards: payload.cards
        }
      case EXTRACT_CARDS_FAIL:
        return {
          ...state
        }
      case DISCARD_CARDS_SUCCESS:
        return {
          ...state,
          cards: payload.cards,
        };
      case DISCARD_CARDS_FAIL:
        return {
          ...state,
        };
      default:
        return state;
    }
  }
