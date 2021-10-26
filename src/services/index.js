import axios from "axios";

export const apiData = () => {
  return axios.get("https://stocksportfolioapi.herokuapp.com/");
};

// http://localhost:3001/
