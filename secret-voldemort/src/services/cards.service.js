import API from "./api";

const take_cards_MM = (name_match, position_player) => {
    return API.get(`extraer_cartas/${name_match}/${position_player}`)
    .then((response) => {
        return response.data;
      });
    };

const take_cards_D = (name_match, position_player, game_turn) => {
  return API.get(`extraer_cartas_director/${name_match}/${position_player}/${game_turn}`)
  .then((response) => {
      return response.data;
    });
  };


const discard_cards = (name_match, position_deck, nickname) => {
  return API.put(`descartar_carta/${name_match}/${position_deck}/${nickname}`)
  .then((response) => {
      return response.data;
    });
  };
  
const discard_cards_D = (name_match, position_deck, nickname) => {
  return API.put(`descartar_carta_D/${name_match}/${position_deck}/${nickname}`)
  .then((response) => {
      return response.data;
    });
  }; 

export default { take_cards_MM, take_cards_D , discard_cards, discard_cards_D };
