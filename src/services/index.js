import axios from "axios";

export const apiData = () => {
  return axios.get("http://localhost:3001/");
};
