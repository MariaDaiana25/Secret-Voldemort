import API from "./api";

const spell_fortune = (name_match, nickname, position_player) => {
    return API.get(`spell_guess/${name_match}/${nickname}/${position_player}`)
    .then((response) => {
        return response.data
    });
};

const spell_kill = (name_match, nickname, position_player) => {
    return API.put(`spell_avada/${name_match}/${nickname}/${position_player}`)
    .then((response) => {
        return response.data;
    })
};

const change_state = (name_match, state_game) => {
    return API.put(`cambiar_estado_game/${name_match}/${state_game}`)
    .then((response) => {
        return response.data;
    });
};

export default { spell_fortune, spell_kill , change_state };