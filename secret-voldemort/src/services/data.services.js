import API from "./api";

const get_data_players = (name_match) => {
    return API.get(`obtener_datos/${name_match}`)
    .then((response) => {
        if(0 === response.data.codigo)
          localStorage.setItem("data_match", JSON.stringify({
            name_match: name_match,
            max_players: response.data.cantidad_jugadores,
            state_match: response.data.state_match,
            game_turn: response.data.gameTurn,
            election_marker: response.data.electionMarker,
            state_game: response.data.state_game,
            number_proclamation_mortifagate: response.data.number_proclamation_mortifagate,
            number_proclamation_order_fenix: response.data.number_proclamation_order_fenix,
            winner: response.data.winner,
            players: response.data.jugadores
          }));
        return response.data;
    });
};

export default { get_data_players };