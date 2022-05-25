export const setActiveActivity = (payload) => (dispatch) => {
  dispatch({ type: "SET_ACTIVE_TRANSPORT", payload: payload });
};

export const setFilteredTransport = (router) => async (dispatch) => {
  try {
    dispatch({
      type: "SET_FILTERED_TRANSPORTS_LOADING_TRUE",
    });
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/transport/?search=${
        router.query.search ? router.query.search : ""
      }&min_price=${
        router.query.min_price ? router.query.min_price : ""
      }&max_price=${
        router.query.max_price ? router.query.max_price : ""
      }&ordering=${router.query.ordering}`
    );
    dispatch({ type: "SET_ACTIVE_TRANSPORT", payload: response.data.results });
    dispatch({
      type: "SET_TRANSPORTS",
      payload: response.data.results,
    });
    dispatch({
      type: "SET_FILTERED_TRANSPORTS_LOADING_FALSE",
    });
  } catch (error) {
    console.log(error);
  }
};
