const transportState = {
  transports: [],
  activeTransport: null,
  filterTransportsLoading: false,
};

const transportReducer = (state = transportState, action) => {
  switch (action.type) {
    case "SET_TRANSPORTS":
      return { ...state, transports: action.payload };

    case "SET_ACTIVE_TRANSPORT":
      return { ...state, activeTransport: action.payload };

    case "SET_FILTERED_TRANSPORTS_LOADING_FALSE":
      return { ...state, filterTransportsLoading: false };

    case "SET_FILTERED_TRANSPORTS_LOADING_TRUE":
      return { ...state, filterTransportsLoading: true };

    default:
      return state;
  }
};

export default transportReducer;
