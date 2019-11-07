import axios from "axios";
import axiosMock from "../App/axiosMock";
import apiURL from "../api";
import PopupController from "../PopupController/PopupController";

const route = `${apiURL}/users/login`;

axiosMock.onPost(route).reply(200, {
  token: "fgewr234h482o3321j45o3j1"
});

// Action types

const LOG_IN = "log_in";
const LOG_OUT = "log_out";

// Reducer

const initialState = {
  user: localStorage.getItem("user") || "",
  pass: "",
  token: localStorage.getItem("token") || "",
  isLogged: Boolean(localStorage.getItem("token"))
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        pass: action.payload.pass,
        isLogged: true
      };
    case LOG_OUT:
      return {
        ...state,
        token: "",
        user: "",
        pass: "",
        isLogged: false
      };
    default:
      return state;
  }
};

// Actions creators

const logIn = (payload, dispatch) => {
  axios
    .post(route, payload)
    .catch(error => {
      PopupController.pushError({
        content: error.response.data
      });
    })
    .then(response => {
      payload.token = response.data.token;
      payload.isLogged = true;
      dispatch({
        type: LOG_IN,
        payload
      });

      localStorage.setItem("user", payload.user);
      localStorage.setItem("token", payload.token);
    });
};


const logOut = (payload, dispatch) => {
      payload = {};
      dispatch({
        type: LOG_OUT,
        payload
      });

      localStorage.clear();
};


// Map to props

const mapStateToProps = state => {
  return {
    isLogged: state.login.isLogged,
    user: state.login.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logIn: payload => logIn(payload, dispatch),
    logOut: payload => logOut(payload, dispatch)
  };
};

export { loginReducer, mapStateToProps, mapDispatchToProps, logIn, logOut };
