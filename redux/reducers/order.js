const orderState = {
  activeItem: null,
};

const orderReducer = (state = orderState, action) => {
  switch (action.type) {
    case "SET_ACTIVE_ITEM":
      return { ...state, activeItem: action.payload };
    default:
      return state;
  }
};

export default orderReducer;
