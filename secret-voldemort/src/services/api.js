import axios from "axios";
import authHeader from "./auth-header";

const URL = `http://127.0.0.1:8000/alfabeta/`;

export default axios.create({
    baseURL: URL,
    timeout: 0,
    headers: authHeader()
  });