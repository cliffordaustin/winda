export const setActiveActivity = (payload) => (dispatch) => {
  dispatch({ type: "SET_ACTIVE_ACTIVITY", payload: payload });
};

export const setFilteredActivities = (router) => async (dispatch) => {
  try {
    dispatch({
      type: "SET_FILTERED_ACTIVITIES_LOADING_TRUE",
    });
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/stays/?search=${
        router.query.search ? router.query.search : ""
      }&type_of_stay=${
        router.query.type_of_stay ? router.query.type_of_stay : ""
      }&min_price=${
        router.query.min_price ? router.query.min_price : ""
      }&max_price=${
        router.query.max_price ? router.query.max_price : ""
      }&ordering=${router.query.ordering}`
    );
    dispatch({ type: "SET_ACTIVE_ACTIVITY", payload: response.data.results });
    dispatch({
      type: "SET_ACTIVITIES",
      payload: response.data.results,
    });
    dispatch({
      type: "SET_FILTERED_ACTIVITIES_LOADING_FALSE",
    });
  } catch (error) {
    console.log(error);
  }
};
