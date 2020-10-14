import axios from "axios";

export default axios.create({

    baseURL: "http://15.207.17.217:3000/",

    timeout: 200000,

    headers: {}
});
