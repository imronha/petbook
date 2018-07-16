import axios from "axios";

const setAuthToken = token => {
  if (token) {
    // If token exists, use for every request
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    // If there isnt a token, delete header
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;
