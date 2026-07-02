import axios from "axios";
import { TokenUserInfomation } from "./app/shared/helpers/userConfig";

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.common["Authorization"] = "Bearer " + TokenUserInfomation().AUTH_TOKEN;
axios.defaults.baseURL = "/";
// Add a request interceptor
// axios.interceptors.request.use(function (config) {
//     function(config){

//     }

//   }, function (error) {
//     // Do something with request error
//     return Promise.reject(error);
//   });

// // Add a response interceptor
// axios.interceptors.response.use(function (response) {
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     return response;
//   }, function (error) {
//     // Any status codes that falls outside the range of 2xx cause this function to trigger
//     // Do something with response error
//     return Promise.reject(error);
//   });
