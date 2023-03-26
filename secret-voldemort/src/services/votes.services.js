import API from "./api";

const suffrage = (name_match, position_player, vote) => {
  return API.put(`votacion/${name_match}/${position_player}/${vote}`)
  .then((response) => {
    return response.data;
  });
};

const validar_gobierno = (name_match) => {
  return API.get(`validar_gobierno/${name_match}`)
  .then((response) => {
    return response.data;
  });
};

const view_results = (name_match) => {
  return API.get(`view_results/${name_match}`)
  .then((response) => {
    return response.data;
  });
};

const change_status_game = (name_match, winner_vote) => {
  return API.put(`count_result/${name_match}/${winner_vote}`)
  .then((response) => {
    return response.data;
  });
};

export default { suffrage, validar_gobierno, view_results, change_status_game };