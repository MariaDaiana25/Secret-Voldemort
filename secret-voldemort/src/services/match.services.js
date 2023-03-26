import API from "./api";
import Swal from 'sweetalert2';

const match = (name_match, nickname, user_name) => {
  return API.post(`crear_partida`,
    JSON.stringify({
      name_match: name_match,
      nickname: nickname,
      user_name: user_name
  }))
  .then((response) => {
    if(0 === response.data.codigo)
      localStorage.setItem("match", JSON.stringify({
        name_match: name_match,
        nickname: nickname
      }));
    Swal.fire({title:response.data.mensaje,icon:'success',background:'#000000f5'});
    return response.data;
  }); 
};

const join_match = (name_match, nickname, user_name) => {
  return API.post(`unirse_partida`,
    JSON.stringify({
      name_match: name_match,
      nickname: nickname,
      user_name: user_name
  }))
  .then((response) => {
    if(0 === response.data.codigo)
      localStorage.setItem("join_match", JSON.stringify({
        name_match: name_match,
        nickname: nickname
      }));
      Swal.fire({title:response.data.mensaje,icon:'success',background:'#000000f5'});
    return response.data;
  });
};

const list_match = () => {
  return API.get(`list_match`)
  .then((response) => {
    if(0 === response.data.codigo) {
      localStorage.setItem("list_match", JSON.stringify({
        matchs: response.data.match
      }));
    } else {
      Swal.fire({title:response.data.mensaje,background:'#000000f5'});
    }
    return response.data;
  });
};


export default { match, join_match, list_match };
