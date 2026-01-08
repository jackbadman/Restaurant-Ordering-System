// Axios client configured for backend API.
import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:5001"
});
