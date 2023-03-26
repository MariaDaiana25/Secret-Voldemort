import API from "./api";

const define_role = (name_match, position_player, type_rol) => {
    return API.put(`define_role/${name_match}/${position_player}/${type_rol}`) 
    .then((response) => {
      return response.data;
    });
  };
  
  export default { define_role };