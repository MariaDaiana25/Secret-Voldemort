import API from "./api";

const init_game = (name_match, nickname) => {
  return API.put(`init_game/${name_match}/${nickname}`)
  .then((response) => {
    return response.data;
  });
};

const number_players = (name_match) => {
  return API.get(`number_players/${name_match}`)
  .then((response) => {
    return response.data;
  });
};

const get_status_match = (name_match) => {
  return API.get(`get_status_match/${name_match}`)
  .then((response) => {
    return response.data;
  });
};

export default { init_game, number_players, get_status_match };