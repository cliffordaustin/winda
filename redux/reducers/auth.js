const signupState = {
  token: "",
  loginError: false,
  signupErrors: [],
};

const authenticationReducer = (state = signupState, action) => {
  switch (action.type) {
    case "SUPER_USER_SIGNUP":
      return { ...state, token: action.payload.token };

    case "USER_SIGNUP":
      return { ...state, token: action.payload.token };

    case "LOGIN":
      return { ...state, token: action.payload.token };

    case "LOGOUT":
      return { ...state, token: "" };

    case "ADD_SIGNUP_ERROR":
      return { ...state, signupErrors: action.payload.errors };

    case "CHANGE_LOGIN_ERROR_STATE":
      return { ...state, loginError: true };

    case "CHANGE_LOGIN_ERROR_FALSE":
      return { ...state, loginError: false };

    default:
      return state;
  }
};

export default authenticationReducer;
