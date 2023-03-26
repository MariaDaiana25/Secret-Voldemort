import API from "./api";
import Swal from 'sweetalert2';

const register = (username, password, email, photo) => {
  return API.post(`registrar_usuario`, JSON.stringify({
    user_name: username,
    password: password,
    email: email,
    state_user: "registered",
    photo: photo
  }))
  .then((response) => {
        if(0 === response.data.codigo){
          Swal.fire({
            title:'Registrado Exitosamente',
            icon:'success',
            background:'#000000f5'})
        } else {
          Swal.fire({
            title:'Usuario Existente',
            icon:'error',
            background:'#000000f5'})
        }
  });
};

const login = (email, password) => {
  return API.post(`login`, JSON.stringify({
      email,
      password
    }))
    .then((response) => {
      if (0 === response.data.codigo) {
        localStorage.setItem("user", JSON.stringify({
          email: email,
          token: response.data.token,
          user_name: response.data.user_name
        }));
      } else {
        Swal.fire({
          title:response.data.mensaje,
          icon:'error',
          background:'#000000f5'});
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("match");
  localStorage.removeItem("join_match");
  localStorage.removeItem("data_match");
  localStorage.removeItem("list_match");
};

export default { register, login, logout };
