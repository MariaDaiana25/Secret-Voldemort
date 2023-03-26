import API from "./api";

const proclamation = (name_match, position_deck, nickname) => {
  return API.put(`proclamar_carta/${name_match}/${position_deck}/${nickname}`)
  .then((response) => {
    return response.data;
  });
};

export default { proclamation };
