import {
    DATA_GAME_SUCCESS,
    DATA_GAME_FAIL,
    INIT_GAME
  } from "../actions/types";
    
  const data_match = JSON.parse(localStorage.getItem("data_match"));
  
  const initialState =
    data_match ? data_match
    : {name_match: "", max_players: 0, state_match: "",
      game_turn: 0, election_marker:0, state_game: INIT_GAME,
      players: []};
  
  export default function (state = initialState, action) {
    const { type, payload  } = action;
  
    switch (type) {
      case DATA_GAME_SUCCESS:
        return {
            ...state,
            name_match: payload.name_match,
            max_players: payload.max_players,
            state_match: payload.state_match,
            game_turn: payload.game_turn,
            election_marker: payload.election_marker,
            state_game: payload.state_game,
            number_proclamation_mortifagate: payload.number_proclamation_mortifagate,
            number_proclamation_order_fenix: payload.number_proclamation_order_fenix,
            winner: payload.winner,
            players: payload.players
        };
      case DATA_GAME_FAIL:
        return {
            ...state,
        };
      default:
        return state;
    }
  }